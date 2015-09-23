'use strict';

var Q = require('q');
var client = require("./client");

/**
 * smembers promise
 * @param {String} Key
 *
 * @return {String} Value
 */
function smembers(key) {
    var dfd = Q.defer();

    if (key) {
        client.smembers(key, function(err, replay) {
            if (replay) {
                dfd.resolve(replay);
            } else {
                dfd.reject(err);
            }
        }); //end of client.smembers
    } else {
        dfd.reject({
            err: 'key is undefined'
        });
    }

    return dfd.promise;
};

module.exports = smembers;
