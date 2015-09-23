'use strict';
var path = require('path');
var _nav = require(path.resolve(global.gpath.app.model + '/test/page/sitenav')).getSiteNav();

_nav.rank.isActive = true;

app.get(['/rank'],
    function(req, res, next) {
        console.log("rank...");
        res.render("test/rank", {
            title  : "Super 8",
            staticBase: global.staticBase,
            sitenavs: _nav
        });
    });
