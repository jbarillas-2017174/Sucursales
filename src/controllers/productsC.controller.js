'use strict'

const ProductsC = require('../models/productsC.model');
const { validateData } = require('../utils/validate');
const jwt = require('../services/jwt');


exports.saveProducts = async (req,res) =>{
    try{
        const params = req.body;
        const data = {
            nameProduct: params.nameProduct,
            nameProvider: params.nameProvider,
            stock: params.stock,
            company: req.user.sub
        }

        let msg = validateData(data);
        if(msg) return res.status(400).send(msg)
        if(!msg){
        let productSaved = new ProductsC(data);
        await productSaved.save();
        return res.send({message:'Product Saved!', productSaved})
        }
    }catch(err){
        console.log(err)
        return res.status(500).send({ message: 'Error saving product'});
    }     
}

exports.deleteProduct = async(req,res)=>{
    try{
        const productId = req.params.id;
         const product = await ProductsC.findOne({_id: productId});
         if(product.company != req.user.sub) return res.status(403).send({message: 'You dont have permission to delete this product'});
        const productDeleted  = await ProductsC.findOneAndDelete({_id: productId});
        if(!productDeleted) return res.send({message: 'Product not found or already deleted'});
        return res.send({message: 'Product Deleted:', productDeleted});
        
    }catch(err){
        console.log(err)
        return res.status(500).send({ message: 'Error removing products'})
    }
}

// getProduct & getProducts
// const product = await ProductsC.findOne({company: req.user.sub})
// if(!product) return res.status(404).send({message: 'product not found'})
