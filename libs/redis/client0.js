'use strict';

var redis = require("ioredis");
var client = new redis('3000', '192.168.101.24');

module.exports = client;
