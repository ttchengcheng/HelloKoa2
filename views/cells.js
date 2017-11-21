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
    $type: 'div',
    $components: [
      {
        $type: 'form',
        id: 'fileform',
        method: 'post',
        enctype: 'multipart/form-data',
        $components: [
          {
            $type: 'div',
            class: 'file has-name is-fullwidth',
            $components: [
              {
                $type: 'label',
                class: 'file-label',
                $components: [
                  {
                    $type: 'input',
                    id: 'file',
                    name: 'file',
                    multiple: 'multiple',
                    class: 'file-input'
                  },
                  {
                    $type: 'span',
                    class: 'file-cta',
                    $components: [
                      {
                        $type: 'span',
                        class: 'file-icon',
                        $components: [
                          {
                            $type: 'i',
                            class: 'fa fa-upload'
                          }
                        ]
                      },
                      {
                        $type: 'span',
                        class: 'file-icon',
                        $text: ''
                      }
                    ]
                  },
                  {
                    $type: 'span',
                    id: 'file-des',
                    class: 'file-name',
                    $text: '0 file(s) selected'
                  },
                  {
                    $type: 'button',
                    type: 'submit',
                    class: 'ui fluid large teal button',
                    $text: 'Upload'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        $type: 'table',
        class: 'table is-fullwidth is-hoverable',
        $components: [
          {
            $type: 'tbody',
            id: 'filelist'
          }
        ]
      }
    ]
  }
}

module.exports = cell
