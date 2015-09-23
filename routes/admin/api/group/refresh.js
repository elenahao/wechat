/**
 * Created by elenahao on 15/9/1.
 */

'use strict';
var path = require('path');
var Q = require('q');
var Lazy = require('lazy.js');
var _ = require('lodash');
var request = require('request');
var redis = require(path.resolve(global.gpath.app.libs + '/redis'));
var Token = require(path.resolve(global.gpath.app.model + '/common/token'));

// 调用微信接口获取公众号的所有组
app.get('/admin/api/group/refresh', function(req, res) {
    var dfd = Q.defer();
    console.log("admin group refresh ...");
    Token.getAccessToken().then(function resolve(res) {
        var ACCESS_TOKEN = '';
        if(res.access_token){
            console.log(res.access_token);
            ACCESS_TOKEN = res.access_token;
            request({
                url: 'https://api.weixin.qq.com/cgi-bin/groups/get?access_token='+ACCESS_TOKEN,
                method: 'GET'
            }, function(err, res, body) {
                if(err) console.log(err);
                console.log('======'+body);
                if (res.statusCode === 200) {
                    console.log('success');
                    //存入redis
                    var data = JSON.parse(body);
                    var groups = data.groups;
                    for(var i = 0; i< groups.length;i++){
                        var group = groups[i];
                        var key = 'group:'+group.id;
                        redis.hmset(key, group)
                            .then(function resolve(res) {
                                console.log('is hmset ok:', res);
                            }, function reject(err) {
                                dfd.reject(err);
                            })
                    }
                }
            });
        }
    },function reject(err){
        res.status(400).send(JSON.stringify({
            ret: -4,
            msg: err
        }));
    })
    res.redirect('/admin/group');
});