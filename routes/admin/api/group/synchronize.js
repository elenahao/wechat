/**
 * Created by elenahao on 15/9/16.
 */

'use strict';
var path = require('path');
var Q = require('q');
var Lazy = require('lazy.js');
var _ = require('lodash');
var request = require('request');
var redis = require(path.resolve(global.gpath.app.libs + '/redis'));
var Group = require(path.resolve(global.gpath.app.model + '/common/group'));
var Token = require(path.resolve(global.gpath.app.model + '/common/token'));

// 调用微信接口获取公众号的所有组
app.get('/admin/api/group/synchronize', function(req, res) {
    var dfd = Q.defer();
    console.log("admin group synchronize ...");
    //将redis中的group数据全部删除 //需要添加一个删除schedual的功能
    Group.delAll().then(function resolve(res) {
        console.log('del over...');
        return Token.getAccessToken();
    }, function reject(err){
        res.status(400).send(JSON.stringify({
            ret: -4,
            msg: err
        }));
    })
    .then(function resolve(res) {
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