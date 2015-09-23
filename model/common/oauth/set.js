'use strict'

var Q = require('q');
var path = require('path');
var redis = require(path.resolve(global.gpath.app.libs + '/redis'));

function _set(key, options, expireTime){
    var dfd = Q.defer();
    if(key == undefined || options == undefined){
        dfd.reject({
            err: 'param error'
        });
    }else{
        redis.select('2')
            .then(function resolve(res) {
                console.log('is select ok:', res);
                return redis.hmset(key, options);
            }, function reject(err) {
                dfd.reject(err);
            })
            .then(function resolve(res){
               console.log('is hmset ok:', res);
               return redis.expire(key, expireTime);
            }, function reject(err){
                    dfd.reject(err);
            })
            .then(function resolve(res){
               console.log('is expire ok:', res);
               dfd.resolve(true);
            }, function reject(err){
                dfd.reject(err);
            });
    }
    return dfd.promise;
}

module.exports = _set;