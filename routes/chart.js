const router = require('koa-router')()

router.get('/', async (ctx, next) => {
  await ctx.render('chart', {
    path: '/chart',
    title: 'Hello Koa 2!',
    message: 'Welcome to Koa 2'
  })
})

module.exports = router
