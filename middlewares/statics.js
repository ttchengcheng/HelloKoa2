const statics = require('koa-static');

module.exports = () => {
  return statics(__dirname + '/../public');
};