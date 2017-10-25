module.exports = () => {
  return async(ctx, next) => {
    await next()
    if (ctx.status === 404) {
      ctx.redirect('/404/' + encodeURIComponent(ctx.path))
    }
  }
}
