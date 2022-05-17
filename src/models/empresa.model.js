'use strict'

const moongose = require('mongoose');

const empresaSchema = moongose.Schema({
    name: String, 
    typeOfCompany: String, 
    municipality: String,  
    password: String
})

module.exports = moongose.model('Empresa', empresaSchema);



