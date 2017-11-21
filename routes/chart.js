const router = require('koa-router')()
const view = require('../views/chart')

router.get('/', async (ctx, next) => {
  ctx.body = view()
  ctx.status = 200
})

module.exports = router
