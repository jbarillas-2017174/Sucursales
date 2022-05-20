'use strict'

const moongose = require('mongoose');

const empresaSchema = moongose.Schema({
    name: String, 
    typeOfCompany: String, 
    town: String,  
    password: String,
    role: String
})

module.exports = moongose.model('Empresa', empresaSchema);



