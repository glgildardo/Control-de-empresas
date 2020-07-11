'use strict'

var Company = require('../model/company.model');
var Employee = require('../model/employee.model');
var BranchOffice = require('../model/branchoffice.model');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');


function saveCompany(req, res){
    var company = new Company();
    var params = req.body;

    
    if(params.name && params.address && params.ceo && params.departaments && params.socialreason ){
        Company.findOne({$or:[{name: params.name}, {address: params.address}]}, (err, repeat) =>{
            if(err){
                res.status(500).send({mesagge: "Error del servidor"});
            }else if(repeat){
                res.send({mesagge: "Empresa ya existente"});
            }else{
                company.name = params.name;
                company.password = params.password;
                company.socialreason = params.socialreason;
                company.ceo = params.ceo;   
                company.address = params.address;
                company.departaments = params.departaments;
                company.phone = params.phone;

                bcrypt.hash(params.password, null, null, (err, passwordHash) =>{
                    if(err){
                        res.status(500).send({mesagge: "Error al encriptar la contraseña"});
                    }else if(passwordHash){
                        company.password = passwordHash;
                        company.save((err, save) =>{
                            if(err){
                                res.status(500).send({mesagge: "Error general"});
                            }else if(save){
                                res.send({company: save})
                            }else{
                                res.status(404).send({mesagge: "Error al guardar"});
                            }
                        });
                    }
                });
            }
        });   
    }else{
        res.status(418).send({mesagge:"Ingrese todos los datos"});
    }
}

function updateCompany(req, res){
    var companyId = req.params.id;
    var update = req.body;

    if(req.user.sub == companyId){
        Company.findByIdAndUpdate(companyId,  update,{new: true}, (err, companyUpdate) =>{
            if(err){
                res.status(500).send({mesagge: "Error general",err});
            }else if(companyUpdate){
                res.send({Company: companyUpdate});
            }else{
                res.status(404).send({mesagge: "Empresa no encontrado"});
            }
        }).populate('employee');
    }else{
        res.status(403).send({mesagge:"no tiene permiso para esta ruta"});
    }
    
}

function deleteCompany(req, res){
    var companyId = req.params.id;

    if(req.user.sub == companyId){
        Company.findById(companyId,(err, employeeid)=>{
            if(err){
                res.status(500).send({mesagge: 'Error al encontrar los empleados', err});
            }else if(employeeid){
                Employee.deleteMany({_id:employeeid.employees}, (err, deleteEmployees)=>{
                    if(err){
                        res.status(400).send({mesagge: "Los usuarios de la empresa no se han logrado eliminar"});
                    }else if(deleteEmployees){
                        BranchOffice.deleteMany({_id:employeeid.branchoffices}, (err, deleteBranch)=>{
                            if(err){
                                res.status(500).send({mesagge: "Error general"});
                            }else if(deleteBranch){
                                Company.findByIdAndRemove(companyId, (err, deleteCompany) =>{
                                    if(err){
                                        res.status(500).send({mesagge: "Error general"});
                                    }else if(deleteCompany ){
                                        res.send({mesagge: "Compañia eliminada exitosamente"});
                                    }else{
                                        res.status(404).send({mesagge: "No se a podido eliminar el usuario"});
                                    }
                                });
                            }else{
                                res.status(400).send({mesagge:"No se ha podido eliminar las sucursales de la empresa"})
                            }
                        });
                    }
                });
            }
        }); 
    }else{
        res.status(403).send({mesagge:"no tiene permiso para esta ruta"});
    }
}

function searchCompanys(req, res){
    
    Company.find({}, (err, companys) =>{
        if(err){
            res.status(500).send({mesagge: "Error general del servidor"});
        }else if(companys){
            res.send({Compañias_de_Aimar_S_A: companys});
        }else{
            res.status(404).send({mesagge: 'No hay compañias'});
        }
    }).populate('employees').populate('branchoffices').populate('products');
}



function listEmployees(req, res){
    var params = req.params.id;
    
    if(req.user.sub == params){
        Company.findById(params).exec((err, employee)=>{
            if(err){
                res.status(500).send({mesagge: "Error general del servidor"});
            }else if(employee){
                res.send({mesagge: "En la empresa" + ' ' + employee.name + ' ' + 'hay ' + employee.employees.length + ' empleados'});
            }else{
                res.status(404).send("No hay usuarios");
                console.log(err, params);
            }
        });    
    }else{
        res.status(403).send({mesagge:"No tiene permisos para esta ruta"});
    }
        
}

function login(req, res){
    var params = req.body;

    if(params.name){
        if(params.password){
            Company.findOne({name: params.name}, (err, check)=>{
                if(err){
                    res.status(500).send({mesagge: "Error general del servidor", err});
                }else if(check){
                    bcrypt.compare(params.password, check.password, (err, passwordOk) =>{
                        if(err){
                            res.status(404).send({mesagge: "Error del servidor" , err});
                        }else if(passwordOk){
                            if(params.gettoken = true){
                                    res.send({token: jwt.createToken(check)});
                            }else{
                                res.send({mesagge: "Bienvendio", user: check});
                            }
                        }else{
                            res.status(403).send({mesagge: "Contraseña incorrecta"});
                        }
                    });
                    
                }else{
                    res.send({mesagge: "Empresa no existente"})
                }
            });
        }
    }
}


module.exports ={
    saveCompany,
    updateCompany,
    deleteCompany,
    searchCompanys,
    listEmployees,
    login
}