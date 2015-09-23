'use strict';

var Q = require('q');
var client = require("./client");

/**
 * 获取Hash promise
 * @param {String} Key
 *
 * @return {String} Value
 */
function hget(hash, key) {
    var dfd = Q.defer();

    if (hash && key) {
        client.hget(hash, key, function(err, replay) {
            if (replay) {
                dfd.resolve(replay);
            } else {
                dfd.reject(err);
            }
        }); //end of client.get
    } else {
        dfd.reject({
            err: 'key is undefined'
        });
    }

    return dfd.promise;
};

module.exports = hget;
