const Koa = require('koa')
const app = new Koa()

const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-better-body')
const logger = require('koa-logger')

const upload = require('./middlewares/upload')
const router = require('./middlewares/router')
const log = require('./middlewares/logger')
const statics = require('./middlewares/statics')

// error handler
onerror(app)

// middlewares
app.use(bodyparser())
  .use(json())
  .use(logger())
  .use(statics())
  .use(log())
  .use(upload())
  .use(router())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
})

module.exports = app
