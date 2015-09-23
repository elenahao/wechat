/**
 * Created by elenahao on 15/9/14.
 */

/*
设置定时规则，存入redis中
 */
var path = require('path');
var Q = require('q');
var Lazy = require('lazy.js');
var _ = require('lodash');
var request = require('request');
var redis = require(path.resolve(global.gpath.app.libs + '/redis'));

app.get('/admin/api/user/setRule',
    function(req, res, next){
        var dfd = Q.defer();
        console.log('admin api user-set-rule ... ');
        var to_groupid = req.query.to_groupid;
        var category = req.query.category;
        var category_value = req.query.category_value;

        if(to_groupid && category && category_value){
            var key = 'schedual-user:'+category+'-'+category_value;
            var options = {
                category : category,
                category_value : category_value,
                to_groupid : to_groupid
            }
            redis.hmset(key, options)
                .then(function resolve(res){
                    console.log('is hmset ok:', res);
                    dfd.resolve(res);
                }, function reject(err){
                    dfd.reject(err);
                })
            res.redirect('/admin/user');
        }else{
            res.status(400).send(JSON.stringify({
                ret: -1
            }));
        }
    });

