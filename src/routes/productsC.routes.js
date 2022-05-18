
'use strict'

const productsController = require ('../controllers/productsC.controller');
const mdAuth = require('../services/authenticated');
const express = require('express');
const api = express.Router();

api.post('/saveProduct', mdAuth.ensureAuth, productsController.saveProduct);
api.delete('/deleteProduct/:id', mdAuth.ensureAuth, productsController.deleteProduct);
api.put('/updateProduct/:id', mdAuth.ensureAuth, productsController.updateProduct);


module.exports = api; 