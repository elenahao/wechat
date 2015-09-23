'use strict';

var Q = require('q');
var client = require("./client");
var _ = require('lodash');

/**
 * srem promise
 * @param {String} Key
 * @param {String} Value
 *
 * @return {Object} 插入结果
 */
function srem(key, val) {
    var dfd = Q.defer();

    if (key && val) {
        client.srem(key, val, function(err) {
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

module.exports = srem;
