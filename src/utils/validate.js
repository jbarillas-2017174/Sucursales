'use strict'

const Empresa = require('../models/empresa.model')
const bcrypt = require('bcrypt-nodejs');
const productsCModel = require('../models/productsC.model');

exports.validateData = (data)=>{
    let keys = Object.keys(data), msg = '';
    for(let key of keys){
        if(data[key] !== null && data[key] !== undefined && data[key] !== '') continue;
            msg += `Param (${key}) is required\n`;
    }
    return msg.trim();
}

/*Modificar*/
exports.searchComany = async (name)=>{
    try{
        let already = Empresa.findOne({name: name}).lean();
        return already;
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.encrypt = async (password)=>{
    try{
        return bcrypt.hashSync(password);
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.checkPass = async (password, hash)=>{
    try{
        return bcrypt.compareSync(password, hash);
    }catch(err){
        console.log(err);
        return err;
    }
}

/**/
exports.checkPermission = async (companId, sub)=>{
    try{
        if(companId != sub){
            return false;
        }else{
            return true;
        }
    }catch(err){
        console.log(err);
        return err;
    }
}

/* Editar*/
/*
exports.checkUpdate = async (company)=>{
    if(company.password || 
       Object.entries(company).length === 0 || 
       company.name){
        return false;
    }else{
        return true;
    }
}
*/


exports.checkUpdatEmpresa = async(company)=>{
    if(company.sales ||
       Object.entries(company).length === 0){
        return false;
    }else{
        return true;
    }
}




