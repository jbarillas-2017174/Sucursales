'use strict'

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const empresaRoutes = require('../src/routes/empresa.routes');
const productsCRoutes = require('../src/routes/productsC.routes')



const app = express(); 

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(helmet());
app.use(cors());
app.use('/empresa', empresaRoutes);
app.use('/productsC', productsCRoutes);


module.exports = app;