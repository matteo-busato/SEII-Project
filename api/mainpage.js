const User = require('../models/user.js');
const Album = require('../models/album.js');
const Event = require('../models/event.js');
const Product = require('../models/product.js');


//return the general overview of contents for the mainpage
// URI : api/v1/overview ; api/v1/overview/:name
const getOverview = async (req, res) => {
    var name = req.params.name;
    var message = {};

    //check if the requested artist stays in db
    let user = await User.findOne({ 'username': name }, (err) => {
        if (err) {
            res.status(500).json({ error: err });
            return;
        }
    });
    if(user){
        message.artists = user.followed;
    }else{
        message.artists = [];
    }

    let albumData = await Album.find({}, function (err, album) {
        if (err) {
            res.status(500).json({ message: "error getting albums." });
            return;
        }
    }).sort({"year":-1});
    var albums = [];
    for (let i = 0; i < albumData.length; i++) {
        albums[i] = { title: albumData[i].title, ismn: albumData[i].ismn };
    }
    message.albums = albums;


    let eventData = await Event.find({}, function (err) {
        if (err) {
            res.status(500).json({ message: "error getting events." });
            return;
        }
    }).sort({"date":-1});
    var events = [];
    for (let i = 0; i < eventData.length; i++) {
        events[i] = { title: eventData[i].title, id: eventData[i].id };
    }
    message.events = events;

    let products = await Product.find({}, function (err) {
        if (err) {
            res.status(500).json({ message: "error getting merch." });
            return;
        }
    });
    var merch = [];
    for (let i = 0; i < products.length; i++) {
        merch[i] = { title: products[i].title, id: products[i].id };
    }
    message.merch = merch;

    res.status(200).json(message);
}


module.exports = {
    getOverview
}