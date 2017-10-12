const router = require('koa-router')()

router.get('/', async (ctx, next) => {
  await ctx.render('404', {
    path: "",
  })
});

router.get('/:path', async (ctx, next) => {
  await ctx.render('404', {
    path: decodeURIComponent(ctx.params['path']),
  })
});

module.exports = router
