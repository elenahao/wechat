/**
 * Created by elenahao on 15/9/9.
 */

'use strict';
var path = require('path');
var Q = require('q');
var Lazy = require('lazy.js');
var _ = require('lodash');
var request = require('request');
var redis = require(path.resolve(global.gpath.app.libs + '/redis'));
var Token = require(path.resolve(global.gpath.app.model + '/common/token'));

app.get('/admin/api/group/delete/:gid',
    function(req, res, next){
        var dfd = Q.defer();
        console.log('admin api group delete-to-wechat ... ');
        console.log('gid='+req.params.gid);
        var _gid = req.params.gid;
        if (_gid) {
            //{"group":{"id":108}}
            //先获取ACCESS_TOKEN
            var ACCESS_TOKEN = '';
            Token.getAccessToken().then(function resolve(res) {
                if(res.access_token){
                    console.log(res.access_token);
                    ACCESS_TOKEN = res.access_token;
                    console.log('_gid='+_gid);
                    var group = {
                        id: _gid
                    }
                    console.log(JSON.stringify(group));
                    request({url: 'https://api.weixin.qq.com/cgi-bin/groups/delete?access_token='+ACCESS_TOKEN,
                        method: 'POST',
                        body: JSON.stringify({group: group})
                    }, function (err, res, body){
                        console.log('is request get ok:', body);
                        redis.del('group:'+_gid).then(function resolve(res){
                            console.log('is del group ok:', res);
                            return redis.del('schedual_user:'+_gid);
                        }, function reject(err){
                            dfd.reject(err);
                        })
                        .then(function resolve(res){
                            console.log('is del schedual ok:', res);
                            dfd.resolve(res);
                        }, function reject(err){
                            dfd.reject(err);
                        })
                    });
                }
            },function reject(err){
                res.status(400).send(JSON.stringify({
                    ret: -4
                }));
            })
        } else {
            res.status(400).send(JSON.stringify({
                ret: -3
            }));
        }
        res.redirect('/admin/group');
    });

