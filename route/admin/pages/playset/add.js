'use strict';
var path = require('path');
var Q = require('q');
var request = require('request');
var Lazy = require('lazy.js');
var _ = require('lodash');

var calPage = require(path.resolve(global.gpath.app.libs + '/tools/pagecal'));
var _nav = require(path.resolve(global.gpath.app.model + '/admin/pages/sitenav')).getSiteNav();

_nav.playset.isActive = true;

app.get(['/admin/playset/edit'],
    function(req, res, next) {
        console.log("admin playset ...");

        res.render("admin/addplayset", {
            title: 'Super8管理后台',
            adminStaticBase: global.adminStaticBase,
            csrf: res.locals._csrf,
            sitenavs: _nav,
        }); // end of res.render
    }); // end of get edit
