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

// 调取微信接口获取用户的openid
app.get('/admin/api/refresh/user', function(req, res) {
    var dfd = Q.defer();
    console.log("admin user get...");
    var ACCESS_TOKEN = '';
    Token.getAccessToken().then(function resolve(res) {
        if(res.access_token){
            console.log(res.access_token);
            ACCESS_TOKEN = res.access_token;
            //var next_openid = 'o0aT-dzYotN0c1QJeejYOGStmKFQ';
            //var next_openid = 'o0aT-d-2Ml_edNGuWquQQki_Xpgk';
            //getUser(ACCESS_TOKEN, next_openid);
            request({
                url: 'https://api.weixin.qq.com/cgi-bin/user/get?access_token='+ACCESS_TOKEN,
                method: 'GET'
            }, function(err, res, body) {
                if(err) console.log(err);
                console.log('======'+body);
                if (res.statusCode === 200) {
                    console.log('success');
                    //存入redis
                    var _body = JSON.parse(body);
                    var total = _body.total;
                    var count = _body.count;
                    var data = _body.data;
                    var openids = data.openid;
                    var next_openid = _body.next_openid;
                    for(var i = 0; i< openids.length; i++){
                        var openid = openids[i];
                        var options = {
                            openid : openid
                        }
                        redis.hmset('user:'+openid, options)
                            .then(function resolve(res) {
                                console.log('is set ok:', res);
                            }, function reject(err) {
                                dfd.reject(err);
                            })
                    }
                    if(total != count){
                        getUser(ACCESS_TOKEN, next_openid);
                    }
                }
            });
        }
    },function reject(err){
        res.status(400).send(JSON.stringify({
            ret: -4,
            msg: errors
        }));
    })
    res.redirect('/admin/user');
});

var getUser = function(ACCESS_TOKEN, next_openid) {
    var dfd = Q.defer();
    console.log(ACCESS_TOKEN);
    console.log(next_openid);
    request({
        url: 'https://api.weixin.qq.com/cgi-bin/user/get?access_token='+ACCESS_TOKEN+'&next_openid='+next_openid,
        method: 'GET'
    }, function(err, res, body){
        var _body = JSON.parse(body);
        console.log('_body='+_body);
        var total = _body.total;
        var count = _body.count;
        var data = _body.data;
        console.log('data='+data);
        var openids = data.openid;
        var next_openid = _body.next_openid;
        for(var i = 0; i< openids.length; i++){
            var openid = openids[i];
            var options = {
                openid : openid
            }
            redis.hmset('user:'+openid, options)
                .then(function resolve(res) {
                    console.log('is set ok:', res);
                }, function reject(err) {
                    dfd.reject(err);
                })
        }
        if(count != 10000){
            //结束,last time
            request({
                url: 'https://api.weixin.qq.com/cgi-bin/user/get?access_token='+ACCESS_TOKEN+'&next_openid='+next_openid,
                method: 'GET'
            }, function(err, res, body) {
                var _body = JSON.parse(body);
                var total = _body.total;
                var count = _body.count;
                var data = _body.data;
                var openids = data.openid;
                var next_openid = _body.next_openid;
                for (var i = 0; i < openids.length; i++) {
                    var openid = openids[i];
                    var options = {
                        openid: openid
                    }
                    redis.hmset('user:' + openid, options)
                        .then(function resolve(res) {
                            console.log('is set ok:', res);
                        }, function reject(err) {
                            dfd.reject(err);
                        })
                }
            });
        }else{
            getUser(ACCESS_TOKEN, next_openid);
        }
    });

}