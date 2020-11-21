/*
const artistList = [{name: "the doors"},
                    {name: "anderson paak"},
                    {name: "tyler"}];
*/
const mongoose = require('mongoose');
const Product = require("../models/product.js");
const User = require("../models/user.js");
/*
let test_user = new User({
    email: "thedoors@mail.com",
    username: "the doors",
    password: "asd123asd",
    userType: "artist",
    bio: "rock 60s band"
});
test_user.save();
*/
//################ add new product ####################

const addNewProduct =async (req, res) => {
    console.log("new post product request from " + req.protocol + '://' + req.get('host') + req.originalUrl);
    let reqName = req.params.name;
    let reqId = parseInt(req.body.id);


    // verify identity of artits
    let artistIn = await User.findOne({'username':reqName, 'userType':'artist'}, (err) => {
        if(err) {
            console.error(err);
            res.status(500).json({ error: 'server error on the db, please retry' });
            return;
        }
    });

    if(!artistIn){
        res.status(404).json({ error: 'The artist ' + reqName + ' the name does not match with the product owner' });
        return;
    }

    //check if a product with this id already exists
    if (isNaN(reqId)) {
        res.status(400).json({ error: 'error: the product\'s id must be a non-empty number' });
        return;
    }

    let isIn = await Product.findOne({ id: reqId, owner: reqName }, function (err) {
        if (err) {
            res.status(500).json({ error: 'server error on the db, please retry'});
            return;
        }
        return;
    });

    if (isIn) {
     res.status(400).json({ error: 'There is already exists product with id ' + reqId + ' created by ' + reqName });
     return;
    }

     // check if input product data is valid
     let product = ({
        title: req.body.title,
        id: parseInt(req.body.id),
        description: req.body.description,
        qty: parseInt(req.body.qty),
        cost: parseFloat(req.body.cost),
        owner: reqName
    });

    if (!product.title || typeof product.title != 'string') {
        res.status(400).json({ error: 'error: the product\'s title must be a non-empty string' });
        return;
    }

    if (!product.description || typeof product.description != 'string') {
        res.status(400).json({ error: 'error: the product\'s description must be a non-empty string' });
        return;
    }

    if (isNaN(product.qty) || product.qty < 0) {
        res.status(400).json({ error: 'error: the product\'s quantity must be >= 0' });
        return;
    }

    if (isNaN(product.cost) || product.cost < 0.0) {
        res.status(400).json({ error: 'error: the product\'s cost must be >= 0' });
        return;
    }

    let newProduct = new Product(product);
    newProduct = await newProduct.save(function (err, result) {
        if (err)
            res.status(500).json({ error: err });
        else
            res.status(201).json({ message: "The product has been correctly inserted in the db with id " + result.id });
    });
};

//################ delete product ####################
const deleteProduct = async (req, res) => {
    console.log("new delete product request from " + req.protocol + '://' + req.get('host') + req.originalUrl);
    let reqName = req.params.name;
    let reqId = parseInt(req.params.id);

    // verify identity of artits
    let artistIn = await User.findOne({'username':reqName, 'userType':'artist'}, (err) => {
        if(err) {
            console.error(err);
            res.status(500).json({ error: 'server error on the db, please retry' });
            return;
        }
    });
    if(!artistIn){
        res.status(404).json({ error: 'The artist ' + reqName + ' the name does not match with the product owner' });
        return;
    }

    //check if a product with this id already exists
    let isIn = await Product.findOne({ id: reqId, owner: reqName }, function (err) {
        if (err)
            if (err.kind == "ObjectId")
                res.status(400).json({ error: "The id is not valid" });
            else
                res.status(500).json({ error: err });

        return;
    });

    if (!isIn) {
        res.status(404).json({ error: 'There is no product with id ' + reqId + ' created by ' + reqName });
        return;
    }

    await Product.deleteOne({ owner: reqName, id: reqId }, (err) => {
        if (err)
            res.status(500).json({ error: err });
        else
            res.status(200).json({ message: 'the product has been correctly deleted from the db' });
    });

};

