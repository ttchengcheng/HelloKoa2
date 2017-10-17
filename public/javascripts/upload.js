let filesSelected = [];

function removeItem(itemId) {
  const oFileList = document.querySelector('#filelist');
  for (let oEle of oFileList.childNodes) {
    if (oEle.id == "___" + itemId) {
      oFileList.removeChild(oEle); break;
    }
  }
  let i = 0;
  for (var file of filesSelected) {
    if (file.name == decodeURIComponent(itemId)) break;
    i++;
  }
  if (i != filesSelected.length) {
    filesSelected.splice(i, 1);
  }
  updateFileDes();
}

function updateFileDes() {
  let fileDes = '';
  let fileCount = filesSelected.length;
  if (fileCount == 1) {
    fileDes = filesSelected[0].name;
  } else {
    fileDes = `${fileCount} file(s) selected.`
  }
  document.querySelector('#filename').innerText = fileDes;
}

function initUploadControl() {
  
  document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('#file').onchange = changeEventHandler
    document.querySelector('#fileform').onsubmit = formSubmitHandler
    updateFileDes();
  }, false);

  function changeEventHandler(event) {
    const files = event.target.files;
    let fileListString = "";
    for (var file of files) {
      const itemId = encodeURIComponent(file.name);
      fileListString += 
          `<tr id="___${itemId}">
            <td>${file.name}</td>
            <td>
              <a class="delete is-small is-pulled-right" href="javascript:removeItem('${itemId}');"/>
            </td>
          </tr>`;
    }
    filesSelected = Array.from(files);
    document.querySelector('#filelist').innerHTML = fileListString;
    updateFileDes();
  }

  function formSubmitHandler(event) {
    var oData = new FormData();
    for(var file of filesSelected) {
      oData.append(file.name, file);
    }

    var oReq = new XMLHttpRequest();
    oReq.open('POST', '/', true);
    oReq.onload = function(oEvent) {
      if (oReq.status == 200) {
        console.log('Uploaded!');
      } else {
        console.log(
            'Error ' + oReq.status +
            ' occurred when trying to upload your file.<br \/>');
      }
    };

    oReq.send(oData);
    event.preventDefault();
  }
}