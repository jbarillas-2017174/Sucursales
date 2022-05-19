"use strict";

const { default: mongoose } = require("mongoose");
const moongose = require("mongoose");

const productsSSchema = moongose.Schema({
  name: String,
  stock: Number,
  cantidadV: Number,
  idSucursal: {type: mongoose.Schema.ObjectId, ref: 'Sucursales'}
});

module.exports = moongose.model("productsS", productsSSchema);
