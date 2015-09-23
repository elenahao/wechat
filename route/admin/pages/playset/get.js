'use strict';
var path = require('path');
var Q = require('q');
var request = require('request');
var Lazy = require('lazy.js');
var _ = require('lodash');

var calPage = require(path.resolve(global.gpath.app.libs + '/tools/pagecal'));
var _nav = require(path.resolve(global.gpath.app.model + '/admin/pages/sitenav')).getSiteNav();

_nav.playset.isActive = true;

app.get(['/admin/playset'],
    function(req, res, next) {
        console.log("admin playset ...");

        function render(data) {
            var _pageLinks = [];
            if (data.page > 1) {
                Lazy(calPage(data.now, data.page, 10)).each(function(value, index) {
                    if (value != '...') {
                        _pageLinks.push({
                            text: value,
                            isCurrent: value == data.now ? true : false,
                            link: '/admin/playset/?start=' + (value * data.count - data.count) + '&count=' + data.count
                        });
                    }
                });
            }

            res.render("admin/playset", {
                title: "Super8管理后台",
                adminStaticBase: global.adminStaticBase,
                csrf: res.locals._csrf,
                sitenavs: _nav,
                pages: _pageLinks,
                playsets: data.playsets
            });
        }

        var _start = !_.isNaN(parseInt(req.query.start)) ? req.query.start : 0;
        var _count = !_.isNaN(parseInt(req.query.count)) ? req.query.count : 20;

        request({
            url: 'http://127.0.0.1/admin/api/playset/?start=' + _start + '&count=' + _count,
            method: 'GET'
        }, function(err, res, body) {
            if (res.statusCode === 200) {
                var _data = JSON.parse(body);
                if (_data.ret == 0) {
                    render(_data.data);
                }
            }
        });
    });
