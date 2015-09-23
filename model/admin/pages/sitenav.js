'use strict';

var _nav = function() {
    this.init();
};

_nav.prototype = {
    init: function() {

    },
    getSiteNav: function() {
        return {
            group: {
                id: 1,
                name: '组管理',
                href: '/admin/group'
            },
            user: {
                id: 2,
                name: '用户管理',
                href: '/admin/user'
            },
            area: {
                id: 3,
                name: '区域管理',
                href: '/admin/area'
            }
        }
    }
};

module.exports = new _nav();
