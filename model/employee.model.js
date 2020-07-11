'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var employeeSchema = Schema({
    name: String,
    lastname: String,
    age: Number,
    dpi: Number,
    position: String,
    departament: String,
    salary: Number
})

module.exports = mongoose.model('employee', employeeSchema);