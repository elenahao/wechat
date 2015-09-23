// sousuo题目api

'use strict';
var path = require('path');
var Q = require('q');
var Lazy = require('lazy.js');
var _ = require('lodash');
var validUrl = require('valid-url');
var Question = require(path.resolve(global.gpath.app.model + '/common/question'));

// 获取指定分页和个数的题目
app.get('/admin/api/search/question/name/:qname',
    function(req, res) {
        var _qname = req.params.qname;
        var _needDetail = req.query.detail == '1' ? true : false;
        var _start = !_.isNaN(parseInt(req.query.start)) ? parseInt(req.query.start) : 0;
        var _count = !_.isNaN(parseInt(req.query.count)) ? parseInt(req.query.count) : 20;
        var _end = _start + _count;

        Question.query.name(_qname, _needDetail).then(function done(questions) {
            var _pages = Math.ceil(questions.length / _count);
            var _now = Math.floor(_start / _count) + 1;

            var _qs = [];
            for (var i = _start; i < _end; i++) {
                if (questions[i]) {
                    _qs.push(questions[i]);
                } else {
                    break;
                }
            }

            res.status(200).send(JSON.stringify({
                ret: 0,
                data: {
                    questions: _qs,
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
