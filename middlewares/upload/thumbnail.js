const sharp = require('sharp')
const ffmpeg = require('fluent-ffmpeg')
const path = require('path')
const config = require('../../config')

/**
 * https://github.com/lovell/sharp
 * @private
 */
function _genImageThumbnail (info) {
  return new Promise(function (resolve, reject) {
    const sourceFile = path.join(info.dir, info.dest)
    const size = config.file.thumbnail.size || 500
    let [x, y] = info.width < info.height ? [null, size] : [size, null]
    sharp(sourceFile)
        .resize(x, y)  // resize
        .toFile(path.join(info.tdir, path.basename(sourceFile)))
        .then(() => { resolve(info) })
        .catch(err => { info.step = 'thumbnail'; reject(err) })
  })
}

/**
 * https://github.com/fluent-ffmpeg/node-fluent-ffmpeg
 * @private
 */
function _genVideoThumbnail (info) {
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
/**
 * generate thumbnail for images and videos
 *
 * file types supported: jpg/png/mp4
 *
 * @param {any} info
 * @returns {Promise<info>}
 */
function genThumbnail (info) {
  switch (info.type) {
    case 1:
      return _genImageThumbnail(info)
    case 2:
      return _genVideoThumbnail(info)
    default:
      return Promise.resolve(info)
  }
}

module.exports = genThumbnail
