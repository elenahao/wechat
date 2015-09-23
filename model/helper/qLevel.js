'use strict';
var Lazy = require('lazy.js');

var _level = {
    0: '简单',
    1: '普通',
    2: '困难'
}

var _allLevel = [];
Lazy(_level).each(function(value, key){
    _allLevel.push({
        id: key,
        name: value
    });
});

function _getLevel(levelNo){
    if(_level[levelNo]){
        return {
            id: levelNo,
            name: _level[levelNo]
        };
    } else {
        return null;
    }
}

function _getAllLevel(){
    return _allLevel;
}

module.exports = {
    getLevel: _getLevel,
    getAll: _getAllLevel
}
