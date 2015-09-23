/**
 * Created by elenahao on 15/9/17.
 */

'use strict';
var path = require('path');
var Q = require('q');
var Lazy = require('lazy.js');
var _ = require('lodash');
var Group = require(path.resolve(global.gpath.app.model + '/common/group'));

app.get('/admin/api/search/group/name/:gname',
    function(req, res) {
        var _gname = req.params.gname;
        var _start = !_.isNaN(parseInt(req.query.start)) ? parseInt(req.query.start) : 0;
        var _count = !_.isNaN(parseInt(req.query.count)) ? parseInt(req.query.count) : 20;
        var _end = _start + _count;
        Group.all().then(function done(groups) {
            var _groups = [];
            for(var j = 0; j < groups.length; j++){
                var group = groups[j];
                console.log('-----------group', group);
                if(group.name === _gname){
                    console.log('-----------group.name:', group.name);
                    _groups.push(group);
                }else{
                    continue;
                }
            }
            console.log('length',_groups.length);
            var _pages = Math.ceil(_groups.length / _count);
            console.log('_pages',_pages);
            var _now = Math.floor(_start / _count) + 1;
            console.log('_now:',_now);
            var _gs = [];
            for (var i = _start; i < _end; i++) {
                if (_groups[i]) {
                    _gs.push(_groups[i]);
                } else {
                    break;
                }
            }

            res.status(200).send(JSON.stringify({
                ret: 0,
                data: {
                    groups: _gs,
                    page: _pages,
                    now: _now,
                    start: _start,
                    count: _count
                }
            }));
        }, function none(err) {
            res.status(400).send(JSON.stringify({
                ret: -1,
                msg: 'no resluts'
            }));
        });
    });
