'use strict';

var _appConf = {};

if (global.isRemoteDev && global.devMode) {
    //远程开发
    _appConf = {
        redis: {
            server: '192.168.101.24',
            port: 6379,
            options: {

            }
        }
    };
} else if(!global.isRemoteDev && global.devMode){
    //本地开发
    _appConf = {
        redis: {
            server: '127.0.0.1',
            port: 6379,
            options: {

            }
        }
    };
} else {
    //正式环境
    _appConf = {
        redis: {
            server: '127.0.0.1',
            port: 6379,
            options: {

            }
        }
    };
}

if (global.testMode){
    _appConf = {
        redis: {
            server: '127.0.0.1',
            port: 6379,
            options: {

            }
        }
    };
}

module.exports = _appConf;
