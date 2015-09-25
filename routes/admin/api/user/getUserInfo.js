/**
 * Created by elenahao on 15/9/7.
 */

'use strict';
var path = require('path');
var Q = require('q');
var Lazy = require('lazy.js');
var _ = require('lodash');
var request = require('request');
var http = require('http');
var clone = require('safe-clone-deep');
var redis = require(path.resolve(global.gpath.app.libs + '/redis'));
var Token = require(path.resolve(global.gpath.app.model + '/common/token'));

// 调取微信接口获取用户的详细信息
app.get('/admin/api/getInfo/user', function(req, res) {
    console.log("admin userInfo get...");
    var ACCESS_TOKEN = '';
    Token.getAccessToken().then(function resolve(res) {
        if(res.access_token){
            console.log(res.access_token);
            ACCESS_TOKEN = res.access_token;
            //从redis获取所有用户openid scan 每次获取100
            scan(ACCESS_TOKEN);
        }
    },function reject(err){
        res.status(400).send(JSON.stringify({
            ret: -4,
            msg: err
        }));
    })
    //res.redirect('/admin/user');
});

function scan(ACCESS_TOKEN) {
    var dfd = Q.defer();
    var cursor = '0';
    var i = 0;
    function _scan(ACCESS_TOKEN){
        console.log('already update:'+i);
        redis.client.scan(
            cursor,
            'match', 'user:*',
            'count', '10000',
            function(err, res) {
                var user_list = new Array();
                cursor = res[0];
                if(res[1].length > 0){
                    //console.log(res[1]);
                    Lazy(res[1]).each(function(uid){
                        //console.log('uid='+uid);
                        redis.hmget(uid, 'groupid', function(err, res){
                            console.log('err='+err+';res='+res);
                            if(res){
                                var _data = {
                                    openid: uid.split(':')[1],
                                    lang: "zh-CN"
                                }
                                user_list.push(_data);
                            }
                        });
                        if(user_list.length == 100){
                            console.log('ACCESS_TOKEN='+ACCESS_TOKEN);
                            //var url = 'https://api.weixin.qq.com/cgi-bin/user/info/batchget?access_token='+ACCESS_TOKEN+'&user_list='+JSON.stringify(user_list);
                            //console.log(url);
                            request({
                                url: 'https://api.weixin.qq.com/cgi-bin/user/info/batchget?access_token='+ACCESS_TOKEN,//+'&user_list='+JSON.stringify({user_list: user_list}),
                                body: JSON.stringify(clone({user_list: user_list})),
                                method: 'POST'
                            }, function(err, res, body) {
                                if(err) console.log(err);
                                //console.log('======'+body);
                                if (res.statusCode === 200) {
                                    //console.log('success');
                                    //存入redis
                                    var _body = JSON.parse(clone(body));
                                    //console.log(_body);
                                    var user_info_list = _body.user_info_list;
                                    for(var i = 0; i< user_info_list.length; i++){
                                        var options = user_info_list[i];
                                        var openid = options.openid;
                                        redis.hmset('user:'+openid, options)
                                            .then(function resolve(res) {
                                                //console.log('is set ok:', res);
                                            }, function reject(err) {
                                                dfd.reject(err);
                                            })
                                    }
                                }
                            });
                            user_list = new Array();
                        }
                    });
                }
                if (cursor == 0) {
                    dfd.resolve(res);
                } else {
                    i = i + 10000;
                    _scan(ACCESS_TOKEN);
                }
            }
        );
    }
    _scan(ACCESS_TOKEN);

    return dfd.promise;
}