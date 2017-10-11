// logger
function log() {
    return async function (ctx, next) {
        const start = new Date()
        await next()
        const ms = new Date() - start
        console.log(`${ctx.method} ${ctx.origin} - ${ms}ms\n${ctx.request.type}`)
    }
}

module.exports = log