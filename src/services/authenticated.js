'use strict'

const jwt = require('jwt-simple');
const moment = require('moment');
const secretKey= 'Kjs1yZ23';

exports.ensureAuth = async (req, res, next) =>{
    if(!req.headers.authorization){
        return res.status(403).send({message: 'Authorization header is needed'});
    }else{
        try{
            var token = req.headers.authorization.replace(/['"]+/g, '');
            var payload = jwt.decode(token, secretKey);
            if(payload.exp <= moment().unix()){
                return res.status(401).send({message: 'token expired'});
            }
        }catch(err){
            return res.status(404).send({message: 'Token not valid'})
        }
        req.user = payload;
        next();
    }
}

exports.isAdmin = async (req, res, next) =>{
    try{
        const user = req.user;
        if(user.role === 'ADMIN') return next();
        else return res.status(403).send({message: 'User unauthorized'});
    }catch(err){
        console.log(err);
        return err;
    }
}