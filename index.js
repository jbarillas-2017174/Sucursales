'use strict'

const mongoConfig = require('./configs/mongoConfig');
const app = require('./configs/app');
const port = 3000;
const empresaController = require('./src/controllers/empresa.controller');

mongoConfig.init();


app.listen(port,()=>{
    console.log(`Server running in port ${port}`);
});
