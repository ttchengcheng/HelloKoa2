const LogModel = require('../model/log');

// logger
function log() {
  return async function (ctx, next) {
    const start = new Date()
    await next()
    const ms = new Date() - start

    const aLog = new LogModel({
      method: ctx.method,
      href: ctx.href,
      time: ms
    });

    aLog.save();

    console.log(`\n${aLog.method} ${aLog.href} - ${aLog.time}ms\n`)
  }
}

module.exports = log