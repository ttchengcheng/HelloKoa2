const mongoose = require('mongoose');
const db = require('./db');

const LogSchema = new mongoose.Schema({
	method: String,
	href: String,
	time: Number
});
const LogModel = db.model('Logs', LogSchema);

module.exports = LogModel;