'use strict';

var express = require('express');
var router = require('./router');
var mysql = require('mysql');
router = new router();
mysql = mysql.createConnection({
    host: 'localhost',
    database: 'db_trackmoney',
    user: 'u_trackmoney',
    password: 'X39MWT22'
});

var app = express();

app.all('*', function(req, res){
    router.route(req, res, mysql);
});

app.listen(3000);

console.log('Server is started!');
