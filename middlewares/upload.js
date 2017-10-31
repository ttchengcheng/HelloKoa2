const fs = require('fs')
const path = require('path')
const condition = require('../lib/util').condition
const config = require('../config')
const getType = require('./upload/file-type')
const getResInfo = require('./upload/res-info')
const getThumbnail = require('./upload/thumbnail')
const copyFile = require('./upload/copy-file')
const saveToDb = require('./upload/db-upload-info').saveToDb
const infoNotExist = require('./upload/db-upload-info').infoNotExist
const WebSocketServer = require('../websocket')

/*
 * process routine:
 *      -> (ok) upload file and compute checksum
 *      -> (ok) use checksum to check duplication
 *      -> (ok) create thumbnail
 *      -> (ok) get file info
 *      -> (ok) combine with thumbnail info
 *      -> (ok) combine with other data fields: rating, tags
 *      -> (ok) save info to database
 *      -> done.
 */

// check if the request is upload
function isMultipart (ctx) {
  return ctx.method === 'POST' || ctx.request.type === 'multipart/form-data'
}

function assetDir () {
  const dir = path.join(__dirname, '/../' + config.file.dir)
  const thumbnailDir = path.join(__dirname, '/../' + config.file.thumbnail.dir)

  if (!fs.existsSync(dir)) { fs.mkdirSync(dir) }
  if (!fs.existsSync(thumbnailDir)) { fs.mkdirSync(thumbnailDir) }

  return [dir, thumbnailDir]
}

function upload () {
  return condition(isMultipart, async function (ctx, next) {
    const [dir, thumbnailDir] = assetDir()
    const details = []
    const tasks = []

    const client = ctx.request.fields.nano
    const wss = WebSocketServer.instance()

    for (var file of ctx.request.files) {
      if (!file || !file.name) { continue }

      let info = {
        file: file.name,
        mime: file.type,
        path: file.path,
        dir: dir,
        tdir: thumbnailDir,
        stat: 'ok'
      }
      details.push(info)

      // if no file is selected actually
      tasks.push(getType(info)
        .then(copyFile)
        .then(infoNotExist)
        .then(getResInfo)
        .then(getThumbnail)
        .then(saveToDb)
        .catch((err) => {
          console.error(err)
          info.stat = 'err'
          info.err = err.message || err
        })
        .then(() => {
          wss.sendMessage(client, JSON.stringify(info))
        }))
    }

    await Promise.all(tasks)
    console.log(details)
    ctx.status = 200
    ctx.body = JSON.stringify(details)
    wss.sendMessage(client, JSON.stringify(details))
  })
}

module.exports = upload
