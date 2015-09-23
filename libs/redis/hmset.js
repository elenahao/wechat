'use strict';

var Q = require('q');
var client = require("./client");

/**
 * 插入Hash promise
 * @param {String} Key
 * @param {Object} Value
 *
 * @return {Object} 是否成功
 */
function hmset(key, obj) {
    var dfd = Q.defer();

    if (key && obj) {
        client.hmset(key, obj, function(err) {
            if(!err){
                dfd.resolve({
                    msg: 'success'
                });
            } else {
                dfd.reject(err);
            }
        });
    } else {
        dfd.reject({
            err: 'param error'
        });
    }

    return dfd.promise;
}

module.exports = hmset;
