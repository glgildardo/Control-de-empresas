'use strict'

var productController = require('../controller/product.controller');
var authenticated = require("../middleware/authenticated");
var express = require('express');
var api = express.Router();

api.post('/saveProduct', authenticated.ensureAuth,productController.saveProduct);
api.put('/updateProduct/:id', authenticated.ensureAuth,productController.updateProduct);
api.delete('/deleteProduct/:id/:idC', authenticated.ensureAuth,productController.deleteProduct);
api.get('/listProducts/:id', authenticated.ensureAuth,productController.listProduct);
api.put('/setProductSucursal/:idP/:idB/:idc', authenticated.ensureAuth,productController.setProductSucursal);
api.get('/CantidadPorEmpresa/:idC/:idP', authenticated.ensureAuth,productController.CantidadPorempresa);
api.get('/nameProductCompany/:idC', authenticated.ensureAuth, productController.nameProductCompany);
// Rutas sin referencia 
module.exports = api;