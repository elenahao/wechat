'use strict';

var Q = require('q');
var client = require("./client");

/**
 * key是否存在 promise
 * @param {String} Key
 * @param {String} field
 *
 * @return {Object} 是否存在
 */
function exists(key) {
    var dfd = Q.defer();
    console.log('exists');
    if (key) {
        console.log('key');
        client.exists(key, function(err, replay) {
            if(err){
                console.log(err+'--'+replay);
                dfd.reject(err);
            }else{
                console.log('replay');
                dfd.resolve(replay);
            }
        });
    } else {
        console.log('no key');
        dfd.reject({
            err: 'param error'
        });
    }

    return dfd.promise;
}

module.exports = exists;
