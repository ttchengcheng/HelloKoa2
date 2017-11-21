let cell = {}

cell.p = (cls, text) => ({
  $type: 'p',
  class: cls,
  $text: text
})

cell.img = (title, subTitle, imgSrc) => ({
  $cell: true,
  $type: 'article',
  class: 'tile is-child notification is-undefined',
  $components: [
    cell.p('title', title),
    cell.p('subtitle', subTitle),
    {
      $type: 'figure',
      class: 'image is-4by3',
      $text: 'With an image',
      $components: [
        {
          $type: 'img',
          src: imgSrc
        }
      ]
    }
  ]
})

module.exports = cell
