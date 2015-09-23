//获取用户可用题集

'use strict';
var path = require('path');
var Q = require('q');
var Lazy = require('lazy.js');
var _ = require('lodash');
var Playset = require(path.resolve(global.gpath.app.model + '/common/playset'));
var User = require(path.resolve(global.gpath.app.model + '/common/user'));

app.get(['/api/playset/allsets/user/:uid'],
    function(req, res, next) {
        var _uid = parseInt(req.params.uid) == req.params.uid ? parseInt(req.params.uid) : NaN;
        if (!_.isNaN(_uid)) {
            //查询是否有这个用户
            User.get(_uid).then(function resolve(user) {
                var _data = {};
                if (Lazy(user.playset).isEmpty()) {
                    _data = {
                        ret: -1,
                        msg: 'this user do not have any playsets yet.'
                    }
                    res.status(200).send(JSON.stringify(_data));
                } else {
                    var _pids = [];
                    Lazy(user.playset).each(function(playset){
                        _pids.push(playset.pid);
                    });
                    Playset.gets(_pids).then(function resolve(playsets){
                        var _playsets = [];
                        Lazy(playsets).each(function(playset,key){
                            _playsets.push({
                                pid: playset.pid,
                                name: playset.name,
                                coverUrl: playset.coverUrl,
                                level: user.playset[key].level
                            });
                        });
                        _data = {
                            ret: 0,
                            msg: '',
                            data: _playsets
                        }
                        res.status(200).send(JSON.stringify(_data));
                    },function reject(err){
                        res.status(400).send(JSON.stringify({
                            ret: -1,
                            err: err
                        }));
                    });
                }
            }, function reject(err) {
                // 用户不存在
                res.status(400).send(JSON.stringify({
                    ret: -1,
                    err: err
                }));
            });
        } else {
            res.status(400).send(JSON.stringify({
                ret: -1,
                err: 'param error'
            }));
        }
    });
