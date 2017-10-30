const WebSocket = require('ws')
const url = require('url')
const nanoId = require('./lib/util').nanoId

let WSServerInstance = null
class WSServer {
  constructor (server) {
    if (WSServerInstance) { throw new Error('WSServer is already created') }

    this.wss = new WebSocket.Server({ server: server })
    this.sockets = {}
    const that = this
    this.wss.on('connection', function connection (ws, req) {
      // const location = url.parse(req.url, true)
      // console.log(location)
      // console.log(location.query.access_token)
      // You might use location.query.access_token to authenticate or share sessions
      // or req.headers.cookie (see http://stackoverflow.com/a/16395220/151312)

      ws.nanoId = nanoId()
      that.sockets[ws.nanoId] = ws

      ws.on('message', function incoming (message) {
        console.log(`[Message from ${ws.nanoId}]: ${message}`)
      })

      ws.on('close', function (num, reason) {
        that.remove(ws.nanoId)
      })
      ws.send('nano:' + ws.nanoId)
    })

    WSServerInstance = this
  }

  static instance () {
    return WSServerInstance
  }

  remove (id) {
    delete this.sockets[id]
  }

  sendMessage (id, message) {
    let ws = this.sockets[id]
    if (!ws) { console.log('socket [' + id + '] doesn\'t exist'); return }
    ws.send(message)
  }
}

module.exports = WSServer
