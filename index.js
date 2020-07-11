'use strict'

var mongoose = require('mongoose');
var port = 3800;
var app = require('./app');

mongoose.Promise = global.Promise;
                                        // para que no haga varios hilos de conexion
mongoose.connect('mongodb://localhost:27017/CEmpresa',{useNewUrlParser: true, useUnifiedTopology: true})
    .then( ()=>{
        console.log('Conexion Correcta a la base de datos');
        app.listen(port, () =>{
            console.log('Servidor corriendo en el puerto' + port);
        })
    })

    .catch( err =>{
        console.log('Error al conectarse', err);
    })

    module.exports = app;