exports.condition = function(check, middleware) {
  return async function(ctx, next) {
    if (!check(ctx)) {
      await next();
    } else {
      // must .call() to explicitly set the receiver
      await middleware.call(this, ctx, next);
    }
  };
};