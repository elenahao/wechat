'use strict';
var path = require('path');
var Q = require('q');
var request = require('request');
var Lazy = require('lazy.js');
var _ = require('lodash');

var MovieType = require(path.resolve(global.gpath.app.model + '/helper/movieType'));
var MovieYear = require(path.resolve(global.gpath.app.model + '/helper/movieYear'));
var QuestionLevel = require(path.resolve(global.gpath.app.model + '/helper/qLevel'));

var _nav = require(path.resolve(global.gpath.app.model + '/admin/pages/sitenav')).getSiteNav();

_nav.question.isActive = true;

app.get(['/admin/question/edit/'],
    function(req, res, next) {
        console.log("admin question add ...");

        res.render("admin/addquestion", {
            title: 'Super8管理后台',
            adminStaticBase: global.adminStaticBase,
            csrf: res.locals._csrf,
            sitenavs: _nav,
            movieType: MovieType.getAll(),
            movieYear: MovieYear.getAll(),
            levels: QuestionLevel.getAll()
        }); // end of res.render
    }); // end of get

app.get(['/admin/question/edit/:qid'],
    function(req, res, next) {
        console.log("admin question edit ...");
        var _qid = req.params.qid ? req.params.qid : null;

        if (_qid) {
            request({
                url: 'http://127.0.0.1:8181/admin/api/question/' + _qid,
                method: 'GET'
            }, function(err, _res, body) {
                if (_res.statusCode == 200) {
                    var _data = JSON.parse(body);
                    console.log(_data.data);
                    if (_data.ret == 0) {
                        res.render("admin/addquestion", {
                            title: 'Super8管理后台',
                            adminStaticBase: global.adminStaticBase,
                            csrf: res.locals._csrf,
                            sitenavs: _nav,
                            movieType: MovieType.getAll(),
                            movieYear: MovieYear.getAll(),
                            levels: QuestionLevel.getAll(),
                            question: _data.data
                        });
                    } else {
                        res.redirect('/admin/question');
                    } // end of if _data.ret
                }// end of if _res.statusCode_
            }); // end of request
        } else {
            res.redirect('/admin/question');
        }// end of if _qid

    }); // end of get
