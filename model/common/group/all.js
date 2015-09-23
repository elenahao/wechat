'use strict';

var Q = require('q');
var path = require('path');
var _ = require('lodash');
var Lazy = require('lazy.js');
var redis = require(path.resolve(global.gpath.app.libs + '/redis'));
var getGroups = require('./gets');

var groups = {};

var _getAllGroup = function() {
    var dfd = Q.defer();
    redis.get('allgs').then(function done(allgs){
        dfd.resolve(JSON.parse(allgs));
    },function err(err){
        scan().then(function(res){
            var g = [];
            Lazy(res).each(function(value,key){
                g.push(value);
            });
            if(Lazy(g).isEmpty()){
                dfd.resolve([]);
            }

            getGroups(g).then(function done(gs){
                redis.set('allgs', JSON.stringify(gs));
                //redis.client.expire('allgs', 20);
                dfd.resolve(gs);
            },function err(err){
                dfd.reject(err);
            });
        });
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
            'count', '100',//目前微信支持最多建100个群组，实际不涉及递归，但这样写方便日后100这个数值扩展时兼容
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

module.exports = _getAllGroup;
