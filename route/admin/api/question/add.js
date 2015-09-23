//管理后台添加题目api

'use strict';
var path = require('path');
var Q = require('q');
var Lazy = require('lazy.js');
var _ = require('lodash');
var validUrl = require('valid-url');
var Question = require(path.resolve(global.gpath.app.model + '/common/question'));
var GenQuestionTemplate = require(path.resolve(global.gpath.app.model + '/common/question/genQuestionTemplate'));

// 新增题目，编辑题目
app.post(['/admin/api/question/add', '/admin/api/question/edit/:qid'],
    function(req, res, next){
        console.log('admin api question add & edit ...');
        req.sanitize('qname').trim();
        req.sanitize('qname').escape();
        req.sanitize('qdesc').trim();
        req.sanitize('qdesc').escape();
        req.sanitize('country').trim();
        req.sanitize('country').escape();
        req.sanitize('video').trim();
        req.sanitize('question').trim();
        req.sanitize('question').escape();
        req.sanitize('correct').trim();
        req.sanitize('correct').escape();

        //验证
        req.checkBody('qname', 'empty').notEmpty();
        req.checkBody('qdesc', 'empty').notEmpty();
        req.checkBody('video', 'empty').notEmpty();
        req.checkBody('video', 'not url').isURL();
        req.checkBody('correct', 'empty').notEmpty();
        var errors = req.validationErrors();
        console.log('err:',errors);

        if (errors) {
            res.status(400).send(JSON.stringify({
                ret: -1,
                msg: errors
            }));
        } else {
            var _data = req.body;
            var _qid = req.params.qid ? req.params.qid : null;
            var _question = {};

            if (_qid) {
                _question = GenQuestionTemplate({
                    qid : _qid,
                    name : _data.qname,
                    desc : _data.qdesc,
                    level : _data.level,
                    type : _data.type,
                    country: _data.country,
                    year: _data.year,
                    video: _data.video,
                    question: _data.question,
                    answers: [_data.correct].concat(_data.answers)
                });
            } else {
                _question = GenQuestionTemplate({
                    name : _data.qname,
                    desc : _data.qdesc,
                    level : _data.level,
                    type : _data.type,
                    country: _data.country,
                    year: _data.year,
                    video: _data.video,
                    question: _data.question,
                    answers: [_data.correct].concat(_data.answers)
                });
            }

            Question.set(_question.qid, _question).then(function done(data){
                // console.log(data);
                Question.indexName.newName(_question);
                res.status(200).send(JSON.stringify({
                    ret: 0
                }));
            }, function err(err){
                res.status(400).send(JSON.stringify({
                    ret: -1,
                    msg: err
                }));
            });//end of Question.set
        }// end of if error

    });
