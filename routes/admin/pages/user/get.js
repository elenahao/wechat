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

_nav.user.isActive = true;

//展示全部用户
app.get(['/admin/user'],
    function(req, res, next) {
        console.log("admin user...");

        function render(data) {
            console.log('data='+JSON.stringify(data));
            var _pageLinks = [];
            if (data.page > 1) {
                Lazy(calPage(data.now, data.page, 10)).each(function(value, index) {
                    if (value != '...') {
                        _pageLinks.push({
                            text: value,
                            isCurrent: value == data.now ? true : false,
                            link: '/admin/user/?start=' + (value * data.count - data.count) + '&count=' + data.count
                        });
                    }
                });
            }

            res.render("admin/user", {
                title: "Wechat管理后台",
                adminStaticBase: global.adminStaticBase,
                csrf: res.locals._csrf,
                sitenavs: _nav,//传到页面后，左侧菜单栏根据isActive点亮或变灰
                users: data.users,
                groups: data.groups,
                pages: _pageLinks
            });
        } // end of render

        var _start = !_.isNaN(parseInt(req.query.start)) ? req.query.start : 0;
        var _count = !_.isNaN(parseInt(req.query.count)) ? req.query.count : 20;

        request({
            url: 'http://127.0.0.1/admin/api/user/?start=' + _start + '&count=' + _count,
            method: 'GET'
        }, function(err, res, body) {
            console.log(body);
            if (res.statusCode === 200) {
                var _data = JSON.parse(body);
                if (_data.ret == 0) {
                    //获取组信息
                    console.log('rendering ...');
                    render(_data.data);
                }
            }
        });
    });

//指定昵称的用户
app.get(['/admin/user/name/:uname'],
    function(req, res, next) {
        console.log("admin user byName...");

        function render(data) {
            var _pageLinks = [];
            if (data.page > 1) {
                Lazy(calPage(data.now, data.page, 10)).each(function(value, index) {
                    if (value != '...') {
                        _pageLinks.push({
                            text: value,
                            isCurrent: value == data.now ? true : false,
                            link: '/admin/user/?start=' + (value * data.count - data.count) + '&count=' + data.count
                        });
                    }
                });
            }

            res.render("admin/user", {
                title: "Wechat管理后台",
                adminStaticBase: global.adminStaticBase,
                csrf: res.locals._csrf,
                sitenavs: _nav,
                users: data.users,
                groups: data.groups,
                pages: _pageLinks,
            });
        } // end of render

        var _uname = req.params.uname ? encodeURIComponent(req.params.uname) : '';
        var _start = !_.isNaN(parseInt(req.query.start)) ? req.query.start : 0;
        var _count = !_.isNaN(parseInt(req.query.count)) ? req.query.count : 20;

        request({
            url: 'http://127.0.0.1/admin/api/search/user/name/' + _uname + '?start=' + _start + '&count=' + _count ,
            method: 'GET'
        }, function(err, _res, body) {
            if (!err && _res.statusCode === 200) {
                var _data = JSON.parse(body);
                if (_data.ret == 0) {
                    render(_data.data);
                }
            } else {
                res.redirect('/admin/user');
            }
        });
    });
