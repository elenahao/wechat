/*
current，当前页码，计算出来的页码尽可能将这个页码放到中间。
length，页码的长度，总共有多少个页码。
displayLength，要显示多少个页码，包括固定的第一个和最后一个。
 */

'use strict';
var calculateIndexes = function(current, length, displayLength) {
    displayLength = displayLength - 2;
    var indexes = [1];
    var start = Math.round(current - displayLength / 2);
    var end = Math.round(current + displayLength / 2);
    if (start <= 1) {
        start = 2;
        end = start + displayLength - 1;
        if (end >= length - 1) {
            end = length - 1;
        }
    }
    if (end >= length - 1) {
        end = length - 1;
        start = end - displayLength + 1;
        if (start <= 1) {
            start = 2;
        }
    }
    if (start !== 2) {
        indexes.push("...");
    }
    for (var i = start; i <= end; i++) {
        indexes.push(i);
    }
    if (end !== length - 1) {
        indexes.push("...");
    }
    indexes.push(length);
    return indexes;
};

module.exports = calculateIndexes;
