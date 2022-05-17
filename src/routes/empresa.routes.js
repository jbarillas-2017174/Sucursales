'use strict'

const empresaController = require('../controllers/empresa.controller');
const mdAuth = require('../services/authenticated');
const express = require('express');
const api = express.Router();

//Rutas 
api.get('/pruebaEmpresa',empresaController.pruebaEmpresa);

api.post('/saveEmpresa',empresaController.saveEmpresa);
api.post('/loginCompany',empresaController.loginCompany);

api.delete('/deleteCompany/:id', mdAuth.ensureAuth,empresaController.deleteCompany);
api.put('/updateCompany/:id', mdAuth.ensureAuth, empresaController.updateCompany);


module.exports = api; 