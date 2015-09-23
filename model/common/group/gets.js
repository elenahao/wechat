'use strict';

var Q = require('q');
var path = require('path');
var Lazy = require('lazy.js');
var _ = require('lodash');
var redis = require(path.resolve(global.gpath.app.libs + '/redis'));

var _getGroup = require('./get');

/**
 * 获取组信息 promise
 * @param {Array} 组id数组
 *
 * @return {Array} 组信息记录
 */
function _getGroups(gids) {
    var dfd = Q.defer();
    if (Lazy(gids).isEmpty()) {
        dfd.reject({
            err: 'gids is empty'
        });
    } else {
        var queue = [];

        Lazy(gids).each(function(gid) {
            queue.push(_getGroup(gid));
        });

        Q.all(
            queue
        ).then(function resolve(res) {
            if (!Lazy(res).isEmpty()) {
                dfd.resolve(res);
            } else {
                dfd.reject({
                    err: 'groups not found'
                });
            }
        }, function reject(err){
            dfd.reject({
                err: err
            });
        }); // end of Q
    } // end of if gids

    return dfd.promise
} // end of _getGroups

module.exports = _getGroups;
