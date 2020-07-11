'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var key = 'clave_supersecreta_1234';

exports.createToken = (company)=>{
    var payload ={
        sub: company._id,
        name: company.name,
        password: company.password,
        socialreason: company.socialreason,
        ceo: company.ceo,
        departaments: company.departaments,
        phone: company.phone,
        employees: company.employees,
        products: company.products,
        iat: moment().unix(),
        exp: moment().add(15, 'days').unix 
    }
    return jwt.encode(payload,key);
}