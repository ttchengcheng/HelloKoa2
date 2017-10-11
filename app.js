const fs = require('fs')
const path = require('path')
const Koa = require('koa')
const app = new Koa()
const json = require('koa-json')
const onerror = require('koa-onerror')
const logger = require('koa-logger')
const bodyparser = require('koa-better-body')

const views = require('./lib/views')
const index = require('./routes/index')
const users = require('./routes/users')

// error handler
onerror(app)

// middlewares
app.use(bodyparser())
  .use(json())
  .use(logger())
  .use(require('koa-static')(__dirname + '/public'))
  .use(views)

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.origin} - ${ms}ms\n${ctx.request.type}`)
})

// handle upload
app.use(async (ctx, next) => {
  if ('POST' != ctx.method || ctx.request.type != "multipart/form-data") return await next();
  const file = ctx.request.files[0];
  const reader = fs.createReadStream(file.path);
  const stream = fs.createWriteStream(path.join(__dirname + '/uploaded_files', Math.random().toString()));
  reader.pipe(stream);
  console.log('uploading %s -> %s', file.name, stream.path);

  ctx.redirect('/');
})

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
