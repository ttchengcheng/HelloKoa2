const path = require('path')
const exiftool = require('exiftool-vendored').exiftool

async function getResInfo (dir, info) {
  let tags = null
  try {
    tags = await exiftool.read(path.join(dir, info.dest))
  } catch (err) {
    console.error(err)
    info.stat = 'err: ' + JSON.stringify(err)
    return false
  }

  if (!tags) { return false }
  console.log(tags)

  info.path = tags.SourceFile
  info.date = ('' + (tags.CreateDate || tags.ModifyDate || tags.FileModifyDate)) || ''
  info.width = tags.ImageWidth
  info.height = tags.ImageHeight
  console.log(info)

  return true
};

module.exports = getResInfo

// usage & test
// for (let f of ['11.jpg', '22.jpg', '33.png', 'oceans.mp4']) {
//   getResInfo(f).then((data) => { console.log(data); });
// }
