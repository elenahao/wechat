'use strict';

var Q = require('q');
var path = require('path');
var _ = require('lodash');
var Lazy = require('lazy.js');
var redis = require(path.resolve(global.gpath.app.libs + '/redis'));

var groups = {};

var _delAllGroup = function() {
    var dfd = Q.defer();
    //先扫描出所有的group的key
    console.log('in delAllGroup ... ');
    scan().then(function(res){
        console.log('is scan ok:', res);
        var g = [];
        Lazy(res).each(function(value, key){
            //key的格式：group:101
            g.push(key);
        });
        if(Lazy(g).isEmpty()){
            dfd.resolve([]);
        }else{
            redis.del(g).then(function done(res){
                console.log('is del ok:', res);
                dfd.resolve(res);
            },function err(err){
                dfd.reject(err);
            });
        }
    });

    return dfd.promise;
}

function scan() {
    var dfd = Q.defer();
    var cursor = '0';
    groups = {};
    function _scan(){
        redis.client.scan(
            cursor,
            'match', 'group:*',
            'count', '100',
            function(err, res) {
                cursor = res[0];
                if(res[1].length > 0){
                    console.log(res[1]);
                    Lazy(res[1]).each(function(gid){
                        console.log('gid='+gid);
                        groups[gid] = gid.split(':')[1];
                    });
                }

                if (cursor == 0) {
                    dfd.resolve(groups);
                } else {
                    _scan();
                }
            }
        );
    }
    _scan();

    return dfd.promise;
}

module.exports = _delAllGroup;
