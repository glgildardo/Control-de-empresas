'use strict'

var express = require('express');
var bodyparser = require('body-parser');
var app = express();
var companyRoute = require('./route/company.route'); 
var employeeRoute = require('./route/employee.route');
var productRoute = require('./route/product.route');
var branchOfficeRoute = require('./route/branchoffice.route');

app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());

app.use((req, res, next) =>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

app.use(companyRoute);
app.use(employeeRoute);
app.use(productRoute);
app.use(branchOfficeRoute);

module.exports = app;