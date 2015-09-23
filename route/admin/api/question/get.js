//管理后台获取题目api

'use strict';
var path = require('path');
var Q = require('q');
var Lazy = require('lazy.js');
var _ = require('lodash');
var validUrl = require('valid-url');
var Question = require(path.resolve(global.gpath.app.model + '/common/question'));

// 获取指定分页和个数的题目
app.get('/admin/api/question',
    function(req, res) {
        console.log('/admin/api/question', req.query.start, req.query.count);

        var _start = !_.isNaN(parseInt(req.query.start)) ? parseInt(req.query.start) : 0;
        var _count = !_.isNaN(parseInt(req.query.count)) ? parseInt(req.query.count) : 20;
        var _end = _start + _count;

        Question.all().then(function done(questions) {
            console.log('question='+questions);
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

        }, function err(err) {

            res.status(400).send(JSON.stringify({
                ret: -1,
                msg: err
            }));

        });
    });

// 获取单个题目
app.get('/admin/api/question/:qid',
    function(req, res) {
        var _qid = req.params.qid ? req.params.qid : null;
        console.log('/admin/api/question/' + _qid + '......');

        if (_qid) {
            Question.get(_qid).then(function find(data) {

                res.status(200).send(JSON.stringify({
                    ret: 0,
                    data: data
                }));

            }, function err(err) {
                res.status(400).send(JSON.stringify({
                    ret: -1,
                    msg: err
                }));
            });
        }
    });

// 删除题目
app.delete('/admin/api/question/:qid',
    function(req, res) {
        var _qid = req.params.qid ? req.params.qid : null;
        console.log('/admin/api/question/' + _qid + '......');

        if (_qid) {
            Question.get(_qid).then(function find(data) {
                Question.del(_qid).then(function done(data) {
                    // console.log(data)
                    res.status(200).send(JSON.stringify({
                        ret: 0
                    }));
                }, function err(err) {
                    res.status(400).send(JSON.stringify({
                        ret: -1,
                        msg: err
                    }));
                });

            }, function err(err) {
                res.status(400).send(JSON.stringify({
                    ret: -1,
                    msg: err
                }));
            });
        }
    });
