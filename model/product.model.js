'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productSchema = Schema({
    name: String,
    numberpackage: Number,
    stock: Number,
    entrydate: String,
    expirationdate: String
})

module.exports = mongoose.model('product', productSchema);
