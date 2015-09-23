'use strict';

var Q = require('q');
var client = require('./client');
var Lazy = require('lazy.js');

/**
 * LRANGE key start stop
 * 返回列表集 key 中，指定区间内的成员 promise
 * @param {String} key
 * @param {Number} start
 * @param {Number} stop
 *
 * @return {Object} 查询结果
 */
function lrange(key, start, stop) {
    console.log('lrange...');
    var dfd = Q.defer();

    console.log('key='+key+',start='+start+',stop='+stop);

    if (key && start && stop) {
        client.lrange(key, start, stop, function(err, res) {
            if (err) {
                console.log('err...');
                dfd.reject(err);
            } else {
                console.log(JSON.stringify(res));
                dfd.resolve(res);
            }
        }); // end of client.lrange
    } else {
        dfd.reject({
            err: 'param error'
        });
    }

    return dfd.promise;
}; // end of lrange

module.exports = lrange;
