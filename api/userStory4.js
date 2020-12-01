const User = require('../models/user.js');
const Album = require('../models/album.js');
const Event = require('../models/event.js');
const Product = require('../models/product.js');


//return all the artists
// URI : api/v1/artists
const getArtists = async (req, res) => {
    await User.find({ userType: "artist" }, function (err, users) {
        if (err) res.status(500).json({ message: "error getting users." });
        else {
            var message = [];
            for (let i = 0; i < users.length; i++) {
                message[i] = users[i].username;
            }
            res.status(200).json(message);
        }
    });
}

//return all the albums
// URI : api/v1/albums
const getAlbums = async (req, res) => {
    await Album.find(function (err, album) {
        if (err) res.status(500).json({ message: "error getting albums." });
        else {
            var message = [];
            for (let i = 0; i < album.length; i++) {
                message[i] = { title: album[i].title, ismn: album[i].ismn };
            }
            res.status(200).json(message);
        }
    });
}

//return all the merch
// URI : api/v1/merch
const getMerchs = async (req, res) => {
    await Product.find(function (err, product) {
        if (err) res.status(500).json({ message: "error getting merch." });
        else {
            var message = [];
            for (let i = 0; i < product.length; i++) {
                message[i] = { title: product[i].title, id: product[i].id };
            }
            res.status(200).json(message);
        }
    });
}

//return all the events
// URI : api/v1/events
const getEvents = async (req, res) => {
    await Event.find(function (err, event) {
        if (err) res.status(500).json({ message: "error getting events." });
        else {
            var message = [];
            for (let i = 0; i < event.length; i++) {
                message[i] = { title: event[i].title, id: event[i].id };
            }
            res.status(200).json(message);
        }
    });
}

