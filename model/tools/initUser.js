var Q = require('q');
var path = require('path');
var Lazy = require('lazy.js');
var User = require(path.resolve(global.gpath.app.model + '/common/user'));
var UserTemplate = require(path.resolve(global.gpath.app.model + '/common/user/genUserTemplate'));

var users = [];

//user:1
users.push(UserTemplate({
    uid: 1,
    name: '阿德',
    avatar: 'http://img3.douban.com/icon/ul1015534-35.jpg',
    score: 200,
    times: 1,
    total_times: 1,
    level: 1,
    exp: 200,
    challenge: 9,
    new_tor: 0
}));

//user:2
users.push(UserTemplate({
    uid: 2,
    name: '宋旎',
    avatar: 'http://img4.douban.com/icon/ul1671100-17.jpg',
    score: 150,
    times: 1,
    total_times: 1,
    level: 1,
    exp: 150,
    challenge: 9,
    new_tor: 0
}));

//user:3
users.push(UserTemplate({
    uid: 3,
    name: '熊猫饼饼',
    avatar: 'http://img4.douban.com/icon/ul48880025-28.jpg',
    score: 920,
    times: 3,
    total_times: 3,
    level: 3,
    exp: 2000,
    challenge: 9,
    new_tor: 0,
    playset: [
        {
            pid: '4J8--tAj',
            level: 0
        },
        {
            pid: 'E1lIZ-F0j',
            level: 1
        }
    ]
}));

//user:4
users.push(UserTemplate({
    uid: 4,
    name: '远子',
    avatar: 'http://img3.douban.com/icon/ul14597285-21.jpg',
    score: 560,
    times: 2,
    total_times: 2,
    level: 1,
    exp: 500,
    challenge: 2,
    new_tor: 0
}));

//user:5
users.push(UserTemplate({
    uid: 5,
    name: '铁蛋°Д°',
    avatar: 'http://img4.douban.com/icon/ul38220550-17.jpg'
}));

function initUser(){
    Lazy(users).each(function(user){
        User.set(user.uid, user);
    });
}

module.exports = initUser;
