'use strict';

var express = require('express');
var router = require('./router');
var mysql = require('mysql');
router = new router();
mysql = mysql.createConnection({
    host: 'localhost',
    database: 'db_money',
    user: 'u_money',
    password: 'ZUx1WZjP'
});

var app = express();

app.all('*', function(req, res){
    router.route(req, res, mysql);
});

app.listen(3000);

console.log('Server is started!');
