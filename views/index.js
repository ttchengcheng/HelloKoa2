const layout = require('./layout')

module.exports = (props) => {
  return layout({
    path: '/',
    title: 'Hello Koa 2!',
    message: 'Welcome to Koa 2',
    cells: `cell.tile({
      id: 'cell-body',
      imgs: [
        {
          title: 'title',
          subTitle: 'subTitle',
          src: 'https://bulma.io/images/placeholders/640x480.png'
        },
        {
          title: 'title',
          subTitle: 'subTitle',
          src: 'https://bulma.io/images/placeholders/640x480.png'
        },
        {
          title: 'title',
          subTitle: 'subTitle',
          src: 'https://bulma.io/images/placeholders/640x480.png'
        }
      ]
    })`
  })
}
