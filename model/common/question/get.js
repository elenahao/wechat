'use strict';

var Q = require('q');
var path = require('path');
var _ = require('lodash');
var redis = require(path.resolve(global.gpath.app.libs + '/redis'));
var UDate = require(path.resolve(global.gpath.app.libs + '/tools/date'));

var _getQuestion = function(qid) {
    var dfd = Q.defer();

    if (qid == undefined) {
        dfd.reject({
            err: 'qid is undefined'
        });
    } else {

        Q(
            redis.hgetall('question:' + qid)
        ).then(function resolve(res) {
            var _question = res;
            var udate = new UDate(new Date(_question.lastModTime));

            if (_question.answers) {
                _.extend(_question, {
                    answers: JSON.parse(_question.answers),
                    lastModTime: udate.getYmd('-') + ' ' + udate.getHms()
                });
            }
            dfd.resolve(_question);
        }, function reject(err) {
            dfd.reject({
                err: 'question not found'
            });
        }); // end of Q
    } // end of if qid

    return dfd.promise;
};

module.exports = _getQuestion;
