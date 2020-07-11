'use strict'

var Product = require('../model/product.model');
var Company = require('../model/company.model');
var BranchOffice = require("../model/branchoffice.model");

function saveProduct(req, res){
    var body = req.body;
    var product = new Product();

    Company.findOne({name: body.company}, (err,companys)=>{
        if(err){
            res.status(500).send({message: "Error general del sistema"});
        }else if(companys){
            if(req.user.sub == companys._id){
                if(body.name && body.numberpackage && body.entrydate && body.expirationdate && body.stock){
                    Product.findOne({name: body.name},(err,productRepeat) =>{
                        if(err){
                            res.status(500).send({message: "Error general del sistema"});
                        }else if(productRepeat){
                            res.status(400).send({message: "Este producto ya existe"});
                        }else{
                            product.name = body.name;
                            product.numberpackage = body.numberpackage;
                            product.stock = body.stock;
                            product.entrydate = body.entrydate;
                            product.expirationdate = body.expirationdate;
            
                            product.save((err,productsave) =>{
                                if(err){
                                    res.status(500).send({message: "Error general del sistema",err});
                                }else if(productsave){
                                    console.log(companys);
                                    Company.findByIdAndUpdate(companys._id, {$push:{'products':productsave}}, {new:true},(err,companypackage)=>{
                                        if(err){
                                            res.status(500).send({message: "Error general del sistema",err});
                                        }else if(companypackage){
                                            res.send({Producto: productsave});
                                        }else{
                                            res.status(408).send({message:"No se ha podido guardar el paquete en la empresa", companypackage});
                                        }
                                    });
                                }else{
                                    res.status(418).send({message:"No se ha podido guardar el producto"});
                                }
                            });
                        }
                    });
                }else{
                    res.status(404).send({message: "Ingrese todos los campos solicitados"});
                }
            }else{
                res.status(403).send({message:"No tiene permisos para esta ruta"});
            }
            
        }else{
            res.status(418).send({message:"No se logro encontrar la empresa a la que desea mandar el producto"});
        }
    });    
}

function updateProduct(req, res){
    var idproduct = req.params.id;
    var update = req.body;

    Company.findOne({name: update.company}, (err,companys)=>{
        if(err){
            res.status(500).send({message: "Error general del servidor", err});
        }else if(companys){
            if(req.user.sub == companys._id){
                Product.findByIdAndUpdate(idproduct, update, {new: true}, (err, productupdate) =>{
                    if(err){
                        res.status(500).send({message: "Error general del servidor"});
                    }else if(productupdate){
                        res.send({Producto: productupdate});
                    }else{
                        res.status(405).send({message: "El producto que desea actualizar no existe"});
                    }
                });
            }else{
                res.status(403).send({message:"No tiene permisos para esta ruta"});
            }        
        }else{
           res.status(404).send({message:"No existe una empresa a la cual cambiar su producto"}); 
        }
    });
    
}

function deleteProduct(req, res){
    var productid = req.params.id;
    var companyid = req.params.idC;

    if(req.user.sub == companyid){
        Product.findByIdAndRemove(productid, (err, deleteproduct) =>{
            if(err){
                res.status(500).send({err: "Error general del servidor", err});
            }else if(deleteproduct){
                res.send({message: "El producto se ha eliminado exitosamente"});
            }else{
                res.status(418).send({message: "El producto que desea eliminar no existe"});
            }
        });
    }else{
        res.status(403).send({message:"No tiene permisos para esta ruta"});       
    }
    
}

function listProduct(req, res){
    var companyid = req.params.id;

    if(req.user.sub == companyid){
        Company.findById(companyid, (err, product)=>{
            if(err){
                res.status(500).send({message: "Error general del servidor", err});
            }else if(product){
                res.send({productos: product});
            }else{
                res.status(404).send({message: "No hay datos sobre productos"});
            }
        });
    }else{
        res.status(403).send({message:"No tiene permisos para esta ruta"});       
    }
    
}

function setProductSucursal(req,res){
    var idproduct = req.params.idP;
    var idbranch = req.params.idB;
    var idCompany = req.params.idc;
    var body = req.body;

    if(req.user.sub == idCompany){
        BranchOffice.findById(idbranch, (err, branchOffice)=>{
            if(err){
                res.status(500).send({message:"Error general en el servidor", err});
            }else if(branchOffice){
                Product.findById(idproduct,(err,producto)=>{
                    if(err){
                        res.status(500).send({message:"Error general en el servidor", err});
                    }else if(producto){
                        let resta = producto.stock - body.stock;
                        if(producto.stock > body.stock){
                            BranchOffice.findByIdAndUpdate(idbranch, {$push:{products:[{name: producto.name , packagenumber:producto.packagenumber, stock: body.stock,}]}},(err,branchproductupdate)=>{
                                if(err){
                                    res.status(500).send({message:"Error general en el servidor", err});
                                }else if(branchproductupdate){
                                    Product.findByIdAndUpdate(idproduct, {stock: resta},{new:true},(err,productUpdate)=>{
                                        if(err){
                                            res.status(500).send({message:"Error general en el servidor", err});
                                        }else if(productUpdate){
                                            res.send({Producto: productUpdate});
                                        }else{
                                            res.status(418).send({message:"No se logro actualizar el stock de "})
                                        }
                                    });
                                }else{
                                    res.status(418).send({message:"No puede eliminar el"})
                                }           
                            });
                        }else{
                            res.status(404).send({message:"No hay suficientes paquetes para mandar a la sucursal"});
                        }
                    }else{
                        res.status(418).send({message:"No se logro encontral el producto en la base de datos"})
                    }
                });    
            }else{
                res.status(418).send({message:"No se encontro la sucursal a la que decea mandar el producto"});
            }
        })
    }else{
        res.status(403).send({message:"No tiene permisos para esta ruta"});
    }
}

function CantidadPorempresa(req, res){
    var idproduct = req.params.idP;
    var idCompany = req.params.idC;
    
    if(req.user.sub = idCompany){
        Company.findById(idCompany,(err, findproductCompany)=>{
            if(err){
                res.status(500).send({message:"Error general en el servidor", err});
            }else if(findproductCompany){
                Product.find({},{name:1,stock:1},(err,product)=>{
                    if(err){
                        res.status(500).send({message:"Error general en el servidor", err});
                    }else if(product){
                        res.send({Producto: product});
                    }else{
                        res.send(404).send({message:"No se encontraron los productos"});
                    }
                });
            }else{
                res.status(404).send({message:"No se encontro la empresa a la que queria consultar la cantidad de producto"});
            }
        })
    }else{
        res.status(403).send({message:"No tiene permisos para esta ruta"});
    }
    
}

function nameProductCompany(req,res){
    var idcompany = req.params.idC;

    if(req.user.sub == idcompany){
        Company.findById(idcompany,(err, company)=>{
            if(err){
                res.status(500).send({message:"Error general en el servidor", err});
            }else if(company){
                res.send({Sucursales: company.products})
            }else{
                res.status(404).send({message:"No ha seleccionado la empresa a la cual quiere listar sus sucursales "});
            }
        })
    }else{
        res.status(403).send({message:"No tiene permisos para esta ruta"});
    }
}

module.exports = {
    saveProduct,
    updateProduct,
    deleteProduct,
    setProductSucursal,
    CantidadPorempresa,
    listProduct,
    nameProductCompany
}