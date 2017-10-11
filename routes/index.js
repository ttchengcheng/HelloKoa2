const router = require('koa-router')()

router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!!'
  })
})

router.get('/err', async (ctx, next) => {
  await ctx.render('error', {
    message: "Error Happened!",
    error: {
      status: 100,
      stack: ['aaa', 'bbb', 'ccc']
    }
  })
});

router.get('/upload', async (ctx, next) => {
  await ctx.render('upload', {
    message: "Upload Images"
  })
});

router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string'
})

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})

module.exports = router
