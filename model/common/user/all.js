'use strict';

var Q = require('q');
var path = require('path');
var _ = require('lodash');
var Lazy = require('lazy.js');
var redis = require(path.resolve(global.gpath.app.libs + '/redis'));
var getUsers = require('./gets');

var users = {};

var _getAllUser = function() {
    var dfd = Q.defer();
    redis.get('allus').then(function done(allus){
        dfd.resolve(JSON.parse(allus));
    },function err(err){
        scan().then(function(res){
            var u = [];
            Lazy(res).each(function(value,key){
                u.push(value);
            });
            if(Lazy(u).isEmpty()){
                dfd.resolve([]);
            }
            getUsers(u).then(function done(us){
                redis.set('allus', JSON.stringify(us));
                //redis.client.expire('allus', 20);
                dfd.resolve(us);
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
    users = {};
    function _scan(){
        redis.client.scan(
            cursor,
            'match', 'user:*',
            'count', '1000',
            function(err, res) {
                cursor = res[0];
                if(res[1].length > 0){
                    console.log(res[1]);
                    Lazy(res[1]).each(function(uid){
                        users[uid] = uid.split(':')[1];
                    });
                }

                if (cursor == 0) {
                    dfd.resolve(users);
                } else {
                    _scan();
                }
            }
        );
    }
    _scan();

    return dfd.promise;
}

module.exports = _getAllUser;
