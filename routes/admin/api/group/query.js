/**
 * Created by elenahao on 15/9/6.
 */
'use strict';
var path = require('path');
var Q = require('q');
var Lazy = require('lazy.js');
var _ = require('lodash');
var Group = require(path.resolve(global.gpath.app.model + '/common/group'));

// 获取指定分页和个数的组
app.get('/admin/api/group',
    function(req, res) {
        console.log('/admin/api/group', req.query.start, req.query.count);

        var _start = !_.isNaN(parseInt(req.query.start)) ? parseInt(req.query.start) : 0;
        var _count = !_.isNaN(parseInt(req.query.count)) ? parseInt(req.query.count) : 20;
        var _end = _start + _count;

        Group.all().then(function done(groups) {
            console.log('group='+groups);
            var _pages = Math.ceil(groups.length / _count);
            var _now = Math.floor(_start / _count) + 1;

            var _gs = [];
            for (var i = _start; i < _end; i++) {
                if (groups[i]) {
                    _gs.push(groups[i]);
                } else {
                    break;
                }
            }

            res.status(200).send(JSON.stringify({
                ret: 0,
                data: {
                    groups: _gs,
                    page: _pages,
                    now: _now,
                    start: _start,
                    count: _count
                }
            }));

        }, function err(err) {

            res.status(400).send(JSON.stringify({
                ret: -1,
                msg: err
            }));

        });
    });