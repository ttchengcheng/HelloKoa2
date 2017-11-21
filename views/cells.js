let cell = {}

cell.p = (cls, text) => ({
  $type: 'p',
  class: cls,
  $text: text
})

cell.img = (props) => {
  return props ? {
    $type: 'article',
    class: 'tile is-child notification is-undefined',
    $components: [
      cell.p('title', props.title),
      cell.p('subtitle', props.subTitle),
      {
        $type: 'figure',
        class: 'image is-4by3',
        $text: 'With an image',
        $components: [
          {
            $type: 'img',
            src: props.src
          }
        ]
      }
    ]
  } : null
}

cell.tile = (props) => {
  if (!props) { return null }
  let [img1, img2, img3] = props.imgs
  return {
    $cell: true,
    $type: 'div',
    id: props.id,
    class: 'tile is-ancestor is-vertical',
    $components: [
      {
        $type: 'div',
        class: 'is-parent',
        $components: [
          cell.img(img1)
        ]
      },
      {
        $type: 'div',
        class: 'is-parent',
        $components: [
          cell.img(img2),
          cell.img(img3)
        ]
      }
    ]
  }
}

cell.videoSource = (props) => {
  return {
    $type: 'source',
    src: props.src,
    type: props.type
  }
}
cell.video = (props) => {
  if (!props) return null

  return {
    $cell: true,
    id: props.id,
    $type: 'video',
    controls: '',
    preload: 'auto',
    poster: props.poster,
    'data-setup': '{}',
    class: 'video-js',
    $components: [
      ...props.sources.map(cell.videoSource),
      cell.p({
        class: 'vjs-no-js',
        $text: 'To view this video please enable JavaScript, and consider upgrading to a web browser that http://videojs.com/html5-video-support/ supports HTML5 video'
      })
    ]
  }
}

cell.fileUploader = (props) => {
  return {
    $cell: true,
    id: props.id,
    $type: 'form',
    $components: [
      {
        $type: 'div',
        'uk-form-custom': true,
        $components: [
          {
            $type: 'input',
            type: 'file',
            id: 'file',
            multiple: true
          },
          {
            $type: 'button',
            class: 'uk-button uk-button-default',
            type: 'button',
            tabindex: '-1',
            $text: 'Select'
          }

        ]
      }
    ]
  }
}

module.exports = cell
