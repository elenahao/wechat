//首页接口

'use strict';
var path = require('path');
var Q = require('q');
var Lazy = require('lazy.js');
var _ = require('lodash');
var validUrl = require('valid-url');
var User = require(path.resolve(global.gpath.app.model + '/common/user'));
var FHistory = require(path.resolve(global.gpath.app.model + '/common/history'));


function getDataAndSend(uid, res, name, avatar){
    var _uid = parseInt(uid) == uid ? parseInt(uid) : NaN;
    var _user = {};
    var _fight = [];
    var _data = {};

    if (!_.isNaN(_uid)) {
        //查询是否有这个用户
        Q(User.get(_uid)).then(
            function has(user) {
                //用户存在，开始查询对战历史并返回整合数据
                _user = user;
                FHistory.get(_user.uid).then(function has(history){
                    sendData(_user, history, res);
                },function dont(err){
                    console.log(_user);
                    sendData(_user, null, res);
                });
            }, // end of has user
            function dont(err) {
                //用户不存在, 创建用户
                // console.log(req.query.name);
                if (name == undefined || name == '') {
                    res.status(400).send(JSON.stringify({
                        ret: -1,
                        msg: 'user not found'
                    }));
                } else {
                    _user = {
                        uid: _uid,
                        name: name,
                        avatar: avatar && validUrl.isUri(avatar) ? avatar : '', // TODO 添加默认头像
                    };

                    User.new(_user.uid, _user).then(function resolve(isSuccess) {
                        sendData(_user, null, res);
                    }, function reject(err) {
                        res.status(400).send(JSON.stringify({
                            ret: -1,
                            msg: err
                        }));
                    }); // end of User.new
                } // end of if
            } // end of create user
        ).done();
    } else {
        // uid非法
        res.status(400).send(JSON.stringify({
            ret: -1,
            msg: 'uid is undefined'
        }));
    }
}

function sendData(user, fightHis, res) {
    var _data = {
        ret: 0,
        data: {
            user: {
                name: user.name,
                avatar: user.avatar,
                score: user.score,
                times: user.times,
                challenge: user.challenge,
                new_tor: user.new_tor
            },
            fightHis: fightHis
        }
    }
    res.status(200).send(JSON.stringify(_data));
}

app.get(['/api/home/:uid'],
    function(req, res, next) {
        console.log("api/home...");

        getDataAndSend(req.params.uid, res);

    });

app.post(['/api/home/:uid/:name/:avatar'],
    function(req, res, next) {
        console.log("api/home/uid/name/avatar...");

        getDataAndSend(req.params.uid, res, req.params.name, req.params.avatar);
    });
