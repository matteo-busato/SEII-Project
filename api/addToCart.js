const User = require('../models/user');
const Album = require("../models/album.js");
const Event = require("../models/event.js");
const Merch = require("../models/product.js");
const album = require('../models/album.js');

/*
*   Add to cart a product.
*   POST /Cart/type/:type/id/:id
*/
const addToCart = async (req, res) => {

    if (!req.loggedUser) {
        res.status(401).json({ error: "Please authenticate first" });
        return;
    }

    //type of product : album,event,merch
    let type = req.params.type;
    //identification number of product. It can be the ismn for the album, here i will call it as id.
    let id = req.params.id;
    //user who want to add to cart the product
    let user = req.loggedUser.username;

    // check if input id is valid
    if (isNaN(parseInt(id))) {
        res.status(400).json({ error: 'error: the id must be a non-empty number' });
        return;
    }


    if (type == "album") {    //the product is an album

        let album = await Album.findOne({ ismn: parseInt(id) }, function (err) {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'server error searching for the id in the db, please retry' });
                return;
            }
            return;
        });
        if (!album) {
            res.status(400).json({ error: 'error: this id is not present in the db, please check the id' });
            return;
        }
        // create input album
        const toCart = {
            type: "album",
            id: id,
            title: album.title,
            cost: album.cost
        };

        User.findOneAndUpdate({ username: user }, { $push: { cart: toCart } }, (err) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'server error on adding to cart this product, please retry' });
                return;
            } else {
                res.status(200).json({ message: 'you added ' + type + ' with id: ' + id });
                return;
            }
        });


    } else if (type == "event") {  //the product is an event

        let event = await Event.findOne({ id: parseInt(id) }, function (err) {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'server error searching for the id in the db, please retry' });
                return;
            }
            return;
        });
        if (!event) {
            res.status(400).json({ error: 'error: this id is not present in the db, please check the id' });
            return;
        }


        // create input album
        const toCart = {
            type: "event",
            id: id,
            title: event.title,
            cost: event.cost
        };

        User.findOneAndUpdate({ username: user }, { $push: { cart: toCart } }, (err) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'server error on adding to cart this product, please retry' });
                return;
            } else {
                res.status(200).json({ message: 'you added ' + type + ' with id: ' + id });
                return;
            }
        });




    } else {      //the product is a merch

        let product = await Merch.findOne({ id: parseInt(id) }, function (err) {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'server error searching for the id in the db, please retry' });
                return;
            }
            return;
        });
        if (!product) {
            res.status(400).json({ error: 'error: this id is not present in the db, please check the id' });
            return;
        }


        // create input album
        const toCart = {
            type: "merch",
            id: id,
            title: product.title,
            cost: product.cost
        };

        User.findOneAndUpdate({ username: user }, { $push: { cart: toCart } }, (err) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'server error on adding to cart this product, please retry' });
                return;
            } else {
                res.status(200).json({ message: 'you added ' + type + ' with id: ' + id });
                return;
            }
        });
    }
}

/*
*   delete from cart a product.
*   DELETE /Cart/type/:type/id/:id
*/
const deleteFromCart = async (req, res) => {
    if (!req.loggedUser) {
        res.status(401).json({ error: "Please authenticate first" });
        return;
    }

    //type of product : album,event,merch
    let type = req.params.type;
    //identification number of product. It can be the ismn for the album, here i will call it as id.
    let id = req.params.id;
    //user who want to add to cart the product
    let user = req.loggedUser.username;

    // check if input id is valid
    if (isNaN(parseInt(id))) {
        res.status(400).json({ error: 'error: the id must be a non-empty number' });
        return;
    }

    if (type == "album") {    //the product is an album

        let album = await Album.findOne({ ismn: parseInt(id) }, function (err) {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'server error searching for the id in the db, please retry' });
                return;
            }
            return;
        });
        if (!album) {
            res.status(400).json({ error: 'error: this id is not present in the db, please check the id' });
            return;
        }
        // create input album
        const toCart = {
            type: "album",
            id: id,
            title: album.title,
            cost: album.cost
        };

        User.findOneAndUpdate({ username: user }, { $pull: { cart: toCart } }, (err) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'server error on deleting from cart this product, please retry' });
                return;
            } else {
                res.status(200).json({ message: 'you deleted ' + type + ' with id: ' + id });
                return;
            }
        });


    } else if (type == "event") {  //the product is an event

        let event = await Event.findOne({ id: parseInt(id) }, function (err) {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'server error searching for the id in the db, please retry' });
                return;
            }
            return;
        });
        if (!event) {
            res.status(400).json({ error: 'error: this id is not present in the db, please check the id' });
            return;
        }


        // create input album
        const toCart = {
            type: "event",
            id: id,
            title: event.title,
            cost: event.cost
        };

        User.findOneAndUpdate({ username: user }, { $pull: { cart: toCart } }, (err) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'server error on deleting from cart this product, please retry' });
                return;
            } else {
                res.status(200).json({ message: 'you deleted ' + type + ' with id: ' + id });
                return;
            }
        });

    } else {      //the product is a merch

        let product = await Merch.findOne({ id: parseInt(id) }, function (err) {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'server error searching for the id in the db, please retry' });
                return;
            }
            return;
        });
        if (!product) {
            res.status(400).json({ error: 'error: this id is not present in the db, please check the id' });
            return;
        }


        // create input album
        const toCart = {
            type: "merch",
            id: id,
            title: product.title,
            cost: product.cost
        };

        User.findOneAndUpdate({ username: user }, { $pull: { cart: toCart } }, (err) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'server error on deleting from cart this product, please retry' });
                return;
            } else {
                res.status(200).json({ message: 'you deleted ' + type + ' with id: ' + id });
                return;
            }
        });
    }
}

module.exports = {
    addToCart,
    deleteFromCart
}