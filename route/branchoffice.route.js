'use strict'

var branchController = require('../controller/branchoffice.controller');
var authenticated = require("../middleware/authenticated");
var express = require('express');
var api = express.Router();

api.post('/saveBranchOffice', authenticated.ensureAuth, branchController.saveBranchoffice);
api.put('/updateBranchOffice/:id/:idC', authenticated.ensureAuth,branchController.updateBranchoffice);
api.delete('/deleteBranchOffice/:id/:idC', authenticated.ensureAuth,branchController.delteBranchoffice);
api.get('/listBranchOffice/:idC', authenticated.ensureAuth,branchController.ListBranchoffice);
api.get('/listSucursals/:idC', authenticated.ensureAuth, branchController.listSucursals);
module.exports = api;