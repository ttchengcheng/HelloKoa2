const layout = require('./layout')
const cell = require('./cells')

module.exports = (props) => {
  return layout({
    path: '/upload',
    title: 'Hello Koa 2!',
    message: 'Welcome to Koa 2',
    cells: cell.fileUploader({
      id: 'cell-body'
    }),
    scripts: [
      { src: 'javascripts/jquery.min.js' },
      { src: 'javascripts/upload.js' },
      { text: 'window.uploader.init()' }
    ]
  })
}
