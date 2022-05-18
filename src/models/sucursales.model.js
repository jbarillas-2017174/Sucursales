'use strict'

const { default: mongoose } = require('mongoose');
const moongose = require('mongoose');

const sucursalesSchema = moongose.Schema({
    name: String,
    address: String,
    idEmpresa: {type: mongoose.Schema.ObjectId, ref: 'Empresa'}
});

module.exports = moongose.model('Sucursales', sucursalesSchema);