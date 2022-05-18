
'use strict'

const productsController = require ('../controllers/productsC.controller');
const mdAuth = require('../services/authenticated');
const express = require('express');
const api = express.Router();

api.post('/saveProduct', mdAuth.ensureAuth, productsController.saveProducts);


module.exports = api; 