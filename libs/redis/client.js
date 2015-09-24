'use strict';

var Redis = require("ioredis");
var AppConf = require(path.resolve(global.gpath.app.config + '/config'));
console.log(AppConf.redis.port);
console.log(AppConf.redis.server);
console.log(AppConf.redis.options);
var client = new Redis(AppConf.redis.port, AppConf.redis.server, AppConf.redis.options);

module.exports = client;
