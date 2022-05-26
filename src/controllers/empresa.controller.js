'use strict'

const Empresa = require('../models/empresa.model');
const { searchUser, encrypt, validateData, searchComany, checkPass, checkPermission, checkUpdate, checkUpdatEmpresa, checkUpdateAdmin } = require('../utils/validate');
const jwt = require('../services/jwt');


exports.pruebaEmpresa = async (req, res) => {
    await res.send({ message: 'Controller run' });
}

exports.saveEmpresa = async (req, res) => {
    try {
        const params = req.body;
        let data = {
            name: params.name,
            typeOfCompany: params.typeOfCompany,
            municipality: params.municipality,
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
                return res.send({ message: 'Company Saved' })
            } else {
                return res.send({ message: 'Name in use' })
            }

        } else {
            return res.status(400).send(msg);
        }
    } catch (err) {
        console.log(err)
        return res.status(500).send({ err, message: 'Error saving' })
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

            return res.send({ token, message: 'Welcome', alreadyEmpresa })
        } else return res.status(401).send({ message: 'Log in error' });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ err, message: 'Error' })
    }
}

exports.deleteCompany = async (req, res) => {
    try {
        const empresaId = req.params.id;
        const permission = await checkPermission(empresaId, req.user.sub);
        if (permission == false) return res.status(403).send({ message: 'Insuficient permissions' });
        const companyDeleted = await Empresa.findOneAndDelete({ _id: empresaId });
        if (companyDeleted) return res.send({ message: 'Company deleted', companyDeleted });
        return res.send({ message: 'Company not found or already deleted' });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ err, message: 'Error deleting' });
    }
}

exports.updateCompany = async (req, res) => {
    try {
        const empresaId = req.params.id;
        const params = req.body;
        if (params.password) return res.send({ message: 'Password cannot updated' });
        const companyEdit = await checkUpdatEmpresa(params);
        if (companyEdit === false) return res.status(400).send({ message: 'Params not received' });
        const permission = await checkPermission(empresaId, req.user.sub);
        
        if(permission === false) return res.status(401).send({message: 'Insuficient Permission'});
        const empresaUpdate = await Empresa.findOneAndUpdate({ _id: empresaId }, params, { new: true });
        if (!empresaUpdate) return res.send({ message: 'Company not found or not updated' });
        return res.send({ message: 'Company Updated', empresaUpdate });
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
            const admin = new Empresa(data);
            await admin.save();
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error saving ADMIN' })
    }
}


/*Eliminar Empresa*/
exports.deleteAdminCompany = async(req,res)=>{
    try{
        const searchComany = req.params.id; 
        const searchCompany = await Empresa.findOne({_id: searchComany});
        if(!searchCompany) return res.status(404).send({message: 'Company not found or already deleted'})

        if(!searchComany) return res.send({message: 'Insuficient permissions'}); 
        if(searchCompany.role === 'ADMIN') return res.send({message: 'Cannot delete company'});
        const companyDeleted = await Empresa.findOneAndDelete({_id: searchComany});
        if(!companyDeleted) return res.send({message: 'Insuficient permissions'}); 
        return res.send({companyDeleted, message: 'Company deleted'})
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'Error deleting'})
    }
}

/*Crear una empresa*/
exports.adminComany = async(req,res)=>{
    try{
        const params = req.body; 
        const data = {
            name: params.name, 
            typeOfCompany: params.typeOfCompany, 
            municipality: params.municipality, 
            password: params.password, 
            role: params.role
        }
        const msg = validateData(data);
        if(msg) return res.status(400).send(msg);
        const companyExist = await searchComany(params.name);
        if(companyExist) return res.send({message: 'Warning: Name in use'});
        if(params.role != 'ADMIN') return res.status(400).send({message: 'Invalid role'}); 
        data.name = params.name; 
        data.password = params.password; 

        const company = new Empresa(data);
        await company.save();
        return res.send({message: 'Empresa created'})
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'Error creating'}); 
    }
}

/*Verificar Empresas*/
exports.getCompany = async (req,res)=>{
    try{
        const dentCompany = await Empresa.find();
        return res.send({message: 'Company Found:', dentCompany}); 
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

        if(companyParams === false) return res.send({message: 'Params not received'}); 
        if(searchComany.role === 'ADMIN') return res.send({message: 'Action not allowed'});

        const nameCompany = await searchComany(params.name);
        if(nameCompany && searchComany.name != params.name) return res.send({message: 'Name in use'});
        if(params.role === 'ADMIN') return res.status(400).send({message: 'Invalid role' });

        const companyUpdate = await Empresa.findOneAndUpdate({_id: dentCompany},params,{new: true});
        if(!companyUpdate) return req.send({message: 'Company not Update'}); 
        return res.send({companyUpdate, message: 'Company Updated'});

    } catch(err){
        console.log(err); 
        return res.status(500).send('Error Updating');
    }
}