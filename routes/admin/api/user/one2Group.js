/**
 * Created by elenahao on 15/9/11.
 */

'use strict'
var path = require('path');
var Q = require('q');
var Lazy = require('lazy.js');
var _ = require('lodash');
var request = require('request');
var Token = require(path.resolve(global.gpath.app.model + '/common/token'));
var redis = require(path.resolve(global.gpath.app.libs + '/redis'));

app.post('/admin/api/user/oneToGroup',
    function(req, res, next){
        var dfd = Q.defer();
        console.log('admin api one user-to-group ... ');
        var _gid = req.body.gid;
        var _openid = req.body.openid;

        if (_gid && _openid) {
            //{"openid":"oDF3iYx0ro3_7jD4HFRDfrjdCM58","to_groupid":108}
            //先获取ACCESS_TOKEN
            var ACCESS_TOKEN = '';
            Token.getAccessToken().then(function resolve(res) {
                if(res.access_token){
                    console.log(res.access_token);
                    ACCESS_TOKEN = res.access_token;
                    request({url: 'https://api.weixin.qq.com/cgi-bin/groups/members/update?access_token='+ACCESS_TOKEN,
                        method: 'POST',
                        body: JSON.stringify({openid: _openid, to_groupid: _gid})
                    }, function (err, res, body){
                        console.log('is request get ok:', body);
                        if(!err){
                            var _body = JSON.parse(body);
                            if(_body.errmsg === 'ok'){
                                redis.hmset('user:'+_openid, {groupid: _gid})
                                    .then(function resolve(res){
                                        console.log('is hmset user-groupid ok:', res);
                                        dfd.resolve(res);
                                    }, function reject(err){
                                        dfd.reject(err);
                                    });
                            }
                        }
                    });
                }else{
                    res.status(400).send(JSON.stringify({
                        ret: -1,
                        msg: 'error access_token'
                    }));
                }
            },function reject(err){
                res.status(400).send(JSON.stringify({
                    ret: -1,
                    msg: err
                }));
            })
            res.redirect('/admin/group');
        } else {
            res.status(400).send(JSON.stringify({
                ret: -1,
                msg: 'empty params'
            }));
        }
    });

