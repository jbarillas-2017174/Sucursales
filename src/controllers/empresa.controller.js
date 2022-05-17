'use strict'

const Empresa = require('../models/empresa.model');
const { searchUser, encrypt, validateData, searchComany } = require('../utils/validate');


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


