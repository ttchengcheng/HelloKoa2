const views = require('koa-views')

module.exports = () => {
  return views(__dirname + '/../views', {extension: 'pug'});
};
