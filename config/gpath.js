/**
 * Created by Qu Yizhi on 2015/08/03.
 */

'use strict';

var path = require('path');

var _app = {
    root: path.resolve(__dirname, '../'),
    libs: path.resolve(__dirname, '../libs'),
    route: path.resolve(__dirname, '../route'),
    config: path.resolve(__dirname, '../config'),
    logs: path.resolve(__dirname, '../logs'),
    model: path.resolve(__dirname, '../model')
}

var _src = {
    root: path.resolve(__dirname, '../public')
};

var _dist = {
    public: path.resolve(__dirname, '../public'),
    path: path.resolve(__dirname, '../public/dist')
};

var config = {
    src: _src,
    dist: _dist,
    app: _app
};

module.exports = config;
