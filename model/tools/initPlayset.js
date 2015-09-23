var Q = require('q');
var path = require('path');
var Lazy = require('lazy.js');
var Playset = require(path.resolve(global.gpath.app.model + '/common/playset'));
var playsetTemplate = require(path.resolve(global.gpath.app.model + '/common/playset/genPlaysetTemplate'));

var playsets = [];

//user:1
playsets.push(playsetTemplate({
    name: '日本激吻',
    coverUrl: 'http://img3.douban.com/view/movie_poster_cover/mpst/public/p2259298553.jpg',
    isRecommended: false,
    questions: [1,2,3,4,7]
}));

//user:2
playsets.push(playsetTemplate({
    name: '星球大战',
    coverUrl: 'http://img3.douban.com/view/movie_poster_cover/lpst/public/p2262649521.jpg',
    isRecommended: false,
    questions: [2,3,5,6,7]
}));

function initPlayset(){
    Lazy(playsets).each(function(playset){
        Playset.set(playset.pid, playset);
    });
}

module.exports = initPlayset;
