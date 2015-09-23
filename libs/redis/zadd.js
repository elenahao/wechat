'use strict';

var Q = require('q');
var client = require('./client');
var Lazy = require('lazy.js');

/**
 * 插入Zset promise
 * @param {String} Zset Key
 * @param {Array} Zset Data
 *
 * @return {Object} 插入结果
 */
function zadd(key, val) {
    var dfd = Q.defer();

    if (key && val) {

        var _arg = [];

        _arg.push(key);

        Lazy(val).each(function(_val) {
            _arg.push(_val);
        });

        client.zadd(_arg, function(err, res) {
            if (err) {
                dfd.reject(err);
            } else {
                dfd.resolve(res);
            }
        }); // end of client.zadd
    } else {
        dfd.reject({
            err: 'param error'
        });
    }

    return dfd.promise;
}; // end of zadd

module.exports = zadd;
