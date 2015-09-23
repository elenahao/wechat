//管理后台获取题集api

'use strict';
var path = require('path');
var Q = require('q');
var Lazy = require('lazy.js');
var _ = require('lodash');
var validUrl = require('valid-url');
var Playset = require(path.resolve(global.gpath.app.model + '/common/playset'));

// 获取指定分页和个数的题目
app.get('/admin/api/playset',
    function(req, res) {
        console.log('/admin/api/playset', req.query.start, req.query.count);

        var _start = !_.isNaN(parseInt(req.query.start)) ? parseInt(req.query.start) : 0;
        var _count = !_.isNaN(parseInt(req.query.count)) ? parseInt(req.query.count) : 20;
        var _end = _start + _count;

        Playset.all().then(function done(playsets) {

            var _pages = Math.ceil(playsets.length / _count);
            var _now = Math.floor(_start / _count) + 1;

            var _ps = [];
            for (var i = _start; i < _end; i++) {
                if (playsets[i]) {
                    _ps.push(playsets[i]);
                } else {
                    break;
                }
            }

            res.status(200).send(JSON.stringify({
                ret: 0,
                data: {
                    playsets: _ps,
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
