"use strict";

const ProductoS = require("../models/productsS.model");
const ProductsC = require("../models/productsC.model");
const { validateData } = require("../utils/validate");

exports.createProduct = async (req, res) => {
  try {
    const idP = req.params.id;
    const params = req.body;
    const alreadyProduct = await ProductsC.findOne({ _id: idP });
    let data = {
      name: alreadyProduct.nameProduct,
      stock: params.stock,
      cantidadV: params.cantidadV,
      idSucursal: params.idSucursal,
    };
    let msg = validateData(data);
    if (msg) return res.send(msg);
    const already = await ProductoS.findOne({ name: data.name });
    let stockC = alreadyProduct.stock - parseInt(params.stock);
    console.log(already.stock, "+", parseInt(params.stock), "=");
    let stockT = already.stock + parseInt(params.stock);
    if (stockC < 0) {
      stockC = alreadyProduct.stock - (stockC + parseInt(params.stock));
      stockT = already.stock + alreadyProduct.stock;
    }
    

    await ProductsC.findOneAndUpdate(
      { _id: idP },
      { stock: stockC },
      { new: true }
    );
    if (already) {
      const product = await ProductoS.findOneAndUpdate(
        { _id: already._id },
        { stock: stockT },
        { new: true }
      );
      if (product) return res.send({ message: "Se guardo Producto" });
    } else {
      let productoS = new ProductoS(data);
      await productoS.save();
      return res.send({ message: "Se creo Producto" });
    }
  } catch (err) {
    console.log(err);
    return err;
  }
};
