const router = require('koa-router')()

router.get('/', async (ctx, next) => {
  await ctx.render('404', {
    title: "Page not found",
    message: ""
  })
});

router.get('/:path', async (ctx, next) => {
  await ctx.render('404', {
    title: "Page not found",
    message: `[${decodeURIComponent(ctx.params['path'])}]] doesn't exist`
  })
});

module.exports = router
