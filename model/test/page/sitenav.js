'use strict';

var _nav = function() {
    this.init();
};

_nav.prototype = {
    init: function() {

    },
    getSiteNav: function() {
        return {
            home: {
                id: 0,
                name: '首页',
                href: '/'
            },
            rank: {
                id: 2,
                name: '排行榜',
                href: '/rank'
            }
            // mine: {
            //     id: 3,
            //     name: '我的',
            //     href: '/mine'
            // }
        }
    }
};

module.exports = new _nav();
