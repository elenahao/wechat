'use strict';

var Q = require('q');
var path = require('path');
var _ = require('lodash');
var Lazy = require('lazy.js');
var redis = require(path.resolve(global.gpath.app.libs + '/redis'));
var getQuestions = require('./gets');

var questions = {};

var _getAllQuestion = function() {
    var dfd = Q.defer();
    redis.get('allqs').then(function done(allqs){
        dfd.resolve(JSON.parse(allqs));
    },function err(err){
        scan().then(function(res){
            var q = [];
            Lazy(res).each(function(value,key){
                q.push(value);
            });
            if(Lazy(q).isEmpty()){
                dfd.resolve([]);
            }
            getQuestions(q).then(function done(qs){
                redis.set('allqs', JSON.stringify(qs));
                redis.client.expire('allqs', 20);
                dfd.resolve(qs);
            },function err(err){
                dfd.reject(err);
            });
        });
    });

    return dfd.promise;
}

function scan() {
    var dfd = Q.defer();
    var cursor = '0';
    questions = {};
    function _scan(){
        redis.client.scan(
            cursor,
            'match', 'question:*',
            'count', '1000',
            function(err, res) {
                cursor = res[0];
                if(res[1].length > 0){
                    Lazy(res[1]).each(function(qid){
                        questions[qid] = qid.split(':')[1];
                    });
                }

                if (cursor == 0) {
                    dfd.resolve(questions);
                } else {
                    _scan();
                }
            }
        );
    }
    _scan();

    return dfd.promise;
}

module.exports = _getAllQuestion;
