const mongoose = require('mongoose');
const db = require('./db');

const AssetSchema = new mongoose.Schema({
  // file-name of the asset
  file: String,
  // checksum: file checksum
  checksum: String,
  // type: 1-pic 2-video 3-text 4-data 5 event
  type: Number, 
  // file-name of the thumbnail
  thumbnail: String,
  // times being lauded
  up: Number
  //  tag: String 
});

AssetSchema.static.exist = function(checksum) {
  let found = false;
  this.find({ checksum: this.checksum }, (asset) => { found = true; });
  return found;
};
const AssetModel = db.model('Asset', AssetSchema);

module.exports = AssetModel;