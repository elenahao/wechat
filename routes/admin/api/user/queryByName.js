/**
 * Created by elenahao on 15/9/16.
 */

'use strict';
var path = require('path');
var Q = require('q');
var Lazy = require('lazy.js');
var _ = require('lodash');
var User = require(path.resolve(global.gpath.app.model + '/common/user'));
var Group = require(path.resolve(global.gpath.app.model + '/common/group'));

app.get('/admin/api/search/user/name/:uname',
    function(req, res) {
        var _uname = req.params.uname;
        var _start = !_.isNaN(parseInt(req.query.start)) ? parseInt(req.query.start) : 0;
        var _count = !_.isNaN(parseInt(req.query.count)) ? parseInt(req.query.count) : 20;
        var _end = _start + _count;
        var _groups = [];
        Group.all().then(function resolve(res){
            Lazy(res).each(function(_res){
                _groups.push(_res);
            });
            return User.all();
        }, function reject(err){
            res.status(400).send(JSON.stringify({
                ret: -1,
                msg: 'no groups'
            }));
        })
        .then(function done(users) {
            var _users = [];
            for(var j = 0; j < users.length; j++){
                var user = users[j];
                console.log('-----------user', user);
                if(user.nickname === _uname){
                    console.log('-----------user.nickname:', user.nickname);
                    _users.push(user);
                }else{
                    continue;
                }
            }
            console.log('length',_users.length);
            var _pages = Math.ceil(_users.length / _count);
            console.log('_pages',_pages);
            var _now = Math.floor(_start / _count) + 1;
            console.log('_now:',_now);
            var _us = [];
            for (var i = _start; i < _end; i++) {
                if (_users[i]) {
                    _us.push(_users[i]);
                } else {
                    break;
                }
            }

            res.status(200).send(JSON.stringify({
                ret: 0,
                data: {
                    users: _us,
                    groups: _groups,
                    page: _pages,
                    now: _now,
                    start: _start,
                    count: _count
                }
            }));
        }, function none(err) {
            res.status(400).send(JSON.stringify({
                ret: -1,
                msg: 'no resluts'
            }));
        });
    });
