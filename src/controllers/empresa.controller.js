'use strict'

const Empresa = require('../models/empresa.model');
const { searchUser, encrypt, validateData, searchComany, checkPass } = require('../utils/validate');
const jwt = require('../services/jwt');


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
            let empresaExist = await searchComany(params.name); 
            if(!empresaExist){
                data.name = params.name; 
                data.typeOfCompany = params.typeOfCompany; 
                data.municipality = params.municipality; 
                data.password = await encrypt(params.password);

                let empresa = new Empresa(data);
                await empresa.save(); 
                return res.send({message: 'Company succesfully created'})
            }else{
                return res.send({message: 'Company name already in use, choose another name'})
            }

        }else{
            return res.status(400).send(msg);
        }   
    }catch(err){
        console.log(err)
        return res.status(500).send({err, message: 'Error saving'})
    }
}

exports.loginCompany = async(req,res) =>{
    try{
        const params = req.body; 
        const data = {
            name: params.name, 
            password: params.password
        }
        let msg = validateData(data);
        if(msg) return res.status(400).send(msg);
        let alreadyEmpresa = await searchComany(params.name);
        if(alreadyEmpresa && await checkPass (data.password, alreadyEmpresa.password)){
        let token = await jwt.createToken(alreadyEmpresa);
        delete alreadyEmpresa.password; 

        return res.send({token,message: 'Login successfuly',alreadyEmpresa})
        }else return res.status(401).send({message: 'Error al validar'});
    }catch(err){
        console.log(err);
        return res.status(500).send({err, message: 'failed to login'})
    }

}


