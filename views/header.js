
const config = [
  {
    path: '/',
    icon: 'fa fa-home',
    text: 'Kandy'
  },
  {
    path: '/chart',
    icon: 'fa fa-line-chart',
    text: 'Chart'
  },
  {
    path: '/upload',
    icon: 'fa fa-upload',
    text: 'Upload'
  },
  {
    path: '/favorite',
    icon: 'fa fa-star',
    text: 'Favorite'
  }
]
const item = (props) =>
  `
  <li${props.active ? ' class="is-active"' : ''}>
    <a href="${props.path}">${props.text}</a>
  </li>
  `

const itemList = (curPath) => {
  return config
    .map((o) => item({
      text: o.text,
      icon: o.icon,
      path: o.path,
      active: o.path === curPath
    }))
    .reduce((list, itemStr) => { list = list || ''; return list + itemStr })
}

module.exports = (props) =>
  `
  <div class="tabs is-centered">
  <ul>
    ${itemList(props.path)}
  </ul>
  </div>
  <h1 class="title">${props.title}</h1>
  <p class="subtitle is-6">${props.message}</p>
  `
