/**
 * Created by elenahao on 15/9/18.
 */
'use strict';
var path = require('path');
var Q = require('q');
var Lazy = require('lazy.js');
var _ = require('lodash');
var Area = require(path.resolve(global.gpath.app.model + '/common/area'));

//获取一级菜单国家
app.get('/admin/api/area',
    function(req, res) {
        console.log('/admin/api/area...');

        Area.allCountries().then(function done(countries) {
            console.log('countries='+countries);
            var _cs = [];
            for (var i = 0; i < countries.length; i++) {
                if (countries[i]) {
                    var country = countries[i];
                    var _id = country.split(':')[0];
                    var _name = country.split(':')[1];
                    _cs.push({id: _id, name:_name});
                } else {
                    break;
                }
            }
            res.status(200).send(JSON.stringify({
                ret: 0,
                data: {
                    countries: _cs
                }
            }));
        }, function err(err) {
            res.status(400).send(JSON.stringify({
                ret: -1,
                msg: err
            }));
        });
    });