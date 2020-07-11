'use strict'

var Branchoffice = require('../model/branchoffice.model');
var Company = require('../model/company.model');
var Employee = require('../model/employee.model');

function saveBranchoffice(req,res){
    var body = req.body;
    var branchoffice = new Branchoffice();

    if(body.name && body.address && body.company){
        Company.findOne({name:body.company},(err,companybranch)=>{
            if(req.user.sub == companybranch._id){
                if(err){
                    res.status(500).send({message:"Error del servidor", err});
                }else if(companybranch){
                    Branchoffice.findOne({name: companybranch.branchoffices}, (err,branchofficeRepeat) =>{
                        if(err){
                            console.log(companybranch)
                            res.status(500).send({message:"Error del servidor"});
                        }else if(branchofficeRepeat){
                            res.send({message: 'sucursal repetida'});
                        }else{
                            Company.findOne({name: body.company},(err,company) =>{
                                if(err){
                                    res.status(500).send({message:"Error general del servidor"});
                                }else if(company){
                                    branchoffice.name = body.name;
                                    branchoffice.address = body.address;
                                    
                                    branchoffice.save((err, save) =>{
                                        if(err){
                                            res.status(500).send({message: "Error general del sistema"});
                                        }else if(save){
            
                                            Company.findOneAndUpdate({name: company.name},{$push:{branchoffices: save}},(err,updateCompany)=>{
                                                if(err){
                                                    res.status(500).send({message:"Error general del servidor", err});
                                                }else if(updateCompany){
                                                    res.send({Exito_al_registrar_la_sucursal: save});
                                                }else{
                                                    res.status(400).send({message:"Se logro guardar la sucursal pero no la compañia a la que esta asignada"});
                                                }
                                            });
                                        }else{
                                            res.status(404).send({message:"No se a podido registrar la sucursal"});
                                        }
                                    });                        
                                }else{
                                    res.status(404).send({message:"La compañia a la que quiere asignar la sucursal no existe"});
                                }
                            });                            
                        }
                    })
                }else{
                    res.status(403).send({message:"Envie todos los parametros"})
                }
            }else{
                res.status(403).send({message:"No tiene permisos para esta ruta"});
            }           
        });
    }else{
        res.status(404).send({message:"La empresa a la que decea registrar la oficina no existe"})
    }
        
}

function updateBranchoffice(req,res){
    var update = req.body;
    var idbranch = req.params.id;
    var idcompany = req.params.idC;

    if(req.user.sub == idcompany){
        Branchoffice.findOne({name: update.name},(err, branchExist) =>{
            if(err){
                res.status(500).send({message:"Error general del sistema"});
            }else if(branchExist){
                res.send({message: "Sucursal ya existente"});
            }else{
                Branchoffice.findOneAndUpdate(idbranch, update, {new: true}, (err, BranchUpdate)=>{
                    if(err){
                        res.status(500).send({message: "Error general del servidor"});
                    }else if(BranchUpdate){
                        res.send({Sucuarsal_Actualizada: BranchUpdate});
                    }else{
                        res.status(404).send({message:"La sucursal que desea actualizar no existe"});
                    }
                })
            }
        })
    }else{
        res.status(403).send({message:"No tiene permisos para esta ruta"});
    }
}

function searchBranchoffice(req,res){
    var idbranch = req.params.id;
    var idcompany = req.params.idC;

    if(req.user.sub == idcompany){
        Branchoffice.findOne(idbranch, (err, branch) =>{
            if(err){
                res.status(500).send({message: "Error general del servidor"});
            }else if(branch){
                res.send({Sucursal: branch});
            }else{
                res.status(404).send({message:"No existe la sucursal"});
            }
        })
    }else{
        res.status(403).send({message:"No tiene permisos para esta ruta"});
    }
}

function ListBranchoffice(req,res){
    var idcompany = req.params.idC;

    if(req.user.sub == idcompany){
        Branchoffice.find((err, Branchoffices) =>{
            if(err){
                res.status(500).send({message:"Error general del sistema"});
            }else if(Branchoffices){
                res.send({Sucursales: Branchoffices});
            }else{
                res.status(404).send({message:"No hay usuarios"});
            }
        }).populate;
    }else{
        res.status(403).send({message:"No tiene permisos para esta ruta"});
    }
    
}

function delteBranchoffice(req,res){
    var idbranch = req.params.id;
    var idcompany = req.paramd.idC;

    if(req.user.sub == idcompany){
        Branchoffice.findById(idbranch, (err, branchd)=>{
            if(err){
                res.status(500).send({message: "Error general del servidor", err});
            }else if(branchd){
                Company.findOne({branchoffices: idbranch},(err, company)=>{
                    if(err){
                        res.status(500).send({message: "Error general del servidor", err});
                    }else if(company){
                        Company.findOneAndUpdate({_id: company.id},{$pull:{'branchoffices':idbranch},$pullAll:{'employees':branchd.employees}},(err,branchofficeDeletedComp)=>{
                            if(err){
                                res.status(500).send({message: "Error general del servidor", err});
                            }else if(branchofficeDeletedComp){
                                Employee.deleteMany({_id:branchd.employees}, (err, deleteEmployee)=>{
                                    if(err){
                                        console.log(deleteEmployee);
                                        res.status(500).send({message: "Error general del servidor", err});
                                    }else if(deleteEmployee){
                                        Branchoffice.findByIdAndRemove(idbranch,(err,deleteSucursal)=>{
                                            if(err){
                                                res.status(500).send({message: "Error general del servidor", err});
                                            }else if(deleteSucursal){
                                                res.send({message: "La sucursal a sido eliminada"});
                                            }else{
                                                console.log(deleteSucursal);
                                                res.status(404).send({message:"La sucursal que quiere eliminar no existe"});
                                            }
                                        });  
                                    }else{
                                        res.status(418).send({message:"No se ha logrado eliminar al empleado"});
                                    }    
                                });
                            }else{
                                res.status(400).send({message:"No se ha podido Eliminar la sucursal"});
                            }
                        });
                    }else{
                        res.status(404).send({message:'No hay un empleado trabajando en esta compañia',company});
                    }
                });
            }else{
                res.status(418).send({message:"La sucursal no existe"});
            }
        });
    }else{
        res.status(403).send({message:"No tiene permisos para esta ruta"});
    }   
}

function listSucursals(req,res){
    var idcompany = req.params.idC;

    if(req.user.sub == idcompany){
        Company.findById(idcompany,(err, company)=>{
            if(err){
                res.status(500).send({message:"Error general en el servidor", err});
            }else if(company){
                res.send({Sucursales: company.branchoffices})
            }else{
                res.status(404).send({message:"No ha seleccionado la empresa a la cual quiere listar sus sucursales "});
            }
        })
    }else{
        res.status(403).send({message:"No tiene permisos para esta ruta"});
    }
}

module.exports = {
    saveBranchoffice,
    updateBranchoffice,
    searchBranchoffice,
    ListBranchoffice,
    listSucursals,
    delteBranchoffice
}