'use strict';

var Q = require('q');
var path = require('path');
var Lazy = require('lazy.js');
var _ = require('lodash');
var redis = require(path.resolve(global.gpath.app.libs + '/redis'));

var _getQuestion = require('./get');

/**
 * 获取多个对战记录 promise
 * @param {Array} 对战fid数组
 *
 * @return {Array} 对战记录
 */
function _getQuestions(qids) {
    var dfd = Q.defer();
    if (Lazy(qids).isEmpty()) {
        dfd.reject({
            err: 'qids is empty'
        });
    } else {
        var queue = [];

        Lazy(qids).each(function(qid) {
            queue.push(_getQuestion(qid));
        });

        Q.all(
            queue
        ).then(function resolve(res) {
            if (!Lazy(res).isEmpty()) {
                dfd.resolve(res);
            } else {
                dfd.reject({
                    err: 'questions not found'
                });
            }
        }, function reject(err){
            dfd.reject({
                err: err
            });
        }); // end of Q
    } // end of if qids

    return dfd.promise
} // end of _getQuestions

module.exports = _getQuestions;
