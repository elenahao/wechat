'use strict';

var Q = require('q');
var client = require("./client");

/**
 * 删除key or keys[] promise
 * @param {String} Key or {Array} keys
 *
 * @return {Number} Value
 */
function del(key) {
    var dfd = Q.defer();

    if (key) {
        client.del(key, function(err, replay) {
            if (replay) {
                dfd.resolve(replay);
            } else {
                dfd.reject(err);
            }
        }); //end of client.del
    } else {
        dfd.reject({
            err: 'key is undefined'
        });
    }

    return dfd.promise;
};

module.exports = del;
