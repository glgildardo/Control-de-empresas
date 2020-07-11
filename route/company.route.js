'use strict'

var express = require('express');

var companyController = require('../controller/company.controller');
var authenticated = require('../middleware/authenticated');
var api = express.Router();

api.post('/saveCompany', companyController.saveCompany);
api.put('/updateCompany/:id', authenticated.ensureAuth,companyController.updateCompany);
api.delete('/deleteCompany/:id', authenticated.ensureAuth,companyController.deleteCompany);
api.get('/searchCompanys', companyController.searchCompanys);
api.get('/listEmployees/:id', authenticated.ensureAuth,companyController.listEmployees);

// Login de la empresa
api.put('/logincompany', companyController.login); 
module.exports = api;