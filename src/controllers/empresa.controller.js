'use strict'

const Empresa = require('../models/empresa.model');
const { searchUser, encrypt, validateData, searchComany, checkPass, checkPermission, checkUpdate, checkUpdatEmpresa} = require('../utils/validate');
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

exports.deleteCompany = async(req, res)=>{
    try{
        const empresaId = req.params.id; 
        const permission = await Empresa.findOne({_id: empresaId}).lean();
        if(permission == false) return res.status(403).send({message: 'You dont have permission to delete this company'});
        const companyDeleted = await Empresa.findOneAndDelete({_id: empresaId});
        if(companyDeleted) return res.send({message: 'Account deleted', companyDeleted}); 
        return res.send({message: 'Company not found or already deleted'});
    }catch(err){
        console.log(err);
        return res.status(500).send({err, message: 'Error deleting company'});
    }
}

exports.updateCompany = async (req, res) =>{
    try{
        const empresaId = req.params.id; 
        const params = req.body; 
        if(params.password) return res.send({message: 'password cannnot be edited'}); 
        const companyEdit = await checkUpdatEmpresa(params);
        if(companyEdit === false) return res.status(400).send({message:'No parameters have been sent to update'}); 
        const empresaUpdate = await Empresa.findOneAndUpdate({_id: empresaId}, params, {new:true});
        if(!empresaUpdate) return res.send({message: 'Company does not ecist or Company not updated'});
        return res.send({message: 'Company update', empresaUpdate});
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'Error update company'})
    }
}



