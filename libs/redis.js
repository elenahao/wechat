'use strict';

var _redis = {
    client: require('./redis/client'),
    set: require('./redis/set'),
    get: require('./redis/get'),
    hmset: require('./redis/hmset'),
    hgetall: require('./redis/hgetall'),
    hget: require('./redis/hget'),
    hdel: require('./redis/hdel'),
    zadd: require('./redis/zadd'),
    sadd: require('./redis/sadd'),
    smembers: require('./redis/smembers'),
    srem: require('./redis/srem'),
    select : require('./redis/select'),
    hexists : require('./redis/hexists'),
    expire : require('./redis/expire'),
    zrevrange : require('./redis/zrevrange'),
    exists : require('./redis/exists'),
    del: require('./redis/del'),
    lrange: require('./redis/lrange'),
    client0: require('./redis/client0'),
    client1: require('./redis/client1'),
    client2: require('./redis/client2')
}

if (global.devMode) {
    _redis.testClient = require('./redis/client');
}

module.exports = _redis
