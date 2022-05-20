
'use strict'

const mongoose = require('mongoose');

const productsCSchema = mongoose.Schema({
    nameProduct: String,
    nameProvider: String,
    stock: Number,
    company: {type: mongoose.Schema.ObjectId, ref: 'Empresa'}
})

module.exports = mongoose.model('ProductsC', productsCSchema);