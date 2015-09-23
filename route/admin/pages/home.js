'use strict';
var path = require('path');
var Q = require('q');
var request = require('request');

app.get(['/admin'],
    function(req, res, next) {
        console.log("admin home...");
        res.redirect('/admin/question');
    });
