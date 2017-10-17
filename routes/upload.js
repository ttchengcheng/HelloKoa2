const router = require('koa-router')()

router.get('/', async (ctx, next) => {
  await ctx.render('upload', {
    path: '/upload',
    title: "Upload Images",
    message: "Try uploading multiple files at a time."
  })
});

module.exports = router
