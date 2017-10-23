const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const condition = require('../lib/util').condition
const config = require('../config');
const ChecksumStream = require('../lib/file-checksum');
const getResInfo = require('../lib/res-info');
const Asset = require('../model/asset');

/*
 * process routine:
 *      -> (ok) upload file and compute checksum
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

async function doUpload(dir, file) {
  return new Promise(resolved, rejected, () => {
    const iStream = fs.createReadStream(file.path);
    const oStream = fs.createWriteStream(path.join(dir, file.name));
    const mStream = new ChecksumStream(config.hashType);
    mStream.on('done', function(checksum) {
      console.log(
          'uploading %s -> %s, checksum is %s', file.name, oStream.path,
          checksum);
      resolved(checksum);
    });
    iStream.pipe(mStream).pipe(oStream);
  })
}

function getAssetType(file) {
  if (!file || !file.name) {
    return -1;  // invalid
  }

  const ext = path.extname(file.name).toLocaleLowerCase();
  if (ext == '.jpg' || ext == '.jpeg' || ext == '.png') {
    return 1;  // image
  }
  if (ext == '.mp4') {
    return 2;  // video
  } else {
    return -2;  // not supported
  }
}

// handle upload
// TODO: refactor with promise chain
function
upload() {
  return condition(isMultipart, async function(ctx, next) {
    // create the dir if it does not exist
    const dir = __dirname + '/../uploaded_files';
    const thumbnailDir = __dirname + '/../thumbnail';

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    if (!fs.existsSync(thumbnailDir)) {
      fs.mkdirSync(thumbnailDir);
    }

    let static = {err: 0, exist: 0, ok: 0};

    for (var file of ctx.request.files) {
      // if no file is selected actually
      let fileType = getAssetType(file);
      if (fileType < 0) {
        console.error(`Unknow file type ${fileType} for file (${file.name})`);
        static.err++;
        continue;
      }

      let checksum = await doUpload(dir, file);
      if (!checksum) {
        static.err++;
        continue;
      }

      if (!Asset.exist(checksum)) {
        static.exist++;
        continue;
      }

      let info = await getResInfo(file.name);
      let thumbnail = '__thmb__' + file.name;
      await Jimp.read(file.name)
          .then(function(image) {
            let x = 256;
            let y = Jimp.AUTO;
            if (image.bitmap.width < image.bitmap.height) {
              x = Jimp.AUTO;
              y = 256;
            }
            image
                .resize(x, y)  // resize
                .quality(60)   // set JPEG quality
                .write(path.join(thumbnailDir, thumbnail));
          })
          .catch(function(err) {
            console.error(err);
            static.err++;
            thumbnail = "";
          });

      let asset = new Asset({
        file: file.name,
        checksum: checksum,
        date: info.date,
        type: fileType,
        thumbnail: thumbnail,
        up: 0
      });

      asset.save();
    }
    ctx.status = 200;
  });
}

module.exports = upload;