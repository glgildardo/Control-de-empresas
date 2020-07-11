'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var branchofficeSchema = Schema({
    name: String,
    address: String,
    employees: [{ type: Schema.Types.ObjectId, ref: 'employee'}],
    products: [{name: String,
        packagenumber: Number,
        stock: Number}]

})

module.exports = mongoose.model('branchoffice', branchofficeSchema);