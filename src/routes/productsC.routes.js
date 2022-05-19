
'use strict'

const productsController = require ('../controllers/productsC.controller');
const mdAuth = require('../services/authenticated');
const express = require('express');
const api = express.Router();

api.post('/saveProduct', [mdAuth.ensureAuth, mdAuth.isAdmin], productsController.saveProduct);
api.delete('/deleteProduct/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], productsController.deleteProduct);
api.put('/updateProduct/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], productsController.updateProduct);
api.get('/getProduct/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], productsController.getProduct);
api.get('/getProducts', [mdAuth.ensureAuth, mdAuth.isAdmin], productsController.getProducts);


module.exports = api; 