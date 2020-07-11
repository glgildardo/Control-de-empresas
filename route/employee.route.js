'use strict'

var employeeController = require('../controller/employee.controller');
var authenticated = require("../middleware/authenticated");
var express = require('express');
var api = express.Router();

api.post('/saveEmployee/:idC', authenticated.ensureAuth,employeeController.saveEmployee);
api.put('/updateEmployee/:id/:idC', authenticated.ensureAuth,employeeController.updateEmployee);
api.delete('/deleteEmployee/:idB/:idE', authenticated.ensureAuth,employeeController.deleteEmployee);
api.get('/searchemployees/:idC', authenticated.ensureAuth,employeeController.searchEmployee);
module.exports = api;