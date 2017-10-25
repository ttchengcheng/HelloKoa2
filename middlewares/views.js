const views = require('koa-views')
const path = require('path')
module.exports = () => {
  return views(path.join(__dirname, '/../views'), {extension: 'pug'})
}
