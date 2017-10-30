const sharp = require('sharp')
const ffmpeg = require('fluent-ffmpeg')
const path = require('path')

function genImageThumbnail (info) {
  return new Promise(function (resolve, reject) {
    const sourceFile = path.join(info.dir, info.dest)
    let [x, y] = info.width < info.height ? [null, 256] : [256, null]
    sharp(sourceFile)
        .resize(x, y)  // resize
        .toFile(path.join(info.tdir, path.basename(sourceFile)))
        .then(() => { resolve(info) })
        .catch(err => { info.step = 'thumbnail'; reject(err) })
  })
}

function genVideoThumbnail (info) {
  return new Promise(function (resolve, reject) {
    const sourceFile = path.join(info.dir, info.dest)
    ffmpeg(sourceFile)
      .on('end', function () { resolve(info) })
      .on('error', function (err) { info.step = 'thumbnail'; reject(err) })
      .screenshots({
        count: 1,
        timemarks: ['10%'],
        filename: 'thumbnail-%f.png'
      }, info.tdir)
  })
}

function genThumbnail (info) {
  switch (info.type) {
    case 1:
      return genImageThumbnail(info)
    case 2:
      return genVideoThumbnail(info)
    default:
      return Promise.resolve(info)
  }
}

module.exports = genThumbnail
