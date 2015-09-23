'use strict';

var Q = require('q');
var path = require('path');
var _ = require('lodash');
var Lazy = require('lazy.js');
var redis = require(path.resolve(global.gpath.app.libs + '/redis'));
var allQuestions = require('./all');

function _newName(question) {
    var dfd = Q.defer();

    if (question) {
        redis.smembers('qidx:' + question.name).then(function done(data) {
            if (!Lazy(data).isEmpty()) {
                Lazy(data).each(function(qidx) {
                    var _qidx = JSON.parse(qidx)
                    if (_qidx.qid == question.qid) {
                        redis.rem('qidx:' + question.name, qidx).then(function(data) {
                            redis.sadd('qidx:' + question.name, [JSON.stringify({
                                qid: question.qid,
                                desc: question.desc
                            })]);
                        });
                    }
                });

            }
            dfd.resolve({
                msg: 'index questions by name success'
            });
        });

    } else {
        dfd.reject({
            err: 'param error'
        });
    }

    return dfd.promise;
} // end of _newName

function _delIndex() {
    var dfd = Q.defer();

    allQuestions().then(function done(questions) {
        var q = [];
        Lazy(questions).each(function(question, idx) {
            q.push(redis.client.del('qidx:' + question.name));
        });
        Q.all(q).then(function done(data) {
            dfd.resolve({
                msg: 'del index questions by name success'
            });
        }, function err(err) {
            dfd.reject({
                msg: 'del index questions by name failed',
                err: err
            })
        }); // end of q
    }, function err(err) {
        dfd.reject({
            msg: 'del index questions by name failed',
            err: err
        });
    });

    return dfd.promise;
} // end of _delIndex

function _indexAll() {
    var dfd = Q.defer();
    redis.sadd();
    allQuestions().then(function done(questions) {
        var q = [];
        Lazy(questions).each(function(question, idx) {
            // console.log(idx, question);
            q.push(redis.sadd('qidx:' + question.name, [JSON.stringify({
                qid: question.qid,
                desc: question.desc
            })]));
        });
        Q.all(q).then(function done(data) {
            dfd.resolve({
                msg: 'index questions by name success'
            });
        }, function err(err) {
            dfd.reject({
                msg: 'index questions by name failed',
                err: err
            })
        }); // end of q

    }, function err(err) {
        dfd.reject({
            msg: 'index questions by name failed',
            err: err
        });
    }); // end of get all questions

    return dfd.promise;
} // end of _indexAll

module.exports = {
    newName: _newName,
    indexAll: _indexAll,
    delIndex: _delIndex
}
