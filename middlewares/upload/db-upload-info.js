const Asset = require('../../model/asset')

exports.saveToDb = function (info) {
  return new Promise(function (resolve, reject) {
    let asset = new Asset({
      file: info.file,
      checksum: info.checksum,
      datetime: info.date,
      type: info.type,
      width: info.width,
      height: info.height,
      up: 0
    })

    asset.save()
      .then(() => { resolve(info) })
      .catch(err => { info.step = 'save-to-db'; reject(err) })
  })
}

exports.infoNotExist = async function (info) {
  return new Promise(function (resolve, reject) {
    Asset.notExist(info.checksum).then((value) => {
      if (value) {
        resolve(info)
      } else {
        info.step = 'check-exist'
        reject(new Error('already exist'))
      }
    })
  })
}
