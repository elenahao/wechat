/**
 * Created by elenahao on 15/9/8.
 */

'use strict';

var Q = require('q');
var path = require('path');
var _ = require('lodash');
var request = require('request');
var redis = require(path.resolve(global.gpath.app.libs + '/redis'));
var APPID = global.weconfig.apptest.APPID;
var APPSECRET = global.weconfig.apptest.SECRET;
var EXPIRETIME = 60 * 60 * 2 - 60;//差一分钟两小时

console.log(APPID);
console.log(APPSECRET);

var _getAccessToken = function() {
    var dfd = Q.defer();

   redis.exists('access_token')
       .then(function resolve(res) {
           console.log('res'+res);
           console.log('is exists ok:', res);
           if(res == '1'){
                console.log(1);
               //如果存在access_token, 那么就get出来返回给上一层
               redis.get('access_token')
                   .then(function resolve(res) {
                       console.log('is get ok:', res);
                       dfd.resolve({access_token : res});
                   }, function reject(err) {
                       console.log('error:access_token is existed but cannot get, please request once again');
                       dfd.reject(err);
                   })
           }else{
               console.log(0);
               //console.log('is exists ok:', err);
               //请求生成一个access_token 并存在redis中，设置过期时间为2小时
               var ACCESS_TOKEN = '';
                console.log('request')
               request({
                   url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='+APPID+'&secret='+APPSECRET,
                   method: 'GET'
               }, function(err, res, body) {
                   //console.log('is request get ok:', res);
                   if (res.statusCode === 200) {
                       var _data = JSON.parse(body);
                       ACCESS_TOKEN = _data.access_token;
                       console.log('access_token='+ACCESS_TOKEN);
                       redis.set('access_token', ACCESS_TOKEN)
                           .then(function resolve(res) {
                               console.log('is redis set ok:', res);
                               return redis.expire('access_token', EXPIRETIME);
                           }, function reject(err) {
                               dfd.reject(err);
                           })
                           .then(function resolve(res) {
                               console.log('is redis expire ok:', res);
                               dfd.resolve({'access_token': ACCESS_TOKEN});
                           }, function reject(err) {
                               dfd.reject(err);
                           });
                   }else{
                       dfd.reject(res);
                   }
               });
           }
        }, function reject(err) {
           dfd.reject(err);
        });

    return dfd.promise;
};

module.exports = _getAccessToken;
