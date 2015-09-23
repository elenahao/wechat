/**
 * Created by elenahao on 15/9/21.
 */
'use strict';
var path = require('path');
var Q = require('q');
var Lazy = require('lazy.js');
var _ = require('lodash');
var request = require('request');
var Area = require(path.resolve(global.gpath.app.model + '/common/area'));

//获取二级省份菜单
app.post('/admin/api/area/getProvinces',
    function(req, res) {
        console.log('/admin/api/area/getProvinces...');
        console.log(req.body.country);
        req.sanitize('country').trim();
        req.sanitize('country').escape();
        req.checkBody('country', 'empty').notEmpty();
        var errors = req.validationErrors();
        console.log('err:',errors);
        if (errors) {
            res.status(400).send(JSON.stringify({
                ret: -1,
                msg: errors
            }));
        } else {
            var country = req.body.country;
            console.log('country=',country);
            Area.getProvinces(country).then(function done(provinces) {
                console.log('provinces='+provinces);
                var _ps = [];
                for (var i = 0; i < provinces.length; i++) {
                    if (provinces[i]) {
                        var province = provinces[i];
                        var _id = province.split(':')[0];
                        console.log(_id);
                        var _name = province.split(':')[1];
                        console.log(_name);
                        _ps.push({id: _id, name:_name});
                    } else {
                        break;
                    }
                }
                res.status(200).send(JSON.stringify({
                    ret: 0,
                    data: _ps
                }));
            }, function err(err) {
                res.status(400).send(JSON.stringify({
                    ret: -1,
                    msg: err
                }));
            });
        }
    });