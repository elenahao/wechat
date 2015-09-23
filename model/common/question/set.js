'use strict';

var Q = require('q');
var Lazy = require('lazy.js');
var _ = require('lodash');
var shortId = require('shortid');
var path = require('path');
var redis = require(path.resolve(global.gpath.app.libs + '/redis'));

/**
 * 添加题目 promise
 * @param {Number} 题目fid
 * @param {Object} 题目内容
 *
 * @return {Boolean} 是否更新成功
 */
function _setQuestion(qid, data) {
    var dfd = Q.defer();

    if (qid == undefined || Lazy(data).isEmpty()) {
        dfd.reject({
            err: 'param error'
        });
    } else {

        var _data = data;

        _.extend(_data, {
            lastModTime: (new Date()).toString(),
            answers: JSON.stringify(_data.answers)
        })

        Q(
            redis.hmset('question:' + qid, _data)
        ).then(function resolve(res) {
            // console.log(res);
            redis.client.expire('allqs', 0);
            dfd.resolve(true);
        }, function reject(err) {
            dfd.reject(err);
        });// end of Q
    } // end of if qid data

    return dfd.promise;
} // end of _setQuestion

module.exports = _setQuestion;
