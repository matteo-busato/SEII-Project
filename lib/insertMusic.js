// ########## MODULE FOR USER STORY #15 ############
// lets artits add new albums, change data of existing albums, deleting albums
// problems: - needs proper way to check if artist exists
//           - incremental ID
//           - needs proper way for dealing with errors (in backend and frontend)
//           - needs testing of db parts

const artistList = [
    {
        name: "srv",
        email: "srv@me.com",
        bio: "cool blues guitarist"
    },
    {
        name: "black sabbath",
        email: "black.sabbath@mail.com",
        bio: "cool heavy metal band"
    },
    {
        name: "steely dan",
        email: "no",
        bio: "cool soft rock band"
    }
];

var incrementalID = 7;

const mongoose = require('mongoose');
const Album = require("../models/album.js");

// ######### ADD NEW ALBUM ##########
// function for adding album with post method
const addNewAlbum = (req, res) => {
    console.log("new post album request from " + req.protocol + '://' + req.get('host') + req.originalUrl);
    let artist = req.params.name;

    // verify if artist exists
    let found = false;
    artistList.forEach(element => {
        if (element.name == artist) {
            found = true;
        }
    });
    if (!found) {
        res.status(400).json({ error: 'this artist does not exist' });
        return;
    }

    // create and check validity of input album
    const album = new Album({
        ismn: incrementalID,
        title: req.body.title,
        artist: artist,
        year: parseInt(req.body.year),
        tracklist: req.body.tracklist,
        genre: req.body.genre,
        cost: parseInt(req.body.cost)
    });

    if (!album.title || typeof album.title != 'string') {
        res.status(400).json({ error: 'error: the album\'s title must be a non-empty string' });
        return false;
    }

    if (isNaN(album.year)) {
        res.status(400).json({ error: 'error: the album\'s year must be a non-empty number' });
        return false;
    }

    if (!album.tracklist) {
        res.status(400).json({ error: 'error: the album\'s tracklist must be a non-empty set of tracks' });
        return false;
    } else {
        album.tracklist.forEach(track => {
            if (!track || typeof track != 'string') {
                res.status(400).json({ error: 'error: the album\'s tracks must be non-empty strings' });
                return false;
            }
        });
    }

    if (!album.genre || typeof album.genre != 'string') {
        res.status(400).json({ error: 'error: the album\'s genre must be a non-empty string' });
        return false;
    }

    if (isNaN(album.cost)) {
        res.status(400).json({ error: 'error: the album\'s cost must be a non-empty number' });
        return false;
    }

    incrementalID = incrementalID + 1;
    album.save((err) => {
        if (err) {
            console.error("error inserting album in the db: " + err);
        }
    });
    res.status(200).json({ message: 'the album has been correctly inserted in the db with ISMN = ' + album.ismn });
};

// ######### DELETE ALBUM ##########
// function for deleting album with delete method
const deleteAlbum = (req, res) => {
    console.log("new delete album request from " + req.protocol + '://' + req.get('host') + req.originalUrl);
    let artist = req.params.name;
    let ismn = parseInt(req.params.ismn);

    Album.deleteOne({ artist: artist, ismn: ismn }, (err) => {
        if (err) {
            console.error(err);
            res.status(400).json({ error: 'error: this album does not exist in the db' });
        } else {
            res.status(200).json({ message: 'the album has been correctly deleted from the db' });
        }
    });
};


// ######### CHANGE ALBUM DATA ##########
// function for changing album data with put method
const changeAlbumData = (req, res) => {
    console.log("new put album request from " + req.protocol + '://' + req.get('host') + req.originalUrl);
    let artist = req.params.name;
    let ismn = parseInt(req.params.ismn);

    // create updated album with valid data
    let newData = {};

    if (req.body.title && typeof req.body.title == 'string' && req.body.title != "") {
        newData.title = req.body.title;
    }

    if (!isNaN(parseInt(req.body.year))) {
        newData.year = parseInt(req.body.year);
    }

    if (req.body.genre && typeof req.body.genre == 'string' && req.body.genre != "") {
        newData.genre = req.body.genre;
    }

    if (!isNaN(parseInt(req.body.cost))) {
        newData.cost = parseInt(req.body.cost);
    }

    if (req.body.tracklist && Array.isArray(req.body.tracklist)) {
        let tracklist = [];
        req.body.tracklist.forEach(function (track) {
            if (track && typeof track == 'string' && track != ""){
                tracklist.push(track);
            }
        });
        if (tracklist.length > 0) {
            newData.tracklist = tracklist;
        }
    }

    Album.findOneAndUpdate({artist: artist, ismn: ismn}, newData, function (err, album) {
        if(err){
            console.log(err);
        } else if (album) {
            res.status(200).json({message: "the album data has been correctly changed in the db"});
        } else if (!album){
            res.status(400).json({ message: "error: this album does not exist in the db"});
        }
    });

};


// ######### GET ALBUM DATA ##########
// function for getting album data with get method (copiata da Matteo Busato)
const getAlbum = (req, res) => {
    console.log("new get album request from " + req.protocol + '://' + req.get('host') + req.originalUrl);
    let artist = req.params.name;
    let ismn = parseInt(req.params.ismn);
    Album.findOne({ artist: artist, ismn: ismn }, function (err, album) {
        if (err) {
            console.error(err);
        } else if (album) {
            res.status(200).json(album);
        } else {
            res.status(400).json({ error: "this album is not present in the db" });
        }
    });
}


module.exports = {
    addNewAlbum,
    deleteAlbum,
    changeAlbumData,
    getAlbum
};