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

module.exports = getAssetType
