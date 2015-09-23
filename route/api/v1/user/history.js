'use strict';
var path = require('path');
var Q = require('q');
var Lazy = require('lazy.js');
var _ = require('lodash');
var FHistory = require(path.resolve(global.gpath.app.model + '/common/history'));

app.get(['/api/user/history/:uid'],
    function(req, res, next) {
        var _uid = parseInt(req.params.uid) == req.params.uid ? parseInt(req.params.uid) : NaN;
        if (!_.isNaN(_uid)) {
            FHistory.get(_uid).then(function resolve(history) {
                var _data = {
                    ret: 0,
                    data: {
                        history: history
                    }
                }
                res.status(200).send(JSON.stringify(_data));
            }, function reject(err) {
                res.status(400).send(JSON.stringify({
                    ret: -1,
                    err: err
                }));
            });
        } else {
            res.status(400).send(JSON.stringify({
                ret: -1,
                err: 'param error'
            }));
        }
    });
