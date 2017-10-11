const Koa = require('koa')
const app = new Koa()
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-better-body')
const logger = require('koa-logger')

const index = require('./routes/index')
const users = require('./routes/users')

const views = require('./middlewares/views')
const upload = require('./middlewares/upload')
const log = require('./middlewares/logger')

// error handler
onerror(app)

// middlewares
app.use(bodyparser())
  .use(json())
  .use(logger())
  .use(require('koa-static')(__dirname + '/public'))
  .use(views)
  .use(log())
  .use(upload());

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app