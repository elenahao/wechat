'use strict';

var Q = require('q');
var client = require("./client");

/**
 * 设置过期时间 promise
 * @param {String} Key
 * @param {Number} Value
 *
 * @return {Object} 是否成功
 */
function expire(key, value) {
    var dfd = Q.defer();

    if (key && value) {
        client.expire(key, value, function(err) {
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

module.exports = expire;
