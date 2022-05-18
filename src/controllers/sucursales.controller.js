'use strict'

const BranchOffice = require('../models/sucursales.model');
const Company = require('../models/empresa.model');
const {validateData} = require('../utils/validate');
const jwt = require('../services/jwt');

exports.pruebaSucursales = async(req, res)=>{
    await res.send({message: 'Si funciona'});
}

exports.saveBranchOffice = async (req, res)=>{
    try{
        const params = req.body;
        const data = {
            name: params.name,
            address: params.address,
            idEmpresa: req.user.sub
        }
        const msg = validateData(data);
        if(!msg){
            const brachOffice = new BranchOffice(data);
            await brachOffice.save();
            return res.send({message: 'Sucursal creada'});
        }else return res.status(400).send(msg)
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.deleteBranchOffice = async(req, res)=>{
    try{
        const branchOfficeId = req.params.id;
        const branchOfficeDeleted = await BranchOffice.findOneAndDelete({_id:branchOfficeId});
        if(!branchOfficeDeleted)  return res.status(500).send({message: 'Sucursal no encontrada o ya fue eliminada'});
        return res.send({branchOfficeDeleted, message: 'Sucursal eliminada'});
        
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.getBranchOffice = async(req,res)=>{
    try{
        const branchOfficeId = req.params.id;
        const branchOffice = await BranchOffice.findOne({_id: branchOfficeId});
        if(!branchOffice) return res.send({message: 'Sucursal no encontrada'});
        return res.send({branchOffice});
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.getBranchOffices = async(req, res)=>{
    try{
        const branchOffices = await BranchOffice.find();
        return res.send({branchOffices});
    }catch(err){
        console.log(err);
        return err;
    }
}