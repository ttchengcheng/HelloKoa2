const header = require('./header.js')
const footer = require('./footer.js')

export default (props) =>
  `<!DOCTYPE html>
  <html>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <head>
      <title>${props.title}</title>
      <link rel="stylesheet" href="stylesheets/bulma.css">
      <link rel="icon" type="image/png" href="favicon.png">
    </head>
    <body>
      <section class="container">
        <div id='cell-header' />
        ${props.children || ''}
        <div id='cell-footer' />
      </section>
    </body>
    <script>
      var header = ${header(props.header)}
      var footer = ${footer(props.footer)}
      ${props.cells || ''}
    </script>
  </html>`
