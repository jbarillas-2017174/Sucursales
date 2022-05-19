'use strict'

const { default: mongoose } = require('mongoose');
const moongose = require('mongoose');

const sucursalesSchema = moongose.Schema({
    name: String,
    address: String,
    idEmpresa: {type: mongoose.Schema.ObjectId, ref: 'Empresa'},
    productoS:[
        {
            producto: {type: mongoose.Schema.ObjectId, ref: 'ProductsC'},
            name: String,
            stock: Number,
            cantidadV: Number,
         }


    ]
});

module.exports = moongose.model('Sucursales', sucursalesSchema);