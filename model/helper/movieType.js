'use strict';
var Lazy = require('lazy.js');

var _types = {
    0: '爱情', 1: '喜剧', 2: '动画', 3: '科幻', 4: '剧情',
    5: '动作', 6: '经典', 7: '悬疑', 8: '青春', 9: '犯罪',
    10: '惊悚', 11: '文艺', 12: '纪录片', 13: '励志', 14: '搞笑',
    15: '恐怖', 16: '战争', 17: '短片', 18: '魔幻', 19: '黑色幽默',
    20: '传记', 21: '情色', 22: '动画短片', 23: '感人', 24: '暴力',
    25: '音乐', 26: '童年', 27: '家庭', 28: '黑帮', 29: '女性',
    30: '浪漫', 31: '同志', 32: '史诗', 33: '童话', 34: '烂片',
    35: 'cult'
}

var _allTypes = [];
Lazy(_types).each(function(value, key){
    _allTypes.push({
        id: key,
        name: value
    });
});

function _getMovieType(typeNo){
    if(_types[typeNo]){
        return {
            id: typeNo,
            name: _types[typeNo]
        };
    } else {
        return null;
    }
}

function _getAllType(){
    return _allTypes;
}

module.exports = {
    getType: _getMovieType,
    getAll: _getAllType
}
