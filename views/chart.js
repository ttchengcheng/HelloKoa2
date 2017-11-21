const layout = require('./layout')
const cell = require('./cells')

module.exports = (props) => {
  return layout({
    path: '/chart',
    title: 'Hello Koa 2!',
    message: 'Welcome to Koa 2',
    cells: cell.video({
      id: 'cell-body',
      poster: '//vjs.zencdn.net/v/oceans.png',
      sources: [
        {
          type: 'video/mp4',
          src: '//vjs.zencdn.net/v/oceans.mp4'
        },
        {
          type: 'video/ogg',
          src: '//vjs.zencdn.net/v/oceans.ogv'
        },
        {
          type: 'video/webm',
          src: '//vjs.zencdn.net/v/oceans.webm'
        }
      ]
    })
  })
}
