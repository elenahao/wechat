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
global.expressValidator = require('express-validator')
global.multer = require('multer');

//初始化express组件
global.app = express();
global.session = require('express-session'),
global.lusca = require('lusca');

//这里引用了自定义的logger配置文件
//文档地址1：https://www.npmjs.com/package/log4js
//文档地址2：https://github.com/nomiddlename/log4js-node
global.logger = require(gpath.app.libs + "/log").logger("server");

//staticBase
// var reversion = "/ba5f19d";
global.staticBase = '';
global.adminStaticBase = '';

//lru缓存
// global.lru = require('./libs/lrucache');

global.fs = require('fs');
global.path = require('path');

//输出 process.pid 方便调试
fs.writeFileSync(path.join(__dirname, 'app.pid'), process.pid);

global.devMode = true;
console.log(process.pid);
console.log(process.argv);
process.argv[2] = 'remote';
console.log(process.argv[2]);

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
console.log('--------'+path.join(path.normalize(path.join(__dirname, '..')), 'views'));
console.log(__dirname);
console.log(__filename);
app.set('views', path.join(path.normalize(path.join(__dirname, '..')), 'views'));
app.set('view engine', 'jade');

//引用中间件，解析POST请求
//http://stackoverflow.com/questions/24330014/bodyparser-is-deprecated-express-4
//另外，在express 4当中，app.use(bodyParser()); 写法被抛弃
app.use(bodyParser.json());
app.use(expressValidator({
    customValidators: {
    }
}));
app.use(bodyParser.urlencoded({
    extended: true
}));

var redisToken = require('../RedisToken');
app.use(redisToken({
    protectUrlArr:['/api']}));

//路由
require('../route');

var oauth = require('../route/oauth/auth');
app.use('/oauth', oauth);

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

var server = app.listen(8181, function() {
    console.log('Listening on port %d', server.address().port);
});


// require(path.resolve(global.gpath.app.model + '/tools/initUser'))();
// require(path.resolve(global.gpath.app.model + '/tools/initPlayset'))();
