function condition(check, mw) {
  return async function(ctx, next) {
    if (!check(ctx)) {
      await next();
    } else {
      // must .call() to explicitly set the receiver
      await mw.call(this, ctx, next);
    }
  };
}

module.exports = {
    condition: condition
}