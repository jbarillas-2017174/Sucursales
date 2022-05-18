
'use strict'

const mongoose = require('mongoose');

const productsCSchema = mongoose.Schema({
    nameProduct: String,
    nameProvider: String,
    stock: Number
})

module.exports = mongoose.model('ProductsC', productsCSchema);