/**
 * Created by elenahao on 15/9/6.
 */

'use strict';
var path = require('path');
var Q = require('q');
var Lazy = require('lazy.js');
var _ = require('lodash');
var User = require(path.resolve(global.gpath.app.model + '/common/user'));
var Group = require(path.resolve(global.gpath.app.model + '/common/group'));

// 获取指定分页和个数的用户
app.get('/admin/api/user/',
    function(req, res) {
        console.log('/admin/api/user/', req.query.start, req.query.count);
        var _start = !_.isNaN(parseInt(req.query.start)) ? parseInt(req.query.start) : 0;
        var _count = !_.isNaN(parseInt(req.query.count)) ? parseInt(req.query.count) : 20;
        var _end = _start + _count;
        var _pages = 0;
        var _now = 0;
        var _us = [];
        User.all().then(function done(users) {
            console.log('user='+users);
            _pages = Math.ceil(users.length / _count);
            _now = Math.floor(_start / _count) + 1;
            for (var i = _start; i < _end; i++) {
                if (users[i]) {
                    _us.push(users[i]);
                } else {
                    break;
                }
            }
            return Group.all();
        }, function err(err) {
            res.status(400).send(JSON.stringify({
                ret: -1,
                msg: err
            }));
        })
        .then(function done(groups) {
            console.log('groups='+groups);
            res.status(200).send(JSON.stringify({
                ret: 0,
                data: {
                    users: _us,
                    page: _pages,
                    now: _now,
                    groups: groups,
                    start: _start,
                    count: _count
                }
            }));
        }, function err(err) {
            res.status(400).send(JSON.stringify({
                ret: -1,
                msg: err
            }));
        })
    });