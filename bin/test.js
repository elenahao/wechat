/**
 * Entry file of this project.
 *
 * 若菩萨有我相、人相、众生相、寿者相，即非菩萨。
 */

'use strict';

//内存GC导出
// var heapdump = require('heapdump');

global.gpath = require('../config/gpath');

//引用express，基础组件
//npm install express --save
//文档地址1：http://www.expressjs.com.cn/4x/api.html#application
global.express = require('express');

//引用cookieParser,express 3之后的版本将很多基础中间件分离了出来，这是用来解析cookies的
//npm install cookie-parser --save
//文档1：https://www.npmjs.com/package/cookie-parser
//TODO:需要写测试，以便版本升级的时候用
global.cookieParser = require('cookie-parser');

//应用body-parser，解析POST请求时使用
//npm install body-parser --save
//https://github.com/expressjs/body-parser
//另外，在express 4当中，app.use(bodyParser()); 写法被抛弃
//http://stackoverflow.com/questions/24330014/bodyparser-is-deprecated-express-4
//TODO:需要写测试，以便版本升级的时候用
global.bodyParser = require('body-parser');

//初始化express组件
global.app = express();
global.session = require('express-session'),
global.lusca = require('lusca');

//这里引用了自定义的logger配置文件
//文档地址1：https://www.npmjs.com/package/log4js
//文档地址2：https://github.com/nomiddlename/log4js-node
// global.logger = require(gpath.app.libs + "/log").logger("server");

//staticBase
// var reversion = "/ba5f19d";
global.staticBase = '';
global.adminStaticBase = '';

//lru缓存
// global.lru = require('./libs/lrucache');

global.fs = require('fs');
global.path = require('path');

//输出 process.pid 方便调试
// fs.writeFileSync(path.join(__dirname, 'app.pid'), process.pid);

global.devMode = true;
global.testMode = true;
if (process.argv[2] == 'remote') {
    global.isRemoteDev = true;
} else {
    global.isRemoteDev = false;
}
global.appVersion = require(gpath.app.config + '/version');
global.goldenGun = require(gpath.app.config + '/goldengun');

app.disable('x-powered-by');

app.use(session({
    secret: goldenGun.sessionKey,
    resave: true,
    saveUninitialized: true
}));

app.use(lusca({
    csrf: true,
    csp: { /* ... */ },
    xframe: 'SAMEORIGIN',
    p3p: 'ABCDEF',
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    },
    xssProtection: true
}));

//开启 gzip 压缩
var compression = require('compression');
process.on('uncaughtException', function(err) {
    console.error('Error caught in uncaughtException event:', err);
});
app.use(compression());

//引用中间件，解析cookies
app.use(cookieParser());

//打开express的代理服务特性
//文档：http://www.expressjs.com.cn/4x/api.html#express
app.enable('trust proxy');

//指定静态文件目录，webpack会有一些问题，所以最好单独指定
//app.use("/css",express.static(path.resolve(__dirname, 'dist/css')));
//app.use("/js" ,express.static(path.resolve(__dirname, 'dist/js')));

//开发时使用 src 目录方便 debug
app.use('/', express.static(gpath.dist.public));

//jade模板组件
//npm install jade --save
//文档地址：https://www.npmjs.com/package/jade
//文档地址2：https://github.com/jadejs/jade
//palyground：http://jade-lang.com/
app.set('view engine', 'jade');

//路由
require('../route');

var urlParse = require('url').parse;
var http = require('http');
var agent = new http.Agent({
    maxSockets: 100000,
    maxKeepAliveRequests: 0,
    maxKeepAliveTime: 240000
});
// 获取请求的 headers，去掉 host 和 connection
var getHeader = function(req) {
    var ret = {};

    for (var i in req.headers) {
        if (!/host|connection/i.test(i)) {
            ret[i] = req.headers[i];
        }
    }
    return ret;
}; //end of getHeader.......................


// 代理请求
// 将请求代理到后端的PHP服务器去，cgi目录以及json静态文件都直接做请求转发
var proxy = function(req, res, next) {
    var urlParsed = urlParse(req.url, true);
    var pathname = urlParsed.pathname;
    var regUri = /^\/cgi|^\/js\/[A-Za-z\d_-]*.json$|^\/data\/|/i;
    // console.log(pathname.match(regUri));
    if (pathname.match(regUri)[0] !== '') {
        var opts = {
            // 测试环境
            // host: '192.168.200.83',
            // port: '9090',
            // 预上线
            host: '119.29.28.15',
            port: '9082',
            path: req.url,
            method: req.method,
            headers: getHeader(req),
            agent: agent
        };

        console.log(' - method ' + req.method);
        console.log(' - proxy ' + req.headers.host + ' to ' + opts.host + (opts.port ? ':' + opts.port : '') + req.url);

        var proxy = http.request(opts, function(response) {
            res.writeHead(response.statusCode, response.headers);
            response.pipe(res, {
                end: true
            });
        });

        req.pipe(proxy, {
            end: true
        });

        proxy.on('error', function(err) {
            res.end(err.stack);
        });
    } else {
        next();
    }
};

// app.use(proxy);

// 404
app.use(function(req, res, next) {
    res.status(404);
    res.send('404');
});

// error handler
app.use(function(err, req, res, next) {
    res.status(500);
    res.send('500' + err);
});

//引用中间件，解析POST请求
//http://stackoverflow.com/questions/24330014/bodyparser-is-deprecated-express-4
//另外，在express 4当中，app.use(bodyParser()); 写法被抛弃
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

module.exports = app;
// require(path.resolve(global.gpath.app.model + '/tools/initUser'))();
// require(path.resolve(global.gpath.app.model + '/tools/initPlayset'))();
