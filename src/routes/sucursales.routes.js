'use strict'

const sucursalesController = require('../controllers/sucursales.controller');
const express = require('express');
const api = express.Router();
const mdAuth = require('../services/authenticated');

api.get('/pruebaSucursales', sucursalesController.pruebaSucursales);
api.post('/saveBranchOffice', mdAuth.ensureAuth, sucursalesController.saveBranchOffice);
api.delete('/deleteBranchOffice/:id', mdAuth.ensureAuth, sucursalesController.deleteBranchOffice);
api.put('/updateBranchOffice/:id', mdAuth.ensureAuth, sucursalesController.updateBranchOffice);
api.get('/getBranchOffice/:id', mdAuth.ensureAuth, sucursalesController.getBranchOffice);
api.get('/getBranchOffices', mdAuth.ensureAuth, sucursalesController.getBranchOffices);

module.exports = api;