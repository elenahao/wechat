'use strict';

var Q = require('q');
var path = require('path');
var Lazy = require('lazy.js');
var _ = require('lodash');
var redis = require(path.resolve(global.gpath.app.libs + '/redis'));

var _getUser = require('./get');

/**
 * 获取用户信息 promise
 * @param {Array} 用户id数组
 *
 * @return {Array} 用户信息记录
 */
function _getUsers(uids) {
    var dfd = Q.defer();
    if (Lazy(uids).isEmpty()) {
        dfd.reject({
            err: 'uids is empty'
        });
    } else {
        var queue = [];

        Lazy(uids).each(function(uid) {
            queue.push(_getUser(uid));
        });

        Q.all(
            queue
        ).then(function resolve(res) {
            if (!Lazy(res).isEmpty()) {
                dfd.resolve(res);
            } else {
                dfd.reject({
                    err: 'users not found'
                });
            }
        }, function reject(err){
            dfd.reject({
                err: err
            });
        }); // end of Q
    } // end of if uids

    return dfd.promise
} // end of _getUsers

module.exports = _getUsers;
