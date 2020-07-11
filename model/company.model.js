'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var companySchema = Schema({
    name: String,
    password: String,
    socialreason: String,
    ceo: String,    
    address: String,
    departaments: [],
    phone: [],
    employees: [{ type: Schema.Types.ObjectId, ref: 'employee'}],
    branchoffices: [{type: Schema.Types.ObjectId, ref: 'branchoffice'}],
    products: [{type: Schema.Types.ObjectId, ref:'product'}]
})

module.exports = mongoose.model('company', companySchema);