var db = require('../models/Config') ;

/**
 Exports configuration key values from the database
 **/

module.exports = {
    load: function(callback) {
        db.find(function (err, parameters) {
            if (err) {
                callback(err);
            }
            callback(null, parameters);
        });
    }
};
