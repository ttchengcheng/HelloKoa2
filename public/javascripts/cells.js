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

cell.fileItem = (props) => {
  if (!props) return null
  return {
    $type: 'tr',
    $components: [
      {
        $type: 'td',
        $text: props.text
      },
      {
        $type: 'td',
        $components: [
          {
            $type: 'button',
            type: 'button',
            _filename: props.text,
            'uk-close': true,
            onclick: function (event) {
              document.querySelector('#file-list')._remove(this._filename)
            }
          }
        ]
      }
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
        $init: function () {
          this.addEventListener('submit', function (event) {
            let oData = new FormData()
            oData.append('nano', document.nanoId)
            let files = document.querySelector('#file-list')._files
            for (let file of files) {
              oData.append(file.name, file)
            }
            let oReq = new XMLHttpRequest()
            oReq.open('POST', '/', true)
            oReq.onload = function (oEvent) {
              if (oReq.status === 200) {
                console.log('Uploaded finished: ' + oReq.response)
              } else {
                console.log(
                    'Error ' + oReq.status +
                    ' occurred when trying to upload your file.<br />')
              }
            }
            oReq.upload.onprogress = function (evt) {
              if (evt.lengthComputable) {
                let percentComplete = evt.loaded / evt.total
                console.log(percentComplete)
              }
            }
            oReq.send(oData)
            event.preventDefault()
          })
        },
        $components: [
          {
            $type: 'div',
            'uk-form-custom': true,
            $components: [
              {
                $type: 'input',
                type: 'file',
                id: 'file',
                multiple: true,
                $init: function () {
                  this.addEventListener('change', function (event) {
                    document.querySelector('#file-list')._setFiles(event.target.files)
                  })
                }
              },
              {
                $type: 'button',
                class: 'uk-button uk-button-default',
                type: 'button',
                tabindex: '-1',
                $text: 'Select'
              },
              {
                $type: 'span',
                class: 'uk-align-right',
                $text: 'aaaa',
                id: 'file-des'
              }
            ]
          }
        ]
      },
      {
        $type: 'table',
        class: 'uk-table uk-table-justify uk-table-divider',
        $components: [
          {
            $type: 'tbody',
            id: 'file-list',
            _files: [],
            _setFiles: function (files) {
              _files = []
              this.$components = []
              for (let file of files) {
                _files.push(file)
                this.$components.push(cell.fileItem({ text: file.name }))
              }
              this._updateDes()
            },
            _remove: function (name) {
              let i = 0
              for (let file of _files) {
                if (file.name === name) {
                  _files.splice(i, 1)
                  this.$components.splice(i, 1)
                  break
                }
                i = i + 1
              }
              this._updateDes()
            },
            _updateDes: function () {
              document.querySelector('#file-des').$text = `(${_files.length}) file(s) selected.`
            },
            $components: []
          }
        ]
      }
    ]
  }
}
