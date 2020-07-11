'user strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var key = 'clave_supersecreta_1234';

exports.ensureAuth = (req, res, next) =>{
    if(!req.headers.authorization){
        return res.status(403).send({message: 'Peticion sin autentificacion'});
    }else{
        var token = req.headers.authorization.replace(/['"]+/g,'');
        try{
            var payload = jwt.decode(token,key);
            if(payload.exp <= moment().unix()){
                return res.status(401).send({message: 'Token expirado'});
            }else{

            }
        }catch(Exception){
            return res.status(404).send({message: 'Token no valido'});
        }

        req.user = payload;
        next();
    }
}