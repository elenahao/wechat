/**
 * Created by elenahao on 15/9/10.
 */

/*
将所有城市为beijing的添加到‘北京’的组内 for test
 */
var path = require('path');
var Q = require('q');
var Lazy = require('lazy.js');
var _ = require('lodash');
var request = require('request');
var User = require(path.resolve(global.gpath.app.model + '/common/user'));
var Token = require(path.resolve(global.gpath.app.model + '/common/token'));

var us_openid = [];

app.get('/admin/api/user/manyToGroup',
    function(req, res, next){
        console.log('admin api user-to-group ... ');
        var to_groupid = req.query.to_groupid;

        //先从redis中取出所有省份为beijing的记录的openid
        User.all().then(function done(users) {
            console.log('user='+users);
            for (var i = 0; i < users.length; i++) {
                var user = users[i];
                if (user && user.province == 'Beijing') {
                    us_openid.push(user.openid);
                } else {
                    break;
                }
            }
        }, function err(err) {
                res.status(400).send(JSON.stringify({
                    ret: -1,
                    msg: err
            }));
        });

        if (us_openid) {
            //{"openid_list":["oDF3iYx0ro3_7jD4HFRDfrjdCM58","oDF3iY9FGSSRHom3B-0w5j4jlEyY"],"to_groupid":108}
            //先获取ACCESS_TOKEN
            var ACCESS_TOKEN = '';
            Token.getAccessToken().then(function resolve(res) {
                if(res.access_token){
                    console.log(res.access_token);
                    ACCESS_TOKEN = res.access_token;
                    request({url: 'https://api.weixin.qq.com/cgi-bin/groups/members/batchupdate?access_token='+ACCESS_TOKEN,
                        method: 'POST',
                        body: JSON.stringify({openid_list: us_openid, to_groupid: to_groupid})
                    }, function (err, res, body){
                        console.log('is request get ok:', body);
                    });
                }
            },function reject(err){
                res.status(400).send(JSON.stringify({
                    ret: -1,
                    msg: ''
                }));
            })
            res.redirect('/admin/group');
        } else {
            res.status(400).send(JSON.stringify({
                ret: -1,
                msg: ''
            }));
        }
    });

