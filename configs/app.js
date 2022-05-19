'use strict'

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const empresaRoutes = require('../src/routes/empresa.routes');
const sucursalRoutes = require('../src/routes/sucursales.routes');
const productCRoutes = require('../src/routes/productsC.routes');




const app = express(); 

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(helmet());
app.use(cors());
app.use('/empresa', empresaRoutes);
app.use('/sucursal', sucursalRoutes);
app.use('/productC', productCRoutes);



module.exports = app;