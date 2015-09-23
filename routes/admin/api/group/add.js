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

app.post(['/admin/api/group/add'],
    function(req, res, next){
        console.log('admin api group add-to-wechat ... ');
        var dfd = Q.defer();
        console.log('gname='+req.body.gname);
        req.sanitize('gname').trim();
        req.sanitize('gname').escape();
        //验证
        req.checkBody('gname', 'empty').notEmpty();
        console.log('gname='+req.body.gname);
        var errors = req.validationErrors();
        console.log('err:',errors);

        if (errors) {
            res.status(400).send(JSON.stringify({
                ret: -1,
                msg: errors
            }));
        } else {
            //var _data = req.body;
            var _gname = req.body.gname;
            if (_gname) {
                //{"group":{"name":"test"}}
                //先获取ACCESS_TOKEN
                var ACCESS_TOKEN = '';
                Token.getAccessToken().then(function resolve(res) {
                    if(res.access_token){
                        console.log(res.access_token);
                        ACCESS_TOKEN = res.access_token;
                        console.log(res.access_token);
                        console.log('_gname='+_gname);
                        var group = {
                            name: _gname
                        }
                        console.log(JSON.stringify(group));
                        request({url: 'https://api.weixin.qq.com/cgi-bin/groups/create?access_token='+ACCESS_TOKEN,
                            method: 'POST',
                            body: JSON.stringify({group: group})
                        }, function (err, res, body){
                            console.log('is request get ok:', body);
                            if(!err){
                                var _body = JSON.parse(body);
                                if(typeof _body.group === 'undefined'){
                                    res.status(400).send(JSON.stringify({
                                        ret: -4,
                                        msg: body
                                    }));
                                }else{
                                    var _g = _body.group;
                                    redis.hmset('group:'+_g.id, {id: _g.id, name: _g.name, count: 0})
                                    .then(function resolve(res){
                                        console.log('is hmset group ok:', res);
                                        dfd.resolve(res);
                                    }, function reject(err){
                                       dfd.reject(err);
                                    });
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
            } else {
                res.status(400).send(JSON.stringify({
                    ret: -3,
                    msg: errors
                }));
            }
            res.redirect('/admin/group');
        }
    });

