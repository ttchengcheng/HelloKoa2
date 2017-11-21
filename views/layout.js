const header = require('./header.js')
const footer = require('./footer.js')

const script = (props) => {
  return props.src ? `<script src='${props.src}'></script>`
    : `<script>${props.text}</script>`
}
module.exports = (props) => {
  let headerData = {
    path: props.path,
    title: props.title,
    message: props.message
  }
  let footerData = {}

  return `<!DOCTYPE html>
  <html>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <head>
      <title>${props.title}</title>
      <script src="https://www.celljs.org/cell.js"></script>
      <link rel="stylesheet" href="stylesheets/bulma.css">
      <link rel="icon" type="image/png" href="favicon.png">
    </head>
    <body>
      <section class="container">
        ${header(headerData)}
        <div id='cell-body'></div>
        ${footer(footerData)}
      </section>
    </body>
    <script>
      var cells = JSON.parse('${(props.cells && JSON.stringify(props.cells)) || ''}')
    </script>
    ${props.scripts ? props.scripts.map(script).join('') : ''}
  </html>`
}
