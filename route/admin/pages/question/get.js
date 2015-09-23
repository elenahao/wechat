'use strict';
var path = require('path');
var Q = require('q');
var request = require('request');
var Lazy = require('lazy.js');
var _ = require('lodash');

var MovieType = require(path.resolve(global.gpath.app.model + '/helper/movieType'));
var MovieYear = require(path.resolve(global.gpath.app.model + '/helper/movieYear'));
var QuestionLevel = require(path.resolve(global.gpath.app.model + '/helper/qLevel'));
var calPage = require(path.resolve(global.gpath.app.libs + '/tools/pagecal'));

var _nav = require(path.resolve(global.gpath.app.model + '/admin/pages/sitenav')).getSiteNav();

_nav.question.isActive = true;

//展示全部题目
app.get(['/admin/question'],
    function(req, res, next) {
        console.log("admin question...");

        function render(data) {
            var _pageLinks = [];
            if (data.page > 1) {
                Lazy(calPage(data.now, data.page, 10)).each(function(value, index) {
                    if (value != '...') {
                        _pageLinks.push({
                            text: value,
                            isCurrent: value == data.now ? true : false,
                            link: '/admin/question/?start=' + (value * data.count - data.count) + '&count=' + data.count
                        });
                    }
                });
            }

            res.render("admin/question", {
                title: "Super8管理后台",
                adminStaticBase: global.adminStaticBase,
                // csrf: req.session._csrfSecret,
                csrf: res.locals._csrf,
                sitenavs: _nav,
                questions: data.questions,
                pages: _pageLinks,
                movieType: MovieType.getAll(),
                levels: QuestionLevel.getAll()
            });
        } // end of render

        var _start = !_.isNaN(parseInt(req.query.start)) ? req.query.start : 0;
        var _count = !_.isNaN(parseInt(req.query.count)) ? req.query.count : 20;

        request({
            url: 'http://127.0.0.1:8181/admin/api/question/?start=' + _start + '&count=' + _count,
            method: 'GET'
        }, function(err, res, body) {
            //console.log(res);
            if (res.statusCode === 200) {
                var _data = JSON.parse(body);
                if (_data.ret == 0) {
                    render(_data.data);
                }
            }
        });
    });

//展示指定影片名称下的题目
app.get(['/admin/question/name/:qname'],
    function(req, res, next) {
        console.log("admin question...");

        function render(data) {
            var _pageLinks = [];
            if (data.page > 1) {
                Lazy(calPage(data.now, data.page, 10)).each(function(value, index) {
                    if (value != '...') {
                        _pageLinks.push({
                            text: value,
                            isCurrent: value == data.now ? true : false,
                            link: '/admin/question/?start=' + (value * data.count - data.count) + '&count=' + data.count
                        });
                    }
                });
            }

            res.render("admin/question", {
                title: "Super8管理后台",
                adminStaticBase: global.adminStaticBase,
                // csrf: req.session._csrfSecret,
                csrf: res.locals._csrf,
                sitenavs: _nav,
                questions: data.questions,
                pages: _pageLinks,
                movieType: MovieType.getAll(),
                levels: QuestionLevel.getAll()
            });
        } // end of render

        var _qname = req.params.qname ? encodeURIComponent(req.params.qname) : '';
        var _start = !_.isNaN(parseInt(req.query.start)) ? req.query.start : 0;
        var _count = !_.isNaN(parseInt(req.query.count)) ? req.query.count : 20;

        request({
            url: 'http://127.0.0.1:8181/admin/api/search/question/name/' + _qname + '?detail=1&start=' + _start + '&count=' + _count ,
            method: 'GET'
        }, function(err, _res, body) {
            if (!err && _res.statusCode === 200) {
                var _data = JSON.parse(body);
                if (_data.ret == 0) {
                    render(_data.data);
                }
            } else {
                res.redirect('/admin/question');
            }
        });
    });
