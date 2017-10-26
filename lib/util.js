exports.condition = function (check, middleware) {
  return async function (ctx, next) {
    if (!check(ctx)) {
      await next()
    } else {
      // must .call() to explicitly set the receiver
      await middleware.call(this, ctx, next)
    }
  }
}

const nanoId = require('nanoid/generate')
exports.nanoId = function () {
  return nanoId('1234567890abcdefghijklmnopqrstuvwxyz', 12)
}
