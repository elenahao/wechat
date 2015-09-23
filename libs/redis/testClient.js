'use strict';

var redis = require("redis");
var AppConf = require(path.resolve(global.gpath.app.config + '/config'));
var client = redis.createClient(AppConf.redis.port, AppConf.redis.server, AppConf.redis.options);

module.exports = client;
