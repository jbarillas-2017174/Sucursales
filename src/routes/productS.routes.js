'use strict'

const productsController = require('../controllers/productosS.controller');
const mdAuth = require('../services/authenticated');
const express = require('express');
const api = express.Router();


api.post('/createProduct/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], productsController.createProduct);
api.get('/getProduct', [mdAuth.ensureAuth, mdAuth.isAdmin], productsController.getProduct);

module.exports = api