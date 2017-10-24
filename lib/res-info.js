const exiftool = require('exiftool-vendored').exiftool

async function getResInfo (filePath) {
  let tags = null
  try {
    // Read all metadata tags in `path/to/image.jpg`.
    // Returns a `Promise<Tags>`.
    tags = await exiftool.read(filePath)
  } catch (err) {
    console.error(err)
  }

  if (!tags) { return {} }
  let date = ('' + (tags.CreateDate || tags.ModifyDate || tags.FileModifyDate)) || ''
  return { file: tags.FileName, path: tags.SourceFile, date: date }
};

module.exports = getResInfo

// usage & test
// for (let f of ['11.jpg', '22.jpg', '33.png', 'oceans.mp4']) {
//   getResInfo(f).then((data) => { console.log(data); });
// }