//return the selected artist
// URI : api/v1/artists/:name
const getArtist = async (req, res) => {
    var name = req.params.name;
    var message = {};

    //check input params
    if (!name || typeof name != 'string') {
        res.status(400).json({ error: 'error on name param' });
        return;
    }

    //check if the requested artist stays in db
    let artist = await User.findOne({ 'username': name, 'userType': 'artist' }, (err) => {
        if (err) {
            res.status(500).json({ error: err });
            return;
        }
    });

    if (!artist) {
        res.status(404).json({ error: 'The artist ' + artist + ' does not exist' });
        return;
    }

    message.artist = {
        username: artist.username,
        bio: artist.bio
    };

    await Album.find({ owner: name }, function (err, album) {
        if (err) {
            res.status(500).json({ message: "error getting albums." });
            return;
        } else {
            var albums = [];
            for (let i = 0; i < album.length; i++) {
                albums[i] = { title: album[i].title, ismn: album[i].ismn };
            }
            message.albums = albums;
        }
    });

    await Event.find({ owner: name }, function (err, data) {
        if (err) {
            res.status(500).json({ message: "error getting events." });
            return;
        } else {
            var events = [];
            for (let i = 0; i < data.length; i++) {
                events[i] = { title: data[i].title, id: data[i].id };
            }
            message.events = events;
        }
    });

    let products = await Product.find({ owner: name }, function (err) {
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


//return the general overview of contents for the mainpage
// URI : api/v1/artists/overview
const getOverview = async (req, res) => {
    var message = {};

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

//return the selected album
// URI : api/v1/albums/:ismn
const getAlbum = async (req, res) => {
    var ismn = parseInt(req.params.ismn);

    //check input params
    if (isNaN(ismn)) {
        res.status(400).json({ error: 'error on ismn param' });
        return;
    }

    //check if the requested album stays in db
    let album = await Album.findOne({ 'ismn': ismn }, (err) => {
        if (err) {
            res.status(500).json({ error: err });
            return;
        }
    });

    if (!album) {
        res.status(404).json({ error: 'The album ' + ismn + ' does not exist' });
        return;
    }
    res.status(200).json(album);
}

//return the selected merch
// URI : api/v1/merch/:id
const getMerch = async (req, res) => {
    var id = parseInt(req.params.id);

    //check input params
    if (isNaN(id)) {
        res.status(400).json({ error: 'error on id param' });
        return;
    }

    //check if the requested prod stays in db
    let prod = await Product.findOne({ 'id': id }, (err) => {
        if (err) {
            res.status(500).json({ error: err });
            return;
        }
    });
    if (!prod) {
        res.status(404).json({ error: 'The product ' + id + ' does not exist' });
        return;
    }

    res.status(200).json(prod);
}

//return the selected event
// URI : api/v1/events/:id
const getEvent = async (req, res) => {
    var id = parseInt(req.params.id);
    //check input params
    if (isNaN(id)) {
        res.status(400).json({ error: 'error on id param' });
        return;
    }

    //check if the requested event stays in db
    let evento = await Event.findOne({ 'id': id }, (err) => {
        if (err) {
            res.status(500).json({ error: err });
            return;
        }
    });

    if (!evento) {
        res.status(404).json({ error: 'The event ' + id + ' does not exist' });
        return;
    }
    res.status(200).json(evento);
}

//return all the albums of a selected artists
// URI : api/v1/artists/:name/albums
const getArtistAlbums = async (req, res) => {
    let name = req.params.name;
    var message = {};
    //check input params
    if (!name || typeof name != 'string') {
        res.status(400).json({ error: 'error on name param' });
        return;
    }

    //check if the requested artist stays in db
    let artist = await User.findOne({ 'username': name, 'userType': 'artist' }, (err) => {
        if (err) {
            res.status(500).json({ error: err });
            return;
        }
    });

    if (!artist) {
        res.status(404).json({ error: 'The artist ' + artist + ' does not exist' });
        return;
    }

    message.artist = { username: artist.username };

    //check if the requested album stays in db
    let albums = await Album.find({ 'owner': name }, (err) => {
        if (err) {
            res.status(500).json({ error: err });
            return;
        }
    });

    if (!albums) {
        res.status(404).json({ error: 'no albums from artist with name : ' + name });
        return;
    }
    message.albums = albums;
    res.status(200).json(message);
}

//return all the merch of a selected artists
// URI : api/v1/artists/:name/merch
const getArtistMerch = async (req, res) => {
    let name = req.params.name;
    var message = {};

    //check input params
    if (!name || typeof name != 'string') {
        res.status(400).json({ error: 'error on name param' });
        return;
    }

    //check if the requested artist stays in db
    let artist = await User.findOne({ 'username': name, 'userType': 'artist' }, (err) => {
        if (err) {
            res.status(500).json({ error: err });
            return;
        }
    });

    if (!artist) {
        res.status(404).json({ error: 'The artist ' + artist + ' does not exist' });
        return;
    }

    message.artist = { username: artist.username };

    //check if the requested merch stays in db
    let merch = await Product.find({ 'owner': name }, (err) => {
        if (err) {
            res.status(500).json({ error: err });
            return;
        }
    });

    if (!merch) {
        res.status(404).json({ error: 'no merch from artist with name : ' + name });
        return;
    }
    message.merch = merch;
    res.status(200).json(message);
}

//return all the events of a selected artists
// URI : api/v1/artists/:name/events
const getArtistEvents = async (req, res) => {
    let name = req.params.name;
    var message = {};

    //check input params
    if (!name || typeof name != 'string') {
        res.status(400).json({ error: 'error on name param' });
        return;
    }

    //check if the requested artist stays in db
    let artist = await User.findOne({ 'username': name, 'userType': 'artist' }, (err) => {
        if (err) {
            res.status(500).json({ error: err });
            return;
        }
    });

    if (!artist) {
        res.status(404).json({ error: 'The artist ' + artist + ' does not exist' });
        return;
    }

    message.artist = { username: artist.username };

    //check if the requested events stays in db
    let events = await Event.find({ 'owner': name }, (err) => {
        if (err) {
            res.status(500).json({ error: err });
            return;
        }
    });

    if (!events) {
        res.status(404).json({ error: 'no events from artist with name : ' + name });
        return;
    }
    message.events = events;
    res.status(200).json(message);

}

//return  the ismn album of a selected artist
// URI : api/v1/artists/:name/albums/:ismn
const getArtistAlbumIsmn = async (req, res) => {
    let name = req.params.name;
    let ismn = parseInt(req.params.ismn);

    //check input params
    if (isNaN(ismn)) {
        res.status(400).json({ error: 'error on ismn param' });
        return;
    }
    if (!name || typeof name != 'string') {
        res.status(400).json({ error: 'error on name param' });
        return;
    }

    //check if the requested album stays in db
    let album = await Album.findOne({ 'ismn': ismn }, (err) => {
        if (err) {
            res.status(500).json({ error: err });
            return;
        }
    });

    //check if the requested artist stays in db
    let artist = await User.findOne({ 'username': name, 'userType': 'artist' }, (err) => {
        if (err) {
            res.status(500).json({ error: err });
            return;
        }
    });

    if (!artist) {
        res.status(404).json({ error: 'The artist ' + name + ' does not exist' });
        return;
    }

    if (!album) {
        res.status(404).json({ error: 'The album ' + ismn + ' does not exist' });
        return;
    }

    if (album.owner != name) {
        res.status(400).json({ error: 'The album ' + ismn + 'exists in db but the owner is not ' + name });
        return;
    }
    res.status(200).json(album);
}


// return the id merch of a selected artist
// URI : /api/v1/artists/:name/merch/:id
const getArtistMerchId = async (req, res) => {
    let name = req.params.name;
    let id = req.params.id;
    //check input params
    if (isNaN(id)) {
        res.status(400).json({ error: 'error on id param' });
        return;
    }
    if (!name || typeof name != 'string') {
        res.status(400).json({ error: 'error on name param' });
        return;
    }

    //check if the requested prod stays in db
    let prod = await Product.findOne({ 'id': id }, (err) => {
        if (err) {
            res.status(500).json({ error: err });
            return;
        }
    });

    //check if the requested artist stays in db
    let artist = await User.findOne({ 'username': name, 'userType': 'artist' }, (err) => {
        if (err) {
            res.status(500).json({ error: err });
            return;
        }
    });

    if (!prod) {
        res.status(404).json({ error: 'The product ' + id + ' does not exist' });
        return;
    }

    if (!artist) {
        res.status(404).json({ error: 'The artist ' + name + ' does not exist' });
        return;
    }

    if (prod.owner != name) {
        res.status(400).json({ error: 'The product ' + id + 'exists in db but the owner is not ' + name });
        return;
    }

    res.status(200).json(prod);
}

// return the id event of a selected artist
// URI : /api/v1/artists/:name/events/:id
const getArtistEventId = async (req, res) => {
    let name = req.params.name;
    let id = req.params.id;

    //check input params
    if (isNaN(id)) {
        res.status(400).json({ error: 'error on id param' });
        return;
    }
    if (!name || typeof name != 'string') {
        res.status(400).json({ error: 'error on name param' });
        return;
    }

    //check if the requested event stays in db
    let evento = await Event.findOne({ 'id': id }, (err) => {
        if (err) {
            res.status(500).json({ error: err });
            return;
        }
    });

    //check if the requested artist stays in db
    let artist = await User.findOne({ 'username': name, 'userType': 'artist' }, (err) => {
        if (err) {
            res.status(500).json({ error: err });
            return;
        }
    });

    if (!evento) {
        res.status(404).json({ error: 'The event ' + id + ' does not exist' });
        return;
    }

    if (!artist) {
        res.status(404).json({ error: 'The artist ' + name + ' does not exist' });
        return;
    }

    if (evento.owner != name) {
        res.status(400).json({ error: 'The event ' + id + 'exists in db but the owner is not ' + name });
        return;
    }

    res.status(200).json(evento);
}

module.exports = {
    getArtists,
    getAlbums,
    getMerchs,
    getEvents,
    getArtist,
    getOverview,
    getAlbum,
    getMerch,
    getEvent,
    getArtistAlbums,
    getArtistMerch,
    getArtistEvents,
    getArtistAlbumIsmn,
    getArtistMerchId,
    getArtistEventId
};
