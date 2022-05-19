'use strict'

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const empresaRoutes = require('../src/routes/empresa.routes');
const sucursalesRoutes = require('../src/routes/sucursales.routes');




const app = express(); 

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(helmet());
app.use(cors());
app.use('/empresa', empresaRoutes);
app.use('/sucursales', sucursalesRoutes);


module.exports = app;