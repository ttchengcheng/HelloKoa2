
const config = [
  {
    path: '/',
    icon: 'fa fa-home',
    text: 'Kandy'
  },
  {
    path: '/',
    icon: 'fa fa-line-chart',
    text: 'Chart'
  },
  {
    path: '/',
    icon: 'fa fa-upload',
    text: 'Upload'
  },
  {
    path: '/',
    icon: 'fa fa-star',
    text: 'Favorite'
  }
]
const item = (text, icon, isActive) =>
  `<li ${isActive ? 'class = "is-active"' : ''}>
    <span class="icon is-small"><i class="${icon}"></i></span>
    <span>${text}</span>
  </li>`

const itemList = (curPath) => {
  config
    .map((o) => item(o.text, o.icon, o.path === curPath))
    .reduce((list, itemStr) => { list = list || ''; return list + itemStr })
}

module.exports = (props) =>
  `
  <div class="tabs is-centered">
  <ul>
    ${itemList(props.path)}
  </ul>
  </div>
  <h1 class="title">${props.title}</p>
  <p class="subtitle is-6">${props.message}</p>
  `
