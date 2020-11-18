const artistList = [{name: "the doors"},
                    {name: "anderson paak"},
                    {name: "tyler"}];

const mongoose = require('mongoose');
const Product = require("../models/product.js");

//################ add new product ####################
//URI : /api/v1/artists/:name/merch
const addNewProduct = (req, res) => {
    console.log("new post product request from " + req.protocol + '://' + req.get('host') + req.originalUrl);
    let reqName = req.params.name;

    // verify identity of artits
    let found = false;
    artistList.forEach(element => {
        if (element.name == reqName) {
            found = true;
        }
    });
    if (!found) {
        res.status(400).json({ error: 'this artist does not exist' });
        return;
    }

    // create and check validity of input product
    let product = new Product ({
        title: req.body.title,
        id: parseInt(req.body.id),
        description: req.body.description,
        qty: parseInt(req.body.qty),
        cost: parseFloat(req.body.cost),
        owner: reqName
    });

    if (!product.title || typeof product.title != 'string') {
        res.status(400).json({ error: 'error: the product\'s title must be a non-empty string' });
        return false;
    }

    //yet to be implemented! check if id is already present
    if (isNaN(product.id)) {
        res.status(400).json({ error: 'error: the product\'s id must be a non-empty number' });
        return false;
    }

    if (!product.description || typeof product.description != 'string') {
        res.status(400).json({ error: 'error: the product\'s description must be a non-empty string' });
        return false;
    }

    if (isNaN(product.qty)) {
        res.status(400).json({ error: 'error: the product\'s quantity must be a non-empty number' });
        return false;
    }

    if (isNaN(product.cost)) {
        res.status(400).json({ error: 'error: the product\'s cost must be a non-empty number' });
        return false;
    }

    product.save((err) => {
        if (err) {
            console.error("error inserting product in the db: " + err);
        }
    });
    res.status(200).json({ message: 'the product has been correctly inserted in the db with ID = ' + product.id });
};

//################ delete product ####################
//URI : /api/v1/artists/:name/merch/:id
const deleteProduct = (req, res) => {
    console.log("new delete product request from " + req.protocol + '://' + req.get('host') + req.originalUrl);
    let reqName = req.params.name;
    let reqId = parseInt(req.params.id);

    // verify identity of artits
    let found = false;
    artistList.forEach(element => {
        if (element.name == reqName) {
            found = true;
        }
    });
    if (!found) {
        res.status(400).json({ error: 'artist name does not match owner' });
        return;
    }

    Product.deleteOne({ owner: reqName, id: reqId }, (err) => {
        if (err) {
            console.error(err);
            res.status(400).json({ error: 'error: this product does not exist in the db' });
        } else {
            res.status(200).json({ message: 'the product has been correctly deleted from the db' });
        }
    });
};

//################ change the product data ####################
//URI : /api/v1/artists/:name/merch/:id
const changeProductData = (req, res) => {
    console.log("new put product request from " + req.protocol + '://' + req.get('host') + req.originalUrl);
    let reqName = req.params.name;
    let reqId = parseInt(req.params.id);

    // verify identity of artits
    let found = false;
    artistList.forEach(element => {
        if (element.name == reqName) {
            found = true;
        }
    });
    if (!found) {
        res.status(400).json({ error: 'artist name does not match owner' });
        return;
    }

    let isIn = Product.findOne({ id: reqId, owner: reqName }, function (err) {
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
        qty: parseInt(req.body.qty),
        cost: parseFloat(req.body.cost)
    }

    console.log("NEW PRODUCT = ", newProduct);

    //Errors checks
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
        Product.updateOne({ id: reqId, owner: reqName }, { $set: { 'title': newProduct.title} }, (err) => {
            if (err) {
                res.status(500).json({ error: 'Error updating the db' });
                return;
            }
        });
    }

    if (newProduct.description) {
        Product.updateOne({ id: reqId, owner: reqName }, { $set: { 'description': newProduct.description } }, (err) => {
            if (err) {
                res.status(500).json({ error: 'Error updating the db' });
                return;
            }
        });
    }

    if (!isNaN(newProduct.qty)) {
        Product.updateOne({ id: reqId, owner: reqName }, { $set: { 'qty': newProduct.qty } }, (err) => {
            if (err) {
                res.status(500).json({ error: 'Error updating the db' });
                return;
            }
        });
    }

    if (!isNaN(newProduct.cost)) {
        Product.updateOne({ id: reqId, owner: reqName }, { $set: { 'cost': newProduct.cost } }, (err) => {
            if (err) {
                res.status(500).json({ error: 'Error updating the db' });
                return;
            }
        });
    }

    res.status(201).json({ message: 'Product updated successfully' });
    
};

// ######### get product data ##########
const getProduct = (req, res) => {
    let reqName = req.params.name;
    let reqId = parseInt(req.params.id);
    Product.findOne({ owner: reqName, id: reqId }, function (err, product) {
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
