var mongoose = require('mongoose');

var configSchema = new mongoose.Schema({
  name: { type: String, lowercase: true, unique: true },
  value : String

}, { timestamps: true});


var Config = mongoose.model('Config', configSchema);

module.exports = Config;