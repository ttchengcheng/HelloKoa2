const router = require('koa-router')()
const view = require('../views/index')

router.get('/', async (ctx, next) => {
  // await ctx.render('index', {
  //   path: '/',
  //   title: 'Hello Koa 2!',
  //   message: 'Welcome to Koa 2'
  // })
  ctx.body = view()
})

module.exports = router
