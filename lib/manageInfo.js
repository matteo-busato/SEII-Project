
const { json } = require('body-parser');
const mongoose = require('mongoose');
const User = require("../models/user.js");
const Album = require("../models/album.js");
const Event = require("../models/event.js");
const Product = require("../models/product.js");

// ADD PRODUCT IN THE DB
// let prova_product = new Product({
//         title: "Hat",
//         id: "12",
//         description: "asdadsa",
//         qty: "122",
//         cost: "12",
//         owner: "Pantera"
//     });
// prova_product.save();

// ADD ALBUM IN THE DB
// let prova_album = new Album({
//         ismn: "12",
//         title: "CFH",
//         owner: "Pantera",
//         year: "1992",
//         genre: "Trash",
//         tracklist: "1",
//         cost: "12"
//     });
// prova_album.save();

// ADD USER IN THE DB
// let prova_user = new User({
        // email: "Pantera@me.com",
        // username: "Pantera",
        // password: "",
        // userType: "",
        // bio: ""
//     });
//     prova_user.save();

// ADD EVENT IN THE DB
// let prova_event = new Event({
//         id: "12",
//         title: "CFH Fest",
//         date: "12/01/2020",
//         place: "Cosenza",
//         description: "Trash Fest",
//         cost: "12",
//         owner: "Pantera"
//     });
// prova_event.save();

const getInfo  = (req, res) => {
    console.log("new get artist info request from " + req.protocol + '://' + req.get('host') + req.originalUrl);
    let artistName = req.params.name;
    User.findOne({ username: artistName}, function (err, user) {
        if (err) {
            console.error(err);
        } else if (user) {
            res.status(200).json(user);
            return;
        } else {
            res.status(400).json({ error: "this artist is not present in the db" });
            return;
        }
    });
};

const addInfo = async function(req, res) {
    console.log("new post artist info request from " + req.protocol + '://' + req.get('host') + req.originalUrl);
    let artistName = req.params.name;
     // verify identity of artits
     let artistIn = await User.findOne({'username':artistName, 'userType':'artist'}, (err) => {
        if(err) {
            console.error(err);
            res.status(500).json({ error: 'server error on the db, please retry' });
            return;
        }
    });
    if(!artistIn){
        console.log(artistIn);
        res.status(404).json({ error: 'The artist ' + artistName + ' does not exist' });
        return;
    } 
    let newArtistBio = req.body.bio;
    if (!newArtistBio || typeof newArtistBio != 'string') {
        res.status(400).json({ error: 'error: wrong data for the bio' });
        return;
    }

    await User.updateOne({username: artistName}, {$set: { bio: newArtistBio }} , function(err) {
        if (err) {
            console.error("error inserting artist info in the db: " + err);
            res.status(500).json({ error: 'server error on saving infos in the db, please retry' });
            return;
        } else {
            if(artistIn.bio != ''){
                res.status(300).json({ error: 'Some informations for the given artist are non-empty yet, you can try to modify it' });
                return;
            }
            res.status(201).json({ message: 'The artist info for ' + artistName + ' has been correctly inserted in the db' });
            return;
        }
    });
};


const deleteInfo = async function(req, res) {
    console.log("new delete info request from " + req.protocol + '://' + req.get('host') + req.originalUrl);
    let artistName = req.params.name;
    // verify identity of artits
    let artistIn = await User.findOne({'username':artistName, 'userType':'artist'}, (err) => {
        if(err) {
            console.error(err);
            res.status(500).json({ error: 'server error on the db, please retry' });
            return;
        }
    });
    if(!artistIn){
        res.status(404).json({ error: 'The artist ' + artistName + ' does not exist' });
        return;
    } 
    await User.updateOne({username: artistName}, {$set: { bio: "" }} , function(err) {
        if (err) {
            console.error("error deleting artist info in the db: " + err);
            res.status(500).json({ error: 'server error on deleting infos in the db, please retry' });
            return;
        } else {
            res.status(201).json({ message: 'The artist info for ' + artistName + ' has been correctly deleted in the db' });
            return;
        }
    });
};

const changeInfo = async function(req, res) {
    let artistName = req.params.name;
    // verify identity of artits
    let artistIn = await User.findOne({'username':artistName, 'userType':'artist'}, (err) => {
        if(err) {
            console.error(err);
            res.status(500).json({ error: 'server error on the db, please retry' });
            return;
        }
    });
    if(!artistIn){
        res.status(404).json({ error: 'The artist ' + artistName + ' does not exist' });
        return;
    } 
    let newArtistInfo = {
        email: req.body.newEmail,
        username: artistName,
        password: req.body.newPassword,
        userType: "artist",
        bio: req.body.newBio         
    }
    if(newArtistInfo.username == ''){
        newArtistInfo.username = artistIn.username;
    }
    if(newArtistInfo.password == ''){
        newArtistInfo.password = artistIn.password;
    }
    if(newArtistInfo.email == ''){
        newArtistInfo.email = artistIn.email;
    }
    if(newArtistInfo.bio == ''){
        newArtistInfo.bio = artistIn.bio;
    }
    await User.updateOne({username: artistName}, {$set: { bio: newArtistInfo.bio, password: newArtistInfo.password, email: newArtistInfo.email }} , function(err) {
        if (err) {
            console.error("error changing artist info in the db: " + err);
            res.status(500).json({ error: 'server error on changing infos in the db, please retry' });
            return;
        } else {
            res.status(201).json({ message: 'The artist info for ' + artistName + ' has been correctly changed in the db' });
            return;
        }
    });  
};

module.exports = {
    addInfo,
    deleteInfo,
    changeInfo,
    getInfo,
};

