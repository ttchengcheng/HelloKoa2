function initUploadControl() {
  var filesSelected = [];
  document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('#file').onchange = changeEventHandler
    document.querySelector('#fileform').onsubmit = formSubmitHandler
  }, false);

  function changeEventHandler(event) {
    var files = event.target.files;
    var fileDes = '';
    var fileCount = files.length;
    var fileListString = '';
    if (fileCount == 1) {
      fileDes = files[0].name;
    } else {
      fileDes = `${fileCount} file(s) selected.`
    }
    for (var file of files) {
      fileListString +=
          `<tr><td>${file.name}</td><td><a class="delete is-small is-pulled-right"></a></td></tr>`;
    }
    filesSelected = Array.from(files);
    document.querySelector('#filename').innerText = fileDes;
    document.querySelector('#filelist').innerHTML = fileListString;
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