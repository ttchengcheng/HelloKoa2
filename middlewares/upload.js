const fs = require('fs')
const path = require('path')
const condition = require('../lib/util').condition
const config = require('../config')
const ChecksumStream = require('../lib/file-checksum')
const getResInfo = require('./upload/res-info')
const getThumbnail = require('./upload/thumbnail')
const saveToDb = require('./upload/db-upload-info').saveToDb
const infoNotExist = require('./upload/db-upload-info').infoNotExist
const nanoId = require('../lib/util').nanoId
const WebSocketServer = require('../websocket')

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

function assetDir () {
  const dir = path.join(__dirname, '/../' + config.file.dir)
  const thumbnailDir = path.join(__dirname, '/../' + config.file.thumbnail.dir)

  if (!fs.existsSync(dir)) { fs.mkdirSync(dir) }
  if (!fs.existsSync(thumbnailDir)) { fs.mkdirSync(thumbnailDir) }

  return [dir, thumbnailDir]
}

async function doUpload (info) {
  return new Promise(function (resolve, reject) {
    info.dest = info.file
    try {
      fs.accessSync(path.join(info.dir, info.file))
      const oPath = path.parse(info.file)
      info.dest = oPath.name + '(' + nanoId() + ')' + oPath.ext
    } catch (err) { }

    const iStream = fs.createReadStream(info.path)
    const oStream = fs.createWriteStream(path.join(info.dir, info.dest))
    const mStream = new ChecksumStream(config.file.hash)

    const onerr = function (err) { info.step = 'write-file'; reject(err) }
    iStream.on('error', onerr)
    oStream.on('error', onerr)
    mStream.on('error', onerr)

    mStream.on('done', function (checksum) {
      info.checksum = checksum
      console.log('. [upload] %s > %s (md5: %s)',
        info.file, oStream.path, checksum)
      resolve(info)
    })
    iStream.pipe(mStream).pipe(oStream)
  })
}

async function getAssetType (info) {
  return new Promise(function (resolve, reject) {
    setTimeout(() => {
      if (/^image\//.test(info.mime)) {
        info.type = 1
        resolve(info)
      } else if (/^video\//.test(info.mime)) {
        info.type = 2  // video
        resolve(info)
      } else {
        info.type = 0  // not supported
        info.step = 'get-file-type'
        reject(new Error('unsupported type'))
      }
    }, 0)
  })
}

function upload () {
  return condition(isMultipart, async function (ctx, next) {
    const [dir, thumbnailDir] = assetDir()

    const details = []
    const client = ctx.request.fields.nano
    const wss = WebSocketServer.instance()
    for (var file of ctx.request.files) {
      if (!file || !file.name) { continue }

      let info = {
        file: file.name,
        mime: file.type,
        path: file.path,
        dir: dir,
        tdir: thumbnailDir,
        stat: 'ok'
      }
      details.push(info)

      // if no file is selected actually
      getAssetType(info)
        .then(doUpload)
        .then(infoNotExist)
        .then(getResInfo)
        .then(getThumbnail)
        .then(saveToDb)
        .catch((err) => {
          console.error(err)
          info.stat = 'err'
          info.err = err.message || err
        })
        .then(() => {
          wss.sendMessage(client, JSON.stringify(info))
        })
    }

    console.log(details)
    ctx.status = 200
    ctx.body = JSON.stringify(details)
  })
}

module.exports = upload
