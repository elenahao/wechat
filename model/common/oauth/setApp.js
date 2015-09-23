'use strict'

var Q = require('q');
var path = require('path');
var redis = require(path.resolve(global.gpath.app.libs + '/redis'));

function _setApp(app_id, secret){
    var dfd = Q.defer();
    if(app_id == undefined || secret == undefined){
        dfd.reject({
            err: 'param error'
        });
    }else{
        var key = 'app_id:'+app_id;
        var options = {
            'secret' : secret
        }
        redis.select('2')
            .then(function resolve(res) {
                console.log('is select ok:', res);
                return redis.hmset(key, options);
            }, function reject(err) {
                dfd.reject(err);
            })
            .then(function resolve(res){
               console.log('is hmset ok:', res);
               dfd.resolve(true);
            }, function reject(err){
                    dfd.reject(err);
            });
    }
    return dfd.promise;
}

module.exports = _setApp;