const fs = require('fs')
const path = require('path')
const sharp = require('sharp')
const ffmpeg = require('fluent-ffmpeg')
const condition = require('../lib/util').condition
const config = require('../config')
const ChecksumStream = require('../lib/file-checksum')
const getResInfo = require('../lib/res-info')
const Asset = require('../model/asset')
const nanoId = require('../lib/util').nanoId

/*
 * process routine:
 *      -> (ok) upload file and compute checksum
 *      -> (ok) use checksum to check duplication
 *      -> create thumbnail
 *      -> get file info
 *      -> combine with thumbnail info
 *      -> combine with other data fields: rating, tags
 *      -> save info to database
 *      -> done.
 *
 * file exif parse: https://github.com/mceachen/exiftool-vendored.js
 *      ref: /lib/res-info.js
 *
 * video thumbnail: https://github.com/fluent-ffmpeg/node-fluent-ffmpeg
 *
 *      ffmpeg('/path/to/video.avi')
 *      .on('filenames', function(filenames) {
 *        console.log('Will generate ' + filenames.join(', '))
 *      })
 *      .on('end', function() {
 *        console.log('Screenshots taken');
 *      })
 *      .screenshots({
 *        // Will take screens at 20%, 40%, 60% and 80% of the video
 *        count: 4,
 *        folder: '/path/to/output'
 *      });
 */

// check if the request is upload
function isMultipart (ctx) {
  return ctx.method === 'POST' || ctx.request.type === 'multipart/form-data'
}

function errHandler (info, err) {
  console.error(err)
  info.stat = 'err: ' + JSON.stringify(err)
}

function assetDir () {
  const dir = path.join(__dirname, '/../' + config.file.dir)
  const thumbnailDir = path.join(__dirname, '/../' + config.file.thumbnail.dir)

  if (!fs.existsSync(dir)) { fs.mkdirSync(dir) }
  if (!fs.existsSync(thumbnailDir)) { fs.mkdirSync(thumbnailDir) }

  return [dir, thumbnailDir]
}

async function doUpload (dir, info) {
  return new Promise(function (resolve, reject) {
    info.dest = info.file
    try {
      fs.accessSync(path.join(dir, info.file))
      const oPath = path.parse(info.file)
      info.dest = oPath.name + '(' + nanoId() + ')' + oPath.ext
    } catch (err) { }

    const iStream = fs.createReadStream(info.path)
    const oStream = fs.createWriteStream(path.join(dir, info.dest))
    const mStream = new ChecksumStream(config.file.hash)

    iStream.on('error', err => reject(err))
    oStream.on('error', err => reject(err))
    mStream.on('done', function (checksum) {
      info.checksum = checksum
      console.log('. [upload] %s > %s (md5: %s)',
        info.file, oStream.path, checksum)
      resolve(true)
    })
    iStream.pipe(mStream).pipe(oStream)
  })
  .catch(errHandler.bind(undefined, info))
}

function getAssetType (info) {
  if (/^image\//.test(info.mime)) {
    info.type = 1
  } else if (/^video\//.test(info.mime)) {
    info.type = 2  // video
  } else {
    info.type = 0  // not supported
  }
}

function getImageThumbnail (info, dir, thumbnailDir) {
  const sourceFile = path.join(dir, info.dest)
  let [x, y] = info.width < info.height ? [null, 256] : [256, null]
  return sharp(sourceFile)
      .resize(x, y)  // resize
      .toFile(path.join(thumbnailDir, path.basename(sourceFile)))
      .catch(errHandler.bind(undefined, info))
}
const getVideoThumbnail = function (info, dir, thumbnailDir) {
  const sourceFile = path.join(dir, info.dest)
  return new Promise(function (resolve, reject) {
    ffmpeg(sourceFile)
      .on('end', function () {
        resolve()
      })
      .on('error', function (err) {
        reject(err)
      })
      .screenshots({
        count: 1,
        timemarks: ['10%'],
        filename: 'thumbnail-%f.png'
      }, thumbnailDir)
  })
  .catch(errHandler.bind(undefined, info))
}

async function genThumbnail (info, dir, thumbnailDir) {
  switch (info.type) {
    case 1: await getImageThumbnail(info, dir, thumbnailDir); break
    case 2: await getVideoThumbnail(info, dir, thumbnailDir); break
    default: break
  }
  console.log('. [thumbnail] %s done', info.file)
  return info.stat === 'ok'
}

function saveToDb (info) {
  let asset = new Asset({
    file: info.file,
    checksum: info.checksum,
    datetime: info.date,
    type: info.type,
    width: info.width,
    height: info.height,
    up: 0
  })

  return asset.save()
  .catch(errHandler.bind(undefined, info))
}

function upload () {
  return condition(isMultipart, async function (ctx, next) {
    const [dir, thumbnailDir] = assetDir()

    const stat = []
    for (var file of ctx.request.files) {
      if (!file || !file.name) { continue }

      let info = { file: file.name, mime: file.type, path: file.path }

      // if no file is selected actually
      getAssetType(info)
      console.log('. [file type] %s: %d', file.name, info.type)
      if (!info.type) { continue }

      // upload and generate checksum
      if (!await doUpload(dir, info)) { continue }

      // check asset duplicating
      if (await Asset.exist(info.checksum)) { info.stat = 'exist'; continue }

      // get exif info
      if (!await getResInfo(dir, info)) { continue }

      // create thumbnail
      let thumbnailOk = await genThumbnail(info, dir, thumbnailDir)
      if (!thumbnailOk) { continue }

      // save record to db
      await saveToDb(info)
      console.log(2)
      file.stat = 'ok'
      console.log('. [save] %s done', path.basename(file.name))

      stat.push(info)
    }

    console.log(stat)
    ctx.status = 200
    ctx.body = JSON.stringify(stat)
  })
}

module.exports = upload
