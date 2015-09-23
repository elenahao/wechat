'use strict';

var Q = require('q');
var client = require("./client");

/**
 * key是否存在 promise
 * @param {String} Key
 * @param {String} field
 *
 * @return {Object} 是否存在
 */
function exists(key) {
    var dfd = Q.defer();

    if (key) {
        client.exists(key, function(err, replay) {
            if(err){
                dfd.reject(err);
            }else{
                dfd.resolve(replay);
            }
        });
    } else {
        dfd.reject({
            err: 'param error'
        });
    }

    return dfd.promise;
}

module.exports = exists;
