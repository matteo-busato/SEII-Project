// ########## MODULE FOR USER STORY #14 ############
// lets artits add new products, change data of existing products, deleting products
const mongoose = require('mongoose');
const Product = require("../models/product.js");
const User = require("../models/user.js");

/*
let test_user = new User({
    email: "ale@ale.com",
    username: "ale",
    password: "123",
    userType: "artist",
    bio: "the bomber"
});
test_user.save();
*/

//################ add new product ####################
// function for adding product to merch with post method
const addNewProduct =async (req, res) => {
    console.log("new post product request from " + req.protocol + '://' + req.get('host') + req.originalUrl);
    let reqName = req.params.name;
    let reqId = parseInt(req.body.id);

    //check if the user is logged
    if(!req.loggedUser){
        res.status(401).json({error: "Please authenticate first"});
        return;
    }

    //check the user's identity
    if(req.loggedUser.userType != 'artist'){
        res.status(401).json({error: "You must be an artist to access this page"});
        return;
    }

    if(req.loggedUser.username != reqName){
        res.status(401).json({error: "You can't add an product for this artist"});
        return;
    }

    // check if the artist exists in the db
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

    if (isNaN(reqId)) {
        res.status(400).json({ error: 'error: the product\'s id must be a non-empty number' });
        return;
    }

    //check if a product with this id already exists
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

     //input new product data
     let product = ({
        title: req.body.title,
        id: parseInt(req.body.id),
        description: req.body.description,
        qty: parseInt(req.body.qty),
        cost: parseFloat(req.body.cost),
        owner: reqName
    });

    // check if input product data is valid
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

    //create and insert the new product
    let newProduct = new Product(product);
    newProduct = await newProduct.save(function (err, result) {
        if (err)
            res.status(500).json({ error: err });
        else
            res.status(201).json({ message: "The product has been correctly inserted in the db with id " + result.id });
    });
};

//################ delete product ####################
// function for deleting product from merch with delete method
const deleteProduct = async (req, res) => {
    console.log("new delete product request from " + req.protocol + '://' + req.get('host') + req.originalUrl);
    let reqName = req.params.name;
    let reqId = parseInt(req.params.id);

    // check if the user is logged
    if(!req.loggedUser){
        res.status(401).json({error: "Please authenticate first"});
        return;
    }

    //check the user's identity
    if(req.loggedUser.userType != 'artist'){
        res.status(401).json({error: "You must be an artist to access this page"});
        return;
    }

    if(req.loggedUser.username != reqName){
        res.status(401).json({error: "You can't delete an product for this artist"});
        return;
    }

    //check if the artist exists in the db
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

    //delete the product
    await Product.deleteOne({ owner: reqName, id: reqId }, (err) => {
        if (err)
            res.status(500).json({ error: err });
        else
            res.status(200).json({ message: 'the product has been correctly deleted from the db' });
    });

};

//################ change the product data ####################
// function for changing product's data with put method
const changeProductData = async (req, res) => {
    console.log("new put product request from " + req.protocol + '://' + req.get('host') + req.originalUrl);
    let reqName = req.params.name;
    let reqId = parseInt(req.params.id);

    // check if the user is logged
    if(!req.loggedUser){
        res.status(401).json({error: "Please authenticate first"});
        return;
    }

    //check the user's identity
    if(req.loggedUser.userType != 'artist'){
        res.status(401).json({error: "You must be an artist to access this page"});
        return;
    }

    if(req.loggedUser.username != reqName){
        res.status(401).json({error: "You can't change an product for this artist"});
        return;
    }

    //check if the artist exists in the db
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


    let newProduct = {
        title: req.body.title,
        description: req.body.description,
        qty: req.body.qty,
        cost: req.body.cost
    }

    // check if input product data is valid
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

    //data insertion
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
// function for getting product data with get method
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
