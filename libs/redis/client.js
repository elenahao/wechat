'use strict';

var redis = require("ioredis");
//var AppConf = require(path.resolve(global.gpath.app.config + '/config'));
//console.log(AppConf.redis.port);
//console.log(AppConf.redis.server);
//console.log(AppConf.redis.options);
var client = new redis.Cluster([{
        port: 3000,
        host: '127.0.0.1'
    },
    {
        port: 3001,
        host: '127.0.0.1'
    },
    {
        port: 3002,
        host: '127.0.0.1'
    },
    {
        port: 3003,
        host: '192.168.101.25'
    },
    {
        port: 3004,
        host: '192.168.101.25'
    },
    {
        port: 3005,
        host: '192.168.101.25'
    }
]);

module.exports = client;
