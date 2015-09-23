/**
 * Created by elenahao on 15/9/18.
 */

'use strict'

var path = require('path');
var Q = require('q');
var request = require('request');
var Lazy = require('lazy.js');
var _ = require('lodash');

var _nav = require(path.resolve(global.gpath.app.model + '/admin/pages/sitenav')).getSiteNav();

_nav.area.isActive = true;

//展示全部国家；省和市是页面动态ajax请求获取的
app.get(['/admin/area'],
    function(req, res, next) {
        console.log("admin area...");

        function render(data) {
            console.log('data='+JSON.stringify(data));
            res.render("admin/area", {
                title: "Wechat管理后台",
                adminStaticBase: global.adminStaticBase,
                csrf: res.locals._csrf,
                sitenavs: _nav,//传到页面后，左侧菜单栏根据isActive点亮或变灰
                countries: data.countries
            });
        } // end of render

        request({
            url: 'http://127.0.0.1/admin/api/area/',
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
