'use strict';

var Q = require('q');
var client = require("./client");

/**
 * 删除Hash promise
 * @param {String} Key
 *
 * @return {String} Value
 */
function hdel(hash, key) {
    var dfd = Q.defer();

    // console.log(hash,client.hdel);

    client.hdel(hash, 'fid', function(res){
        console.log(res);
    });

    dfd.resolve();
    // if (hash && key) {
    //     client.hget(hash, key, function(err, replay) {
    //         if (replay) {
    //             dfd.resolve(replay);
    //         } else {
    //             dfd.reject(err);
    //         }
    //     }); //end of client.get
    // } else if (hash && !key) {
    //
    // } else {
    //     dfd.reject({
    //         err: 'key is undefined'
    //     });
    // }

    return dfd.promise;
};

module.exports = hdel;
