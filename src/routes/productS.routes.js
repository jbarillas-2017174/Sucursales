'use strict'

const productsController = require('../controllers/productosS.controller');
const mdAuth = require('../services/authenticated');
const express = require('express');
const api = express.Router();


api.post('/createProduct/:id', mdAuth.ensureAuth, productsController.createProduct);

module.exports = api