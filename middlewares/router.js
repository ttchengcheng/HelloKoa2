const router = require('koa-router')()

const routeMap = new Map([
  ["", "index"],
  ["users", "users"],
  ["404", "page-not-found"],
  ["upload", "upload"]
]);

for (let [path, routerName] of routeMap) {
  let rt = require('../routes/' + routerName);
  router.use('/' + path, rt.routes(), rt.allowedMethods());
}

module.exports = () => { return router.routes(); }
