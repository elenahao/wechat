/**
 * Created by elenahao on 15/9/6.
 */

'use strict'

var path = require('path');
var Q = require('q');
var request = require('request');
var Lazy = require('lazy.js');
var _ = require('lodash');

var calPage = require(path.resolve(global.gpath.app.libs + '/tools/pagecal'));

var _nav = require(path.resolve(global.gpath.app.model + '/admin/pages/sitenav')).getSiteNav();

_nav.group.isActive = true;

//展示全部组
app.get(['/admin/group'],
    function(req, res, next) {
        console.log("admin group...");

        function render(data) {
            console.log('data='+JSON.stringify(data));
            var _pageLinks = [];
            if (data.page > 1) {
                Lazy(calPage(data.now, data.page, 10)).each(function(value, index) {
                    if (value != '...') {
                        _pageLinks.push({
                            text: value,
                            isCurrent: value == data.now ? true : false,
                            link: '/admin/group/?start=' + (value * data.count - data.count) + '&count=' + data.count
                        });
                    }
                });
            }

            res.render("admin/group", {
                title: "Wechat管理后台",
                adminStaticBase: global.adminStaticBase,
                csrf: res.locals._csrf,
                sitenavs: _nav,//传到页面后，左侧菜单栏根据isActive点亮或变灰
                groups: data.groups,
                pages: _pageLinks
            });
        } // end of render

        var _start = !_.isNaN(parseInt(req.query.start)) ? req.query.start : 0;
        var _count = !_.isNaN(parseInt(req.query.count)) ? req.query.count : 20;

        request({
            url: 'http://127.0.0.1/admin/api/group/?start=' + _start + '&count=' + _count,
            method: 'GET'
        }, function(err, res, body) {
            if (res.statusCode === 200) {
                var _data = JSON.parse(body);
                if (_data.ret == 0) {
                    console.log('rendering ...');
                    render(_data.data);
                }
            }
        });
    });

//指定名称的组
app.get(['/admin/group/name/:gname'],
    function(req, res, next) {
        console.log("admin group byName...");

        function render(data) {
            var _pageLinks = [];
            if (data.page > 1) {
                Lazy(calPage(data.now, data.page, 10)).each(function(value, index) {
                    if (value != '...') {
                        _pageLinks.push({
                            text: value,
                            isCurrent: value == data.now ? true : false,
                            link: '/admin/group/?start=' + (value * data.count - data.count) + '&count=' + data.count
                        });
                    }
                });
            }

            res.render("admin/group", {
                title: "Wechat管理后台",
                adminStaticBase: global.adminStaticBase,
                csrf: res.locals._csrf,
                sitenavs: _nav,
                groups: data.groups,
                pages: _pageLinks,
            });
        } // end of render

        var _gname = req.params.gname ? encodeURIComponent(req.params.gname) : '';
        var _start = !_.isNaN(parseInt(req.query.start)) ? req.query.start : 0;
        var _count = !_.isNaN(parseInt(req.query.count)) ? req.query.count : 20;

        request({
            url: 'http://127.0.0.1/admin/api/search/group/name/' + _gname + '?start=' + _start + '&count=' + _count ,
            method: 'GET'
        }, function(err, _res, body) {
            if (!err && _res.statusCode === 200) {
                var _data = JSON.parse(body);
                if (_data.ret == 0) {
                    render(_data.data);
                }
            } else {
                res.redirect('/admin/group');
            }
        });
    });
