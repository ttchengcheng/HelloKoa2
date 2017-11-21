// class FileObj {
//   constructor (file, control) {
//     this.file = file
//     this.control = control
//     this.progress = 0
//   }
//   static createControl (parentId, thisId, remover) {
//     return $('<tr>').attr('id', encodeURIComponent(thisId))
//       .appendTo($(`#${parentId}`))
//       .append($('<td>').text(thisId))
//       .append($('<td>')
//       .append($('<a>')
//         .attr('class', 'delete is-small is-pulled-right')
//         .attr('href', `javascript:${remover}('${thisId}');`)))
//   }
// }

class UploadHandler {
//   constructor (name) {
//     this.name = name
//     this.filesSelected = []
//   }
//   _updateFileDes () {
//     let fileDes = ''
//     let fileCount = this.filesSelected.length
//     fileDes = fileCount === 1 ? this.filesSelected[0].file.name : `${fileCount} file(s).`
//     $('#filename').text(fileDes)
//   }
  // _initFileInput () {
  //   let that = this
  //   document.querySelector('#file').addEventListener('change', function (event) {
  //     const files = event.target.files
  //     that.filesSelected = []
  //     for (let file of files) {
  //       that.filesSelected.push(new FileObj(file, FileObj.createControl('filelist', file.name, `window.${that.name}.removeItem`)))
  //     }
  //     that._updateFileDes()
  //   })
  // }

  // _initSubmitButton () {
  //   let that = this
  //   $('#fileform').submit(function (event) {
  //     let oData = new FormData()
  //     oData.append('nano', document.nanoId)
  //     for (let fileObj of that.filesSelected) {
  //       oData.append(fileObj.file.name, fileObj.file)
  //     }

  //     const getXhr = () => {
  //       const xhr = new XMLHttpRequest()
  //       xhr.upload.addEventListener('progress', function (evt) {
  //         if (evt.lengthComputable) {
  //           var percentComplete = evt.loaded / evt.total
  //           // Do something with upload progress
  //           console.log(percentComplete)
  //         }
  //       })
  //       return xhr
  //     }
  //     $.ajax({
  //       url: '/',
  //       method: 'POST',
  //       contentType: false,
  //       processData: false,
  //       xhr: getXhr,
  //       data: oData
  //     })
  //     .done(function (xhr, status) {
  //       console.log(status)
  //     })
  //     event.preventDefault()
  //   })
  // }
  _initWebSocket () {
    const ws = new WebSocket('ws://localhost:3000')
    ws.onopen = function (evt) {
      console.log('Connection open ...')
      ws.send('Hello WebSockets!')
    }
    ws.onmessage = function (evt) {
      console.log('Received Message: ' + evt.data)
      if (!document.nanoId && evt.data && evt.data.length > 5) {
        document.nanoId = evt.data.substr(5)
      }
    // ws.close()
    }
    ws.onclose = function (evt) {
      console.log('Connection closed.')
    }
  }
  init () {
    // this._initFileInput()
    // this._initSubmitButton()
    this._initWebSocket()
    // this._updateFileDes()
  }
  // removeItem (itemId) {
  //   for (let [i, fileObj] of this.filesSelected.entries()) {
  //     if (fileObj.file.name === itemId) {
  //       fileObj.control.remove()
  //       this.filesSelected.splice(i, 1)
  //       break
  //     }
  //   }
  //   this._updateFileDes()
  // }
}

const loader = 'uploader'
window[loader] = new UploadHandler(loader)
