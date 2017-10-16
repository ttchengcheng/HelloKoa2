const fs = require('fs');
const path = require('path');
const condition = require('./lib').condition

// check if the request is upload
function isMultipart(ctx) {
  return 'POST' == ctx.method || ctx.request.type == 'multipart/form-data';
}
// handle upload
function upload() {
  return condition(isMultipart, async function(ctx, next) {
    // create the dir if it does not exist
    const dir = __dirname + '/../uploaded_files';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    for (var file of ctx.request.files) {
      // if no file is selected actually
      if (!file.name) {
        continue;
      }
      const reader = fs.createReadStream(file.path);
      const stream = fs.createWriteStream(path.join(dir, file.name));
      reader.pipe(stream);
      console.log('uploading %s -> %s', file.name, stream.path);
    }

    ctx.status = 200;
  });
}

module.exports = upload;