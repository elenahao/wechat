/**
 * Created by elenahao on 15/9/18.
 */

var Q = require('q');
var path = require('path');
var _ = require('lodash');
var Lazy = require('lazy.js');
var redis = require(path.resolve(global.gpath.app.libs + '/redis'));

var _getAllCountries = function() {
    console.log('get all countries...');
    var dfd = Q.defer();
    redis.lrange('countries', '0', '-1').then(function resolve(res){
        console.log('is lrange ok:', res);
        dfd.resolve(res);
    },function err(err){
        console.log('is lrange ok:', err);
        dfd.reject(err);
    });

    return dfd.promise;
}

module.exports = _getAllCountries;
