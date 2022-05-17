'use strict'

const empresa = require('../models/empresa.model');
const { searchUser } = require('../utils/validate');

//const jwt = require('../services//jwt');

exports.pruebaEmpresa = async(req, res) =>{
    await res.send({message: 'Controller run'}); 
}

exports.saveEmpresa = async(req,res)=>{
    try{
        const params = req.body; 
        let data = {
            name: params.name, 
            typeOfCompany: params.typeOfCompany,
            municipality: params.municipality, 
            password: params.password
        }
        let msg = validateData(data);
        if(!msg){
            let empresaExist = await searchUser(params.name); 
            
        }      

    }catch(err){
        console.log(err)
        return res.status(500).send({err, message: 'Error saving'})
    }
}