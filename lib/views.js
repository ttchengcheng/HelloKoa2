const views = require('koa-views')

module.exports = views(__dirname + '/../views', {
    extension: 'pug'
})
