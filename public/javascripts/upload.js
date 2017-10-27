let filesSelected = []

function removeItem (itemId) {
  const oFileList = document.querySelector('#filelist')
  for (let oEle of oFileList.childNodes) {
    if (oEle.id === '___' + itemId) {
      oFileList.removeChild(oEle); break
    }
  }
  let i = 0
  for (var file of filesSelected) {
    if (file.name === decodeURIComponent(itemId)) break
    i++
  }
  if (i !== filesSelected.length) {
    filesSelected.splice(i, 1)
  }
  updateFileDes()
}

function updateFileDes () {
  let fileDes = ''
  let fileCount = filesSelected.length
  if (fileCount === 1) {
    fileDes = filesSelected[0].name
  } else {
    fileDes = `${fileCount} file(s) selected.`
  }
  document.querySelector('#filename').innerText = fileDes
}

function initUploadControl () {
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('#file').onchange = changeEventHandler
    document.querySelector('#fileform').onsubmit = formSubmitHandler
    updateFileDes()
  }, false)

  var ws = new WebSocket('ws://localhost:3000')

  ws.onopen = function (evt) {
    console.log('Connection open ...')
    ws.send('Hello WebSockets!')
  }

  ws.onmessage = function (evt) {
    console.log('Received Message: ' + evt.data)
    ws.close()
  }

  ws.onclose = function (evt) {
    console.log('Connection closed.')
  }

  function changeEventHandler (event) {
    const files = event.target.files
    let fileListString = ''
    for (var file of files) {
      const itemId = encodeURIComponent(file.name)
      fileListString +=
          `<tr id="___${itemId}">
            <td>${file.name}</td>
            <td>
              <a class="delete is-small is-pulled-right" href="javascript:removeItem('${itemId}');"/>
            </td>
          </tr>`
    }
    filesSelected = Array.from(files)
    document.querySelector('#filelist').innerHTML = fileListString
    updateFileDes()
  }

  function formSubmitHandler (event) {
    var oData = new FormData()
    for (var file of filesSelected) {
      oData.append(file.name, file)
    }

    var oReq = new XMLHttpRequest()
    oReq.open('POST', '/', true)
    oReq.onload = function (oEvent) {
      if (oReq.status === 200) {
        console.log('Uploaded!')
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
  }
}
