'use strict';

var Q = require('q');
var path = require('path');
var _ = require('lodash');
var redis = require(path.resolve(global.gpath.app.libs + '/redis'));

var _getGroup = function(gid) {
    var dfd = Q.defer();

    if (gid == undefined) {
        dfd.reject({
            err: 'gid is undefined'
        });
    } else {
        Q(
            redis.hgetall('group:' + gid)
        ).then(function resolve(res) {
            var _group = res;
            dfd.resolve(_group);
        }, function reject(err) {
            dfd.reject({
                err: 'group not found'
            });
        }); // end of Q
    } // end of if qid

    return dfd.promise;
};

module.exports = _getGroup;
