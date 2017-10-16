const router = require('koa-router')()

const index = require('../routes/index');
const users = require('../routes/users');
const pageNotFound = require('../routes/page-not-found');

router.use('/', index.routes(), index.allowedMethods());
router.use('/users', users.routes(), users.allowedMethods());
router.use('/404', pageNotFound.routes(), pageNotFound.allowedMethods());

router.get('/upload', async (ctx, next) => {
  await ctx.render('upload', {
    title: "Upload Images",
    message: "Try uploading multiple files at a time."
  })
});

module.exports = () => { return router.routes(); }
