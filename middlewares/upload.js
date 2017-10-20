const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const condition = require('../lib/util').condition
const config = require('../config')

/*
 * process routine:
 *      -> upload file and compute checksum
 *      -> use checksum to check duplication
 *      -> create thumbnail
 *      -> get file info
 *      -> combine with thumbnail info
 *      -> combine with other data fields: rating, tags
 *      -> save info to database
 *      -> done.
 * 
 * file exif parse: https://github.com/mceachen/exiftool-vendored.js
 *      ref: /lib/res-info.js
 * 
 * video thumbnail: https://github.com/fluent-ffmpeg/node-fluent-ffmpeg
 * 
 *      ffmpeg('/path/to/video.avi')
 *      .on('filenames', function(filenames) {
 *        console.log('Will generate ' + filenames.join(', '))
 *      })
 *      .on('end', function() {
 *        console.log('Screenshots taken');
 *      })
 *      .screenshots({
 *        // Will take screens at 20%, 40%, 60% and 80% of the video
 *        count: 4,
 *        folder: '/path/to/output'
 *      });
 * 
 */

// check if the request is upload
function isMultipart(ctx) {
  return 'POST' == ctx.method || ctx.request.type == 'multipart/form-data';
}

function doUpload(dir, file) {
  var crypto = require('crypto');
  var fs = require('fs');
  
  const iStream = fs.createReadStream(file.path);
  const oStream = fs.createWriteStream(path.join(dir, file.name));
  var hash = crypto.createHash(config.hashType);
  
  iStream.on('data', function(d) {
      hash.update(d);
      oStream.write(d);
  });
  
  iStream.on('end', function() {
      var checksum = hash.digest('hex');
      console.log('uploading %s -> %s, checksum is %s', file.name, oStream.path, checksum);
  });
}

function route(file) {
  if (!file || !file.name) {
    return -1; // invalid
  }

  const ext = path.extname(file.name).toLocaleLowerCase();
  if (ext in ['.jpg', '.jpeg', '.png']) {
    return 1;  // image
  }
  if (ext in ['.mp4']) {
    return 2;  // video
  } else {
    return -2;  // not supported
  }
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
      if (!route(file)) {
        continue;
      }

      doUpload(dir, file);
    }
    ctx.status = 200;
  });
}

module.exports = upload;