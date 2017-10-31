const path = require('path')
const exiftool = require('exiftool-vendored').exiftool

/*
 * file exif parse: https://github.com/mceachen/exiftool-vendored.js
 *      ref: /lib/res-info.js
 *
 * usage & test
 * for (let f of ['11.jpg', '22.jpg', '33.png', 'oceans.mp4']) {
 *   getResInfo(f).then((data) => { console.log(data); });
 * }
 */
async function getResInfo (info) {
  return new Promise(function (resolve, reject) {
    exiftool.read(path.join(info.dir, info.dest))
      .then(tags => {
        console.log(tags)
        info.path = tags.SourceFile
        info.date = ('' + (tags.CreateDate || tags.ModifyDate || tags.FileModifyDate)) || ''
        info.width = tags.ImageWidth
        info.height = tags.ImageHeight
        console.log(info)
        resolve(info)
      })
      .catch(err => { info.step = 'exifinfo'; reject(err) })
  })
}
module.exports = getResInfo
