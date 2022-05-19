'use strict'

const sucursalesController = require('../controllers/sucursales.controller');
const express = require('express');
const api = express.Router();
const mdAuth = require('../services/authenticated');

api.get('/pruebaSucursales', sucursalesController.pruebaSucursales);
api.post('/saveBranchOffice', [mdAuth.ensureAuth, mdAuth.isAdmin], sucursalesController.saveBranchOffice);
api.delete('/deleteBranchOffice/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], sucursalesController.deleteBranchOffice);
api.put('/updateBranchOffice/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], sucursalesController.updateBranchOffice);
api.get('/getBranchOffice/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], sucursalesController.getBranchOffice);
api.get('/getBranchOffices', [mdAuth.ensureAuth, mdAuth.isAdmin], sucursalesController.getBranchOffices);

module.exports = api;