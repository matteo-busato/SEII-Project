const User = require('../models/user');
const Album = require("../models/album.js");
const Event = require("../models/event.js");
const Merch = require("../models/product.js");

/*
*   Add to cart a product.
*   POST api/v1/cart/type/:type/id/:id
*/
const addToCart = async (req, res) => {

    //if the user is not logged
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

        //check if the album exists and get it's informations
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

        //push the album to the cart
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

        //check if the event exists and get it's informations
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

        //push the event to the cart
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




    } else if(type=="merch") {      //the product is a merch

        //check if the product exists and get it's informations
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

        //push the product to the cart
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
        
    }else{
        res.status(400).json({ error: 'error: this type is not present in the db, please check the type' });
    }
}

/*
*   delete from cart a product.
*   DELETE api/v1/cart/type/:type/id/:id
*/
const deleteFromCart = async (req, res) => {
    
    //if the user is not logged
    if (!req.loggedUser) {
        res.status(401).json({ error: "Please authenticate first" });
        return;
    }

    //type of product : album,event,merch
    let type = req.params.type;
    //identification number of product. It can be the ismn for the album, here i will call it as id.
    let id = req.params.id;
    //user who want to remove from cart the product
    let user = req.loggedUser.username;

    // check if input id is valid
    if (isNaN(parseInt(id))) {
        res.status(400).json({ error: 'error: the id must be a non-empty number' });
        return;
    }

    if (type == "album") {    //the product is an album

        //check if the album exists and get it's informations
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
        
        //pull the album from the cart
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

        //check if the event exists and get it's informations
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

        //pull the event from the cart
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

    } else if(type == "merch"){      //the product is a merch

        //check if the product exists and get it's informations
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

        //pull the product from the cart
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
    }else{
        res.status(400).json({ error: 'error: this type is not present in the db, please check the type' });
    }
}

/*
*   get cart list.
*   GET api/v1/cart/
*/
const getCartList = async (req, res) => {
    //if the user is not logged
    if (!req.loggedUser) {
        res.status(401).json({ error: "Please login first" });
        return;
    }

    //user who want to add to cart the product
    let user = req.loggedUser.username;

    //check if the requested artist stays in db
    let userDB = await User.findOne({ 'username': user }, (err) => {
        if (err) {
            res.status(500).json({ error: err });
            return;
        }
    });

    if (!userDB) {
        res.status(404).json({ error: 'The user ' + user + ' does not exist' });
        return;
    }

    res.status(200).json({message : userDB.cart});
}

module.exports = {
    addToCart,
    deleteFromCart,
    getCartList
}