//################ change the product data ####################
const changeProductData = async (req, res) => {
    console.log("new put product request from " + req.protocol + '://' + req.get('host') + req.originalUrl);
    let reqName = req.params.name;
    let reqId = parseInt(req.params.id);

    // verify identity of artits
    let artistIn = await User.findOne({'username':reqName, 'userType':'artist'}, (err) => {
        if(err) {
            console.error(err);
            res.status(500).json({ error: 'server error on the db, please retry' });
            return;
        }
    });
    if(!artistIn){
        res.status(404).json({ error: 'The artist ' + reqName + ' the name does not match with the product owner' });
        return;
    }

    //check if a product with this id already exists
    let isIn = await Product.findOne({ id: reqId, owner: reqName }, function (err) {
        if (err)
            if (err.kind == "ObjectId")
                res.status(400).json({ error: "The id is not valid" });
            else
                res.status(500).json({ error: err });

        return;
    });

    if (!isIn) {
        res.status(404).json({ error: 'There is no product with id ' + reqId + ' created by ' + reqName });
        return;
    }

    // check if input product data is valid
    let newProduct = {
        title: req.body.title,
        description: req.body.description,
        qty: parseInt(req.body.qty),
        cost: parseFloat(req.body.cost)
    }

    if (newProduct.title != undefined && (!newProduct.title || typeof newProduct.title != 'string')) {
        res.status(400).json({ error: "The field 'title' must be a non-empty string" });
        return;
    }

    if (newProduct.description != undefined && (!newProduct.description || typeof newProduct.description != 'string')) {
        res.status(400).json({ error: "The field 'description' must be a non-empty string" });
        return;
    }

    if (newProduct.qty != undefined) {
        newProduct.qty = parseInt(newProduct.qty);
        if (isNaN(newProduct.qty) || newProduct.qty < 0) {
            res.status(400).json({ error: "The field 'quantity' must be a integer number greater than zero" });
            return;
        }
    }

    if (newProduct.cost != undefined) {
        newProduct.cost = parseFloat(newProduct.cost);
        if (isNaN(newProduct.cost) || newProduct.cost < 0.0) {
            res.status(400).json({ error: "The field 'cost' must be a decimal number greater than zero" });
            return;
        }
    }

    //Data insertion
    if (newProduct.title) {
        await Product.updateOne({ id: reqId, owner: reqName }, { $set: { 'title': newProduct.title} }, (err) => {
            if (err) {
                res.status(500).json({ error: 'Error updating the db' });
                return;
            }
        });
    }

    if (newProduct.description) {
       await Product.updateOne({ id: reqId, owner: reqName }, { $set: { 'description': newProduct.description } }, (err) => {
            if (err) {
                res.status(500).json({ error: 'Error updating the db' });
                return;
            }
        });
    }

    if (!isNaN(newProduct.qty)) {
       await Product.updateOne({ id: reqId, owner: reqName }, { $set: { 'qty': newProduct.qty } }, (err) => {
            if (err) {
                res.status(500).json({ error: 'Error updating the db' });
                return;
            }
        });
    }

    if (!isNaN(newProduct.cost)) {
       await Product.updateOne({ id: reqId, owner: reqName }, { $set: { 'cost': newProduct.cost } }, (err) => {
            if (err) {
                res.status(500).json({ error: 'Error updating the db' });
                return;
            }
        });
    }

    res.status(201).json({ message: 'Product updated successfully' });

};

// ######### get product data ##########
const getProduct = async (req, res) => {
    let reqName = req.params.name;
    let reqId = parseInt(req.params.id);
   await Product.findOne({ owner: reqName, id: reqId }, function (err, product) {
        if (err) {
            console.error(err);
        } else if (product) {
            res.status(200).json(product);
        } else {
            res.status(400).json({ error: "this product is not present in the db" });
        }
    });
}

module.exports = {
    addNewProduct,
    deleteProduct,
    changeProductData,
    getProduct
};
