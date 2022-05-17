'use strict'

const moongose = require('mongoose');

const sucursalesSchema = moongose.Schema({
    name: String,
    address: String,
    idEmpresa: req.user.sub
});

module.exports = moongose.model('Sucursales', sucursalesSchema);