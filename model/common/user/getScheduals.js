'use strict';

var Q = require('q');
var path = require('path');
var Lazy = require('lazy.js');
var _ = require('lodash');
var redis = require(path.resolve(global.gpath.app.libs + '/redis'));

var _getSchedual = require('./getSchedual');

/**
 * 获取用户定时信息 promise
 * @param {Array} 用户定时分组主键 eg:province-Beijing
 *
 * @return {Array} 用户定时信息记录
 */
function _getScheduals(suids) {
    var dfd = Q.defer();
    if (Lazy(suids).isEmpty()) {
        dfd.reject({
            err: 'suids is empty'
        });
    } else {
        var queue = [];

        Lazy(suids).each(function(suid) {
            queue.push(_getSchedual(suid));
        });

        Q.all(
            queue
        ).then(function resolve(res) {
            if (!Lazy(res).isEmpty()) {
                dfd.resolve(res);
            } else {
                dfd.reject({
                    err: 'scheduals not found'
                });
            }
        }, function reject(err){
            dfd.reject({
                err: err
            });
        }); // end of Q
    } // end of if suids

    return dfd.promise
} // end of _getSchduals

module.exports = _getScheduals;
