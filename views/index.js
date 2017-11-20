const layout = require('./layout')

module.exports = layout()

// mixin oneFigure(type)
//   article(class="tile is-child notification is-" + type)
//     p(class="title") Middle tile
//     p(class="subtitle") With an image
//     figure(class="image is-4by3")
//       img(src="https://bulma.io/images/placeholders/640x480.png")

// mixin template1()
//   .tile.is-ancestor.is-vertical
//     .tile.is-parent
//       +oneFigure("info")
//     .tile.is-parent
//       +oneFigure("primary")
//       +oneFigure("warning")

// block content
//   +template1()
