var mongoose = require('mongoose');

var configSchema = new mongoose.Schema({
  name: { type: String, lowercase: true, index : {unique: true}, required: true },
  value : { type : String},
  consumer: { type : Array, lowercase: true, default : ["all"], index: true},
  description: { type : String}

}, { timestamps: true});


var Config = mongoose.model('Config', configSchema);

module.exports = Config;