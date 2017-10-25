const statics = require('koa-static')
const path = require('path')
module.exports = () => {
  return statics(path.join(__dirname, '/../public'))
}
