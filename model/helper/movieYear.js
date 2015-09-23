'use strict';
var Lazy = require('lazy.js');

var _years = [];
for(var i = 1980; i < (new Date).getFullYear() + 3; i++){
    _years.push(i);
}

function _getAllYear(){
    return _years;
}

module.exports = {
    getAll: _getAllYear
}
