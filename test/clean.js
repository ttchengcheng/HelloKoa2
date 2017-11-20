const fs = require('fs')

const mongo = require('mongodb').MongoClient
const dbUrl = 'mongodb://localhost:27017/test'

const connAsync = function (url) {
  return new Promise(function (resolve, reject) {
    mongo.connect(url, (err, db) => {
      err ? console.error(err) : console.log(`> connected: ${dbUrl}`)
      resolve(db)
    })
  })
}
const dropAsync = function (col, db) {
  return new Promise(function (resolve, reject) {
    db.collection(col).drop((err, res) => {
      if (err) { resolve(null) }
      console.log(`> collection dropped: (${col}): ${res}`)
      resolve(db)
    })
  })
}

const deleteFolderRecursive = function (path, deleteThis) {
  if (!fs.existsSync(path)) { return }

  fs.readdirSync(path).forEach(function (file, index) {
    let curPath = path + '/' + file
    if (fs.lstatSync(curPath).isDirectory()) { // recurse
      deleteFolderRecursive(curPath, true)
    } else { // delete file
      fs.unlinkSync(curPath)
    }
  })
  deleteThis && fs.rmdirSync(path)
}

let db = null
const proc = async () => {
  db = await connAsync(dbUrl)
  if (!db) { return }
  await dropAsync('asset', db)
  await dropAsync('log', db)
}

proc().then(() => {
  db && db.close()
  console.log('> db closed')
})

deleteFolderRecursive('assets')
