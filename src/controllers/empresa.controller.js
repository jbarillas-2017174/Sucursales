'use strict'

const empresa = require('../models/empresa.model');


exports.pruebaEmpresa = async(req, res) =>{
    await res.send({message: 'Controller run'}); 
}