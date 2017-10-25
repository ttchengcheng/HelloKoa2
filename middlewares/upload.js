const fs = require('fs')
const path = require('path')
const Jimp = require('jimp')
const condition = require('../lib/util').condition
const config = require('../config')
const ChecksumStream = require('../lib/file-checksum')
const getResInfo = require('../lib/res-info')
const Asset = require('../model/asset')
/*
 * process routine:
 *      -> (ok) upload file and compute checksum
 *      -> use checksum to check duplication
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

function assetDir () {
  const dir = path.join(__dirname, '/../' + config.file.dir)
  const thumbnailDir = path.join(__dirname, '/../' + config.file.thumbnail.dir)

  if (!fs.existsSync(dir)) { fs.mkdirSync(dir) }
  if (!fs.existsSync(thumbnailDir)) { fs.mkdirSync(thumbnailDir) }

  return [dir, thumbnailDir]
}

async function doUpload (dir, file) {
  return new Promise(function (resolve, reject) {
    const iStream = fs.createReadStream(file.path)
    const oStream = fs.createWriteStream(path.join(dir, file.name))
    const mStream = new ChecksumStream(config.file.hash)
    mStream.on('done', function (checksum) {
      console.log(
          'uploading %s -> %s, checksum is %s',
          file.name, oStream.path, checksum)
      resolve(checksum)
    })
    iStream.pipe(mStream).pipe(oStream)
  })
}

function getAssetType (file) {
  if (!file || !file.name) {
    return -1  // invalid
  }
  const ext = path.extname(file.name).toLocaleLowerCase()
  if (ext === '.jpg' || ext === '.jpeg' || ext === '.png') {
    return 1  // image
  }
  if (ext === '.mp4') {
    return 2  // video
  } else {
    console.error(`Unknow file type for file (${file.name})`)
    return -2  // not supported
  }
}

async function genThumbnail (fileType, sourceFile, thumbnailDir) {
  let thumbnail = path.basename(sourceFile)
  await Jimp.read(sourceFile)
      .then(function (image) {
        let x = 256
        let y = Jimp.AUTO
        if (image.bitmap.width < image.bitmap.height) {
          x = Jimp.AUTO
          y = 256
        }
        image
            .resize(x, y)  // resize
            .quality(config.file.thumbnail.quality)   // set JPEG quality
            .write(path.join(thumbnailDir, thumbnail))
      })
      .catch(function (err) {
        console.error(err)
        thumbnail = ''
      })

  return thumbnail
}

function saveToDb (file, checksum, date, fileType, thumbnail) {
  let asset = new Asset({
    file: file,
    checksum: checksum,
    datetime: date,
    type: fileType,
    thumbnail: thumbnail,
    up: 0
  })

  return asset.save()
}
// handle upload
function upload () {
  return condition(isMultipart, async function (ctx, next) {
    // create the dir if it does not exist
    let stat = {err: [], exist: [], ok: []}

    const [dir, thumbnailDir] = assetDir()

    for (var file of ctx.request.files) {
      // if no file is selected actually
      let fileType = getAssetType(file)
      if (fileType < 0) { stat.err.push(file.name); continue }

      // upload and generate checksum
      let checksum = await doUpload(dir, file)
      if (!checksum) { stat.err.push(file.name); continue }

      // check asset duplicating
      if (await Asset.exist(checksum)) { stat.exist.push(file.name); continue }

      let serverFilePath = path.join(dir, file.name)

      // get exif info
      let info = await getResInfo(serverFilePath)

      // create thumbnail
      let [thumbnailOk, thumbnail] = await genThumbnail(fileType, serverFilePath, thumbnailDir)
      if (!thumbnailOk) { stat.err.push(file.name); continue }

      // save record to db
      await saveToDb(file.name, checksum, info.date, fileType, thumbnail)
      stat.ok.push(file.name)
    }

    console.log(stat)
    ctx.status = 200
    ctx.body = JSON.stringify(stat)

    // TODO: client-side progress display
  })
}

module.exports = upload
