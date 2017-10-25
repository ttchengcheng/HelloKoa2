const config = require('../config')
const mongoose = require('mongoose')
const db = mongoose.createConnection('localhost', config.db.names)

db.on('error', () => {
  console.error('db connect failed.')
})

db.once('open', function () {
  console.log('db connect ok.')
})

module.exports = db
