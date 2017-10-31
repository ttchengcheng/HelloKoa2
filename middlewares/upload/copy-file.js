const fs = require('fs')
const path = require('path')
const config = require('../../config')
const ChecksumStream = require('../../lib/file-checksum')
const nanoId = require('../../lib/util').nanoId

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

module.exports = doUpload
