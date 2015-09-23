'use strict';

var Q = require('q');
var path = require('path');
var _ = require('lodash');
var UDate = require(path.resolve(global.gpath.app.libs + '/tools/date'));
var redis = require(path.resolve(global.gpath.app.libs + '/redis'));

var _getUser = function(uid) {
    var dfd = Q.defer();

    if (uid == undefined) {
        dfd.reject({
            err: 'uid is undefined'
        });
    } else {
        Q(
            redis.hgetall('user:' + uid)
        ).then(function resolve(res) {
            var _user = res;
            if(_user.subscribe_time){
                var udate = new UDate(new Date(_user.subscribe_time*1000));
                _.extend(_user, {
                    subscribe_time : udate.getYmd('-') + ' ' + udate.getHms()
                });
            }
            dfd.resolve(_user);
        }, function reject(err) {
            dfd.reject({
                err: 'user not found'
            });
        }); // end of Q
    } // end of if uid

    return dfd.promise;
};

module.exports = _getUser;
