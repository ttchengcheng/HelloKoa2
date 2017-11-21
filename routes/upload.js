const router = require('koa-router')()
const view = require('../views/upload')
router.get('/', async (ctx, next) => {
  ctx.body = view()
})

module.exports = router
