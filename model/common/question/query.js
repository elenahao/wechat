'use strict';

var Q = require('q');
var path = require('path');
var _ = require('lodash');
var Lazy = require('lazy.js');
var redis = require(path.resolve(global.gpath.app.libs + '/redis'));
var getQuestions = require('./gets');
var allQuestions = require('./all');

function _byName(qname, needDetail){
    var dfd = Q.defer();

    redis.smembers('qidx:'+ qname).then(function done(data){
        if (!Lazy(data).isEmpty()) {

            var _data = [];
            var _qids = [];
            Lazy(data).each(function(qidx){
                var _qidx = JSON.parse(qidx)
                _data.push(_qidx);
                _qids.push(_qidx.qid);
            });
            if ( !needDetail) {
                dfd.resolve(_data);
            } else {
                getQuestions(_qids).then(function done(questions){
                    dfd.resolve(questions);
                },function err(err){
                    dfd.reject(err);
                });
            }

        } else {
            dfd.reject({
                msg: 'no ' + qname + ' been found'
            })
        }
    }, function none(err){
        dfd.reject(err);
    });

    return dfd.promise;
}

module.exports = {
    name: _byName
}
