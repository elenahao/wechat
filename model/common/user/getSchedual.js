'use strict';

var Q = require('q');
var path = require('path');
var _ = require('lodash');
var redis = require(path.resolve(global.gpath.app.libs + '/redis'));

var _getSchedual = function(suid) {
    var dfd = Q.defer();
    if (suid == undefined) {
        dfd.reject({
            err: 'suid is undefined'
        });
    } else {
        Q(
            redis.hgetall('schedual_user:' + suid)
        ).then(function resolve(res) {
            var _schedual = res;
            _.extend(_schedual, {
                to_groupid : suid
            });
            dfd.resolve(res);
        }, function reject(err) {
            dfd.reject({
                err: 'schedual not found'
            });
        }); // end of Q
    } // end of if suid

    return dfd.promise;
};

module.exports = _getSchedual;
