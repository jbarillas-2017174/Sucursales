'use strict'

const ProductsC = require('../models/productsC.model');
const { validateData } = require('../utils/validate');
const jwt = require('../services/jwt');
const Sucursales = require('../models/sucursales.model')


exports.saveProduct = async (req, res) => {
    try {
        const params = req.body;
        const data = {
            nameProduct: params.nameProduct,
            nameProvider: params.nameProvider,
            stock: params.stock,
            company: req.user.sub
        }
        const already = await ProductsC.findOne({nameProduct: params.nameProduct, company: data.company});
        if(already) return res.status(400).send({message: 'Product already'});
        let msg = validateData(data);
        if (msg) return res.status(400).send(msg)
        if (!msg) {
            let productSaved = new ProductsC(data);
            await productSaved.save();
            return res.send({ message: 'Product Saved!', productSaved })
        }
    } catch (err) {
        console.log(err)
        return res.status(500).send({ message: 'Error saving product' });
    }
}

exports.deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await ProductsC.findOne({ _id: productId });
        if (product.company != req.user.sub) return res.status(403).send({ message: 'You dont have permission to delete this product' });
        const productDeleted = await ProductsC.findOneAndDelete({ _id: productId });
        if (!productDeleted) return res.send({ message: 'Product not found or already deleted' });
        return res.send({ message: 'Product Deleted:', productDeleted });

    } catch (err) {
        console.log(err)
        return res.status(500).send({ message: 'Error removing products' })
    }
}

exports.updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await ProductsC.findOne({ _id: productId });
        const params = req.body
        if (Object.entries(params).length === 0) return res.status(400).send({ message: 'No parameters to update,enter one' });
        if (product.company != req.user.sub) return res.status(403).send({ message: 'You do not have permission to update this product' });
        const check = await ProductsC.find({ company: req.user.sub });
        if (!check) return res.status(500).send({ message: 'Action not authorized' });
        const productUpdated = await ProductsC.findOneAndUpdate({ _id: productId }, params, { new: true })
        return res.send({ message: 'Updated product!', productUpdated });

    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error when editing products' });

    }
}

exports.getProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await ProductsC.findOne({ _id: productId });
        if(product.company != req.user.sub){
        return res.status(403).send({message: 'This product was not found in your company'});   
        } else {
            const searchProduct = await ProductsC.findOne({_id: productId}); 
        return res.send({message: 'Product Found', searchProduct});}
    } catch (err) {
        console.log(err);
        return res.status(500).send({message: 'Error getting products'})

    }

}

exports.getProducts = async (req, res) => {
    try {
        const searchProduct = await ProductsC.find({company: req.user.sub}).sort({stock: -1});
        return res.send({message: 'Products Found:', searchProduct});
    } catch (err) {
        console.log(err);
        return res.status(500).send({message: 'Error getting products'})

    }

}
