'use strict';

var Q = require('q');
var client = require("./client");

/**
 * 获取String promise
 * @param {String} Key
 *
 * @return {String} Value
 */
function get(key) {
    var dfd = Q.defer();

    if (key) {
        client.get(key, function(err, replay) {
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

module.exports = get;
