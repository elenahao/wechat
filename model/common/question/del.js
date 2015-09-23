'use strict';

var Q = require('q');
var path = require('path');
var _ = require('lodash');
var redis = require(path.resolve(global.gpath.app.libs + '/redis'));

var _delQuestion = function(qid) {
    var dfd = Q.defer();

    if (qid == undefined) {
        dfd.reject({
            err: 'qid is undefined'
        });
    } else {

        Q(
            redis.client.del('question:' + qid)
        ).then(function resolve(res) {
            redis.client.del('allqs');
            dfd.resolve({});
        }, function reject(err) {
            dfd.reject({
                err: 'question not found'
            });
        }); // end of Q
    } // end of if qid

    return dfd.promise;
};

module.exports = _delQuestion;
