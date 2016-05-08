var mongoose = require('mongoose');

var configSchema = new mongoose.Schema({
  name: { type: String, lowercase: true, unique: true },
  value : String,
  consumer: { type : String, lowercase: true, default : "all"},
  description: String

}, { timestamps: true});


var Config = mongoose.model('Config', configSchema);

module.exports = Config;