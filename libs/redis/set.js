'use strict';

var Q = require('q');
var client = require("./client");

/**
 * 插入String promise
 * @param {String} Key
 * @param {String} Value
 *
 * @return {Object} 插入结果
 */
function set(key, val) {
    var dfd = Q.defer();

    if (key && val) {
        client.set(key, val, function(err) {
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
};

module.exports = set;
