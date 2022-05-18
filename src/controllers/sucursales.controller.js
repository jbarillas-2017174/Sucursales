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
        const already = await BranchOffice.findOne({idEmpresa: data.idEmpresa, name: data.name})
        if(already) return res.status(500).send({message: 'name in use'});
        //si tiene el mismo idEmpresa y el mismo nombre = cerrar
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
        const branchOfficeDeleted = await BranchOffice.findOneAndDelete({_id:branchOfficeId}).lean().populate('idEmpresa');
        delete branchOfficeDeleted.idEmpresa.password;
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
        const branchOffice = await BranchOffice.findOne({_id: branchOfficeId, idEmpresa: req.user.sub});
        if(!branchOffice) return res.send({message: 'Sucursal no encontrada'});
        return res.send({branchOffice});
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.getBranchOffices = async(req, res)=>{
    try{
        const branchOffices = await BranchOffice.find({idEmpresa: req.user.sub});
        return res.send({branchOffices});
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.updateBranchOffice = async (req,res) =>{
    try{
        const branchOfficeId = req.params.id;
        const params = req.body;
        if(Object.entries(params).length === 0) return res.status(400).send({message: 'there are no any params'});
        const branchOffices = await BranchOffice.find({idEmpresa: req.user.sub});
        if(!branchOffices) return res.satus(500).send({message: 'Action not authorized'});
        const already = await BranchOffice.findOne({idEmpresa: req.user.sub, name: params.name});
        if(already) return res.status(500).send({message: 'Name in use'});
        const updateBranchOffice = await BranchOffice.findByIdAndUpdate({_id: branchOfficeId}, params, {new: true}).lean().populate('idEmpresa');
        delete updateBranchOffice.idEmpresa.password;
        return res.send({message: 'Updated', updateBranchOffice})
    }catch(err){
        console.log(err);
        return err;
    }
}