'use strict';
var path = require('path');
var _nav = require(path.resolve(global.gpath.app.model + '/test/page/sitenav')).getSiteNav();
var Q = require('q');
var User = require(path.resolve(global.gpath.app.model + '/common/user'));
var request = require('request');

_nav.home.isActive = true;

app.get(['/', '/uid/:uid'],
    function(req, res, next) {
        console.log("home...");

        var _uid = req.params.uid ? req.params.uid : 1;

        function rend(data) {
            res.render("test/home", {
                title: "Super 8",
                staticBase: global.staticBase,
                sitenavs: _nav,
                user: data.user,
                fightHis: data.fightHis
            });
        }

        request({
            url: 'http://127.0.0.1/api/home/uid/' + _uid,
            method: 'GET'
        },function(err, res, body){
            if (res.statusCode === 200) {
                var _data = JSON.parse(body);
                if (_data.ret == 0){
                    rend(_data.data);
                }
            }
        });
    });
