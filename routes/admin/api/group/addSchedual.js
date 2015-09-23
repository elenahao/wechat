/**
 * Created by elenahao on 15/9/9.
 */

'use strict';
var path = require('path');
var Q = require('q');
var Lazy = require('lazy.js');
var _ = require('lodash');
var request = require('request');
var redis = require(path.resolve(global.gpath.app.libs + '/redis'));

app.post(['/admin/api/group/addSchedual'],
    function(req, res, next){
        console.log('admin api group addSchedual ... ');
        console.log('su='+req.body.su);
        console.log('gid='+req.body.gid);
        req.sanitize('su').trim();
        req.sanitize('su').escape();
        req.sanitize('gid').trim();
        req.sanitize('gid').escape();
        //验证
        req.checkBody('su', 'empty').notEmpty();
        req.checkBody('gid', 'empty').notEmpty().isInt();
        var errors = req.validationErrors();
        console.log('err:',errors);

        if (errors) {
            res.status(400).send(JSON.stringify({
                ret: -1,
                msg: errors
            }));
        } else {
            var _su = req.body.su;
            var _gid = req.body.gid;
            var options = {
                schedual_user: _su
            }
            var dic = new Array('country', 'province', 'city', 'sex', 'subscribe');
            var obj = {};
            var array = new Array();
            array = _gquarz.split(':')[1].split('#');
            for(var i = 0; i < array.length; i++){
                if(array[i] === '*'){
                    continue;
                }else{
                    if(dic[i] === 'subscribe'){//如果是关注日期的选项，需要进行换算成毫秒再存储，便于后面比较计算
                        var subscribe_start = array[i].split('~')[0];
                        var subscribe_end = array[i].split('~')[1];
                        subscribe_start = subscribe_start.replace(new RegExp('-','gm'),'/');
                        subscribe_end = subscribe_end.replace(new RegExp('-','gm'),'/');
                        var start = (new Date(subscribe_start)).getTime();
                        var end = (new Date(subscribe_end)).getTime();
                        obj['subscribe_start'] = subscribe_start;
                        obj['subscribe_end'] = subscribe_end;
                    }else{
                        obj[dic[i]] = array[i];
                    }
                }
            }
            if (_su && _gid) {
                redis.hmset('group:'+_gid, options)
                    .then(function resolve(res){
                        console.log('is hmset ok:', res);
                        return redis.hmset('schedual_user:'+_gid, obj);
                    }, function reject(err){
                        res.status(400).send(JSON.stringify({
                            ret: -1,
                            msg: err
                        }));
                    })
                    .then(function resolve(res){
                        console.log('is hmset ok:', res);
                    },function reject(err){
                        res.status(400).send(JSON.stringify({
                            ret: -1,
                            msg: err
                        }));
                    })
            } else {
                res.status(400).send(JSON.stringify({
                    ret: -1
                }));
            }
        }
        res.redirect('/admin/group');
    });

