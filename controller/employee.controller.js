'use strict'

var Employee = require('../model/employee.model');
var Company = require('../model/company.model');
var BranchOffice = require('../model/branchoffice.model');

function saveEmployee(req, res){
    var employee = new Employee();
    var enterpriseId = req.params.idC;
    var params = req.body;

    if(req.user.sub == enterpriseId){
        if(params.name && params.lastname && params.age && params.position && params.departament && params.salary && params.Sucursal && params.companyid){
            Employee.findOne({dpi: params.dpi}, (err, employe) =>{
                if(err){
                    res.status(500).send({err: "Error general del servidor"});
                }else if(employe){
                    res.status(404).send({message: "Usuario Repetido"});
                }else{
                    employee.name = params.name;
                    employee.lastname = params.lastname;
                    employee.age = params.age;
                    employee.dpi = params.dpi;
                    employee.position = params.position;
                    employee.departament = params.departament;
                    employee.salary = params.salary;
    
                    employee.save((err, employeeSave) =>{
                        if(err){
                            res.status(500).send({message: "Error general de servidor"});
                        }else if(employeeSave){
                            var update = req.body.companyid;
                            Company.findByIdAndUpdate(update, {$push:{employees: employee}}, {new: true}, (err, companyUpdate) =>{
                                if(err){
                                   res.status(500).send({err: "Error general del servidor"});
                                }else if(companyUpdate){
                                    BranchOffice.findByIdAndUpdate(params.Sucursal,{$push:{employees:employee}}, (err,employeesaveoffice)=>{
                                        if(err){
                                            res.status(500).send({err: "Error general del servidor"});
                                        }else if(employeesaveoffice){
                                            res.send({message: employeeSave});
                                        }else{
                                            res.status(404).send({message:"Todo salio bien pero no se logro registrar en la sucursal"});
                                        }
                                    })
                                }else{
                                    res.status(404).send({message: "No se logro guardar al empleado porque la empresa no existe"});
                                }
                            });
                        }else{
                            res.status(404).send({message: "No se ha podido guardar el empleado"});
                        }
                    });
                }
                
            });    
        }else{
            res.status(404).send({message: "Ingrese todos los datos"});
        }
    }else{
       res.status(403).send({message:"No tiene permisos para esta ruta"}); 
    }
}

function updateEmployee(req, res){
    var employeeId = req.params.id;
    var paramsbody = req.body;
    var idcompany = req.params.idC;

    if(req.user.sub == idcompany){
        Employee.findByIdAndUpdate(employeeId, paramsbody,{new: true}, (err, updateEmployee) =>{
            if(err){
                res.status(500).send({message: "Error general"});
            }else if(updateEmployee){
                res.send({message: updateEmployee});
            }else{
                res.status(404).send({message: "No se encontro al empleado"});
            }
        });
    }else{
       res.status(403).send({message:"No tiene permisos para esta ruta"}); 
    }
    
}

function deleteEmployee(req, res){
    var employeeId = req.params.id;
    var enterpriseId = req.params.idE;
    var branchofficeId = req.params.idB;

    if(req.user.sub == enterpriseId){
        BranchOffice.findByIdAndUpdate(branchofficeId, {$pull:{'employees':employeeId}},{new:true}, (err, employeedeleted)=>{
            if(err){
                res.status(500).send({message:"Error general del servidor", err});
            }else if(employeedeleted){
                Company.findByIdAndUpdate(enterpriseId, {$pull:{'employees': employeeId}}, {new: true}, (err, deleted) =>{
                    if(err){
                        res.status(500).send({message:"Error general del servidor", err});
                    }else if(deleted){
                        Employee.findByIdAndRemove(employeeId, (err, deleteEmployee) =>{
                            if(err){
                                res.status(500).send({message: "Error general del servidor", err});
                            }else if(deleteEmployee){
                                res.send({message:"Empleado eliminado exitosamente"});     
                            }else{
                                res.status(404).send({message:"No se ha podido eliminar el empleado"});
                            }   
                        });
                    }else{
                        res.status(404).send({message:"La empresa no logro eliminar al empleado"});
                    }
                });                     
            }else{
                res.status(404).send({message:"No se ha logrado eliminar el empleado de la sucursal"});
            }
        });
    }else{
       res.status(403).send({message:"No tiene permisos para esta ruta"}); 
    }
}

function searchEmployee(req, res){
    var params = req.body;

    Employee.find({$or:[{name: {$regex: '^' + params.name, $options: 'i'}}]}, (err,employees)=>{
        if(err){
            res.status(500).send({message: "Error general del servidor: "+err})
        }else if(employees){
            res.send(employees);
        }else{
            res.status(404).send({message: "No hay usuarios"});
        }
    })
}


module.exports = {
    saveEmployee,
    updateEmployee,
    deleteEmployee,
    searchEmployee
}