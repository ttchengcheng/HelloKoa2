const mongoose = require('mongoose')
const db = require('./db')

const AssetSchema = new mongoose.Schema({
  // file-name of the asset
  file: String,
  // checksum: file checksum
  checksum: String,
  // datetime: file created time
  datetime: String,
  // type: 1-pic 2-video 3-text 4-data 5 event
  type: Number,
  // file-name of the thumbnail
  thumbnail: String,
  // times being lauded
  up: [Number]
})

AssetSchema.statics.fav = async function (file, useId) {
  let that = this
  return new Promise(function (resolve, reject) {
    that.find({ 'file': file }, (err, asset) => {
      if (err) {
        reject(err)
      } else {
        if (asset) {
          let index = asset.up.indexOf(useId)
          if (index >= 0) {
            asset.up.splice(index, 1)
          } else {
            asset.up.push(useId)
          }
          asset.save()
        }
        resolve()
      }
    })
  })
}
AssetSchema.statics.notExist = async function (checksum) {
  let that = this
  return new Promise(function (resolve, reject) {
    that.find({ 'checksum': checksum }, null, null,
    (err, asset) => {
      if (err) {
        reject(err)
      } else {
        resolve(!(asset && asset.length > 0))
      }
    })
  })
}
const AssetModel = db.model('Asset', AssetSchema)

module.exports = AssetModel
