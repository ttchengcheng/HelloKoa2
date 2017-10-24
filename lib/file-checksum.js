/* usage:
 *   const iStream = fs.createReadStream('./oceans.mp4');
 *
 *   const mStream = new ChecksumStream('md5');
 *   mStream.on('done', function(sum) {
 *     console.log(sum);
 *   })
 *
 *   const oStream = fs.createWriteStream('o/oceans.mp4');
 *
 *   iStream.pipe(mStream).pipe(oStream);
 */

var crypto = require('crypto')
const Stream = require('stream')

class ChecksumStream extends Stream.Transform {
  constructor (algorithm, encoding) {
    super()

    this._hash = crypto.createHash(algorithm || 'md5')
    this._hashEncoding = encoding || 'hex'
  };
  _transform (chunk, encoding, callback) {
    this._hash.update(chunk)
    callback(null, chunk)
  }
  _flush (callback) {
    callback()
    this.emit('done', this._hash.digest(this._hashEncoding))
  }
}

module.exports = ChecksumStream
