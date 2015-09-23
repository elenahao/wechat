'use strict';

var Q = require('q');
var client = require('./client');
var Lazy = require('lazy.js');

/**
 * ZREVRANGE key start stop [WITHSCORES]
 * 返回有序集 key 中，指定区间内的成员 promise
 * @param {String} key
 * @param {Number} start
 * @param {Number} stop
 *
 * @return {Object} 查询结果
 */
function zrevrange(key, start, stop) {
    console.log('ZREVRANGE');
    var dfd = Q.defer();

    console.log('key='+key+',start='+start+',stop='+stop);

    var args1 = [ 'rank', '+inf', '-inf', 'WITHSCORES' ];
    if (args1) {
        client.zrevrangebyscore(args1, function(err, res) {
            if (err) {
                console.log('err...');
                dfd.reject(err);
            } else {
                console.log(JSON.stringify(res));
                dfd.resolve(res);
            }
        }); // end of client.zrevrange
    } else {
        dfd.reject({
            err: 'param error'
        });
    }

    return dfd.promise;
}; // end of zrevrange

module.exports = zrevrange;
