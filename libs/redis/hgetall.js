'use strict';

var Q = require('q');
var client = require("./client");

/**
 * 获取Hash promise
 * @param {String} Key
 *
 * @return {String} Value
 */
function hgetall(key) {
    var dfd = Q.defer();
    // console.log('hgetall:',key);
    if (key) {
        client.hgetall(key, function(err, replay) {
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

module.exports = hgetall;
