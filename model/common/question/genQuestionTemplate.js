'use strict';

var _ = require('lodash');
var shortId = require('shortid');

/**
 * 生成新题目数据模板
 * @param {Object} 题目信息
 *
 * @return {Object} 题目信息模板
 */
function _genQuestionTemplate(config) {
    var _question = {
        qid: shortId.generate(),
        lastModTime: (new Date()).toString(),
        name: '',
        desc: '',
        level: 0,
        type: [],
        country: '',
        year: 2014,
        video: '',
        question: '',
        answers: []
    }
    _.extend(_question, config);
    return _question;
} // end of _genQuestionTemplate

module.exports = _genQuestionTemplate
