let filesSelected = []

window.uploadHandler = {
  removeItem: function (itemId) {
    $('#filelist').children().filter(function (index, ele) {
      return decodeURIComponent(ele.id) === itemId
    }).remove()

    let [index, i, file] = [-1, 0, null]
    for ([i, file] of filesSelected.entries()) {
      if (file.name === itemId) { index = i; break }
    }
    if (index >= 0) {
      filesSelected.splice(index, 1)
    }
    window.uploadHandler.updateFileDes()
  },

  updateFileDes: function () {
    let fileDes = ''
    let fileCount = filesSelected.length
    fileDes = fileCount === 1 ? filesSelected[0].name : `${fileCount} file(s).`
    $('#filename').text(fileDes)
  },

  initUploadControl: function () {
    document.addEventListener('DOMContentLoaded', function () {
      $('#file').change(function (event) {
        const files = event.target.files
        let fileListString = ''
        for (let file of files) {
          fileListString +=
            `<tr id="${encodeURIComponent(file.name)}">
              <td>${file.name}</td>
              <td>
                <a class="delete is-small is-pulled-right" href="javascript:window.uploadHandler.removeItem('${file.name}');"/>
              </td>
            </tr>`
        }
        filesSelected = Array.from(files)
        document.querySelector('#filelist').innerHTML = fileListString
        window.uploadHandler.updateFileDes()
      })
      $('#fileform').submit(function (event) {
        var oData = new FormData()
        oData.append('nano', document.nanoId)
        for (var file of filesSelected) {
          oData.append(file.name, file)
        }
        var oReq = new XMLHttpRequest()
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
        oReq.upload.onprogress = function (ev) {
          console.log(ev)
        }
        oReq.send(oData)
        event.preventDefault()
      })
      window.uploadHandler.updateFileDes()
    }, false)

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
}
