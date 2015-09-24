'use strict';

var redis = require("ioredis");
var client = new redis('3003', '192.168.101.25');

module.exports = client;
