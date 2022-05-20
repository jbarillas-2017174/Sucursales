'use strict'

const Empresa = require('../models/empresa.model');
const { searchUser, encrypt, validateData, searchComany, checkPass, checkPermission, checkUpdate, checkUpdatEmpresa, checkUpdateAdmin } = require('../utils/validate');
const jwt = require('../services/jwt');
const BranchOffice = require('../models/sucursales.model');
const ProductsC = require('../models/productsC.model');
const ProductoS = require("../models/productsS.model");


exports.pruebaEmpresa = async (req, res) => {
    await res.send({ message: 'Controller run' });
}

exports.saveEmpresa = async (req, res) => {
    try {
        const params = req.body;
        let data = {
            name: params.name,
            typeOfCompany: params.typeOfCompany,
            town: params.town,
            password: params.password,
            role: 'COMPANY'
        }
        let msg = validateData(data);
        if (!msg) {
            let empresaExist = await searchComany(params.name);
            if (!empresaExist) {
                data.password = await encrypt(params.password);

                let empresa = new Empresa(data);
                await empresa.save();
                return res.send({ message: 'Empresa creada exitosamente' })
            } else {
                return res.send({ message: 'El nombre de la empresa ya está en uso' })
            }

        } else {
            return res.status(400).send(msg);
        }
    } catch (err) {
        console.log(err)
        return res.status(500).send({ err, message: 'Error guardando' })
    }
}

exports.loginCompany = async (req, res) => {
    try {
        const params = req.body;
        const data = {
            name: params.name,
            password: params.password
        }
        let msg = validateData(data);
        if (msg) return res.status(400).send(msg);
        let alreadyEmpresa = await searchComany(params.name);
        if (alreadyEmpresa && await checkPass(data.password, alreadyEmpresa.password)) {
            let token = await jwt.createToken(alreadyEmpresa);
            delete alreadyEmpresa.password;

            return res.send({ token, message: 'Bienvenido', alreadyEmpresa })
        } else return res.status(401).send({ message: 'Error al validar' });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ err, message: 'Error iniciando sesión' })
    }
}

exports.deleteCompany = async (req, res) => {
    try {
        const empresaId = req.params.id;
        const permission = await Empresa.findOne({ _id: empresaId }).lean();
        if (permission == false) return res.status(403).send({ message: 'No tienes permiso para eliminar esta empresa' });
        const companyDeleted = await Empresa.findOneAndDelete({ _id: empresaId });
        if (companyDeleted) return res.send({ message: 'Empresa eliminada', companyDeleted });
        return res.send({ message: 'Empresa no encontrada o ya eliminada' });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ err, message: 'Error eliminando empresa' });
    }
}

exports.updateCompany = async (req, res) => {
    try {
        const empresaId = req.params.id;
        const params = req.body;
        if (params.password) return res.send({ message: 'La contraseña no se puede actualizar' });
        const companyEdit = await checkUpdatEmpresa(params);
        if (companyEdit === false) return res.status(400).send({ message: 'No se han enviado parámetros' });
        const empresaUpdate = await Empresa.findOneAndUpdate({ _id: empresaId }, params, { new: true });
        if (!empresaUpdate) return res.send({ message: 'Empresa no existe, o no actualizada' });
        return res.send({ message: 'Empresa actualizada', empresaUpdate });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error actualizando' })
    }
}

exports.createAdmin = async (req, res) => {
    try {
        if (await Empresa.find() == '' || !await Empresa.findOne({name: 'SuperAdmin'})) {
            const data = {
                name: 'SuperAdmin',
                password: '123456',
                role: 'ADMIN'
            }
            data.password = await encrypt(data.password);
            const admin = new Empresa(data);
            await admin.save();
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error saving admin' })
    }
}


/*Eliminar Empresa*/
exports.deleteAdminCompany = async(req,res)=>{
    try{
        const companyDent = req.params.id; 
        const searchCompany = await Empresa.findOne({_id: companyDent}); 
        if(!searchCompany) return res.send({message: 'No puedes realizar esta accion'}); 
        if(searchComany.role === 'ADMIN') return res.send({message: 'No se realizo la funcion eliminar empresa'});
        const companyDeleted = await Empresa.findOneAndDelete({_id: companyDent}).lean();
        delete companyDeleted.password
        const sucursalDelete = await BranchOffice.findOneAndDelete({idEmpresa: companyDent});
        if(!companyDeleted) return res.send({message: 'Action not allowed'}); 
        return res.send({companyDeleted, message: 'Account deleted Successfuly'})
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'Delete user Admin'})
    }
}

/*Crear una empresa*/
exports.adminComany = async(req,res)=>{
    try{
        const params = req.body; 
        const data = {
            name: params.name, 
            typeOfCompany: params.typeOfCompany, 
            town: params.town, 
            password: params.password, 
            role: 'COMPANY'
        }
        const msg = validateData(data);
        if(msg) return res.status(400).send(msg);
        const companyExist = await searchComany(params.name);
        if(companyExist) return res.send({message: 'Warning: el nombre ya fue utilizado por una empresa'});
        data.password = await encrypt(params.password);

        const company = new Empresa(data);
        await company.save();
        return res.send({message: 'Empresa creada'})
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'Error adminComany'}); 
    }
}

/*Verificar Empresas*/
exports.getCompany = async (req,res)=>{
    try{
        const dentCompany = await Empresa.find();
        return res.send({message: 'GetCompany Found', dentCompany}); 
    }catch(err){
        console.log(err);
        return res.status(500).send('Error Get Company')
    }
}

exports.updateAdminCompany = async(req,res)=>{
    try{
        const dentCompany = req.params.id; 
        const params = req.body; 

        const searchCompany = await Empresa.findOne({_id: dentCompany});
        if(!searchComany) return res.send({message: 'Company not found, try again'}); 
        const companyParams = await checkUpdateAdmin(params); 

        if(companyParams === undefined) return res.send({message: 'Parámetros vacíos o parámetros no actualizados, intente nuevamente'}); 
        if(searchComany.role === 'ADMIN') return res.send({message: 'Acción no permitida'});
        if(params.password) return res.send({message: 'Cannot update password'});

        const nameCompany = await searchComany(params.name);
        if(nameCompany && searchComany.name != params.name) return res.send({message: 'Nombre de la empresa ya esta en uso'});
        if(params.role === 'ADMIN') return res.status(400).send({message: 'Invaled role' });

        const companyUpdate = await Empresa.findOneAndUpdate({_id: dentCompany},params,{new: true}).lean();
        delete companyUpdate.password;
        if(!companyUpdate) return req.send({message: 'Company Update'}); 
        return res.send({companyUpdate, message: 'Empresa actualizada'});

    } catch(err){
        console.log(err); 
        return res.status(500).send('Error Update Company');
    }
}
