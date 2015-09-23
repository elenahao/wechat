'use strict';

var Q = require('q');
var client = require("./client");

/**
 * 选择db promise
 * @param {String} Value
 *
 * @return {Object} 选择结果
 */
function select(val) {
    var dfd = Q.defer();

    if (val) {
        client.select(val, function(err) {
            if(!err){
                dfd.resolve({
                    msg: 'success'
                });
            } else {
                dfd.reject(err);
            }
        });
    } else {
        dfd.reject({
            err: 'param error'
        });
    }

    return dfd.promise;
};

module.exports = select;
