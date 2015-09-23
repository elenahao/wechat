'use strict'

var Q = require('q');
var path = require('path');
var redis = require(path.resolve(global.gpath.app.libs + '/redis'));

function _get(key, field){
    var dfd = Q.defer();
    if(key == undefined || field == undefined){
        dfd.reject({
            err: 'param error'
        });
    }else{
        redis.select('2')
            .then(function resolve(res) {
                console.log('is select ok:', res);
                return redis.hexists(key, field);
            }, function reject(err) {
                dfd.reject(err);
            })
            .then(function resolve(res){
               console.log('is hexists ok:', res);
               return redis.hgetall(key);
            }, function reject(err){
                    dfd.reject(err);
            })
            .then(function resolve(res){
               console.log('is hgetall ok:', res);
               dfd.resolve(res);
            }, function reject(err){
                dfd.reject(err);
            });
    }
    return dfd.promise;
}

module.exports = _get;