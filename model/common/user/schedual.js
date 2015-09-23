'use strict';

var Q = require('q');
var path = require('path');
var _ = require('lodash');
var Lazy = require('lazy.js');
var redis = require(path.resolve(global.gpath.app.libs + '/redis'));
var getScheduals = require('./getScheduals');

var scheduals = {};

var _getAllSchedual = function() {
    var dfd = Q.defer();
    scan().then(function(res){
        var su = [];
        Lazy(res).each(function(value, key){
            su.push(value);
        });
        if(Lazy(su).isEmpty()){
            dfd.resolve([]);
        }
        getScheduals(su).then(function done(_su){
            dfd.resolve(_su);
        },function err(err){
            dfd.reject(err);
        });
    });

    return dfd.promise;
}

function scan() {
    var dfd = Q.defer();
    var cursor = '0';
    scheduals = {};
    function _scan(){
        redis.client.scan(
            cursor,
            'match', 'schedual_user:*',
            'count', '100',
            function(err, res) {
                cursor = res[0];
                if(res[1].length > 0){
                    Lazy(res[1]).each(function(suid){
                        scheduals[suid] = suid.split(':')[1];
                    });
                }

                if (cursor == 0) {
                    dfd.resolve(scheduals);
                } else {
                    _scan();
                }
            }
        );
    }
    _scan();

    return dfd.promise;
}

module.exports = _getAllSchedual;
