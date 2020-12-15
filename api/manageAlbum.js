// ########## MODULE FOR USER STORY #15 ############
// lets artits add new albums, change data of existing albums, deleting albums

const mongoose = require('mongoose');
const Album = require("../models/album.js");
const User = require("../models/user.js");

const getYear = function(){
    return new Date().getFullYear();
}

// ######### ADD NEW ALBUM ##########
// function for adding album with post method
const addNewAlbum = async function (req, res) {
    //console.log("new post album request from " + req.protocol + '://' + req.get('host') + req.originalUrl);

    // get user data from request
    if(!req.loggedUser){
        res.status(401).json({error: "Please authenticate first"});
        return;
    }

    // user not an artist
    if(req.loggedUser.userType != 'artist'){
        res.status(401).json({error: "You must be an artist to access this page"});
        return;
    }

    // search for artist in db
    let artist = req.params.name;
    let artistIn = await User.findOne({username: artist, userType: 'artist'}, (err) => {
        if(err) {
            console.error(err);
            res.status(500).json({ error: 'server error on finding the artist in the db, please retry' });
            return;
        }
    });
    if(!artistIn){
        res.status(404).json({ error: 'The artist ' + artist + ' does not exist' });
        return;
    }

    // not owner
    if(req.loggedUser.username != artist){
        res.status(401).json({error: "You can't add an album for another artist"});
        return;
    }

    // check if input album data is valid
    if (isNaN(parseInt(req.body.ismn))){
        res.status(400).json({ error: 'error: the album\'s ismn must be a non-empty number' });
        return;
    } else {
        let ismn = await Album.findOne({ismn: parseInt(req.body.ismn)}, function (err) {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'server error searching for the ismn in the db, please retry'});
                return;
            }
            return;
        });
        if(ismn) {
            res.status(400).json({ error: 'error: this ismn is already present in the db, please pick another one'});
            return;
        }
    }

    if (!req.body.title || typeof req.body.title != 'string' || req.body.title == "") {
        res.status(400).json({ error: 'error: the album\'s title must be a non-empty string' });
        return;
    }

    if (isNaN(parseInt(req.body.year)) || (parseInt(req.body.year) > getYear()) ) {
        res.status(400).json({ error: 'error: the album\'s year must be a non-empty number and can\' t be a future year' });
        return;
    }

    if (!req.body.tracklist || !Array.isArray(req.body.tracklist)) {
        res.status(400).json({ error: 'error: the album\'s tracklist must be a non-empty set of tracks' });
        return;
    } else {
        req.body.tracklist.forEach(track => {
            if (!track || typeof track != 'string' || track == "") {
                res.status(400).json({ error: 'error: the album\'s tracks must be non-empty strings' });
                return;
            }
        });
    }

    if (!req.body.genre || typeof req.body.genre != 'string' || req.body.genre == "") {
        res.status(400).json({ error: 'error: the album\'s genre must be a non-empty string' });
        return;
    }

    if (isNaN(parseFloat(req.body.cost)) || parseFloat(req.body.cost)<0 ) {
        res.status(400).json({ error: 'error: the album\'s cost must be a non-empty number' });
        return;
    }

    // create input album
    const album = new Album({
        ismn: parseInt(req.body.ismn),
        title: req.body.title,
        owner: artist,
        year: parseInt(req.body.year),
        tracklist: req.body.tracklist,
        genre: req.body.genre,
        cost: parseFloat(req.body.cost)
    });

    // insert album in db
    album.save(function (err) {
        if (err) {
            console.error("error inserting album in the db: " + err);
            res.status(500).json({ error: 'server error on saving the album to the db, please retry' });
            return;
        } else {
            res.status(201).json({ message: 'The album has been correctly inserted in the db with ISMN = ' + album.ismn });
            return;
        }
    });

};

// ######### DELETE ALBUM ##########
// function for deleting album with delete method
const deleteAlbum = async function (req, res) {
    //console.log("new delete album request from " + req.protocol + '://' + req.get('host') + req.originalUrl);
    
    // get user data from request
    if(!req.loggedUser){
        res.status(401).json({error: "Please authenticate first"});
        return;
    }

    // user not artist
    if(req.loggedUser.userType != 'artist'){
        res.status(401).json({error: "You must be an artist to access this page"});
        return;
    }
    
    let artist = req.params.name;

    // search for artist in the db
    let artistIn = await User.findOne({'username':artist, 'userType':'artist'}, (err) => {
        if(err) {
            res.status(500).json({ error: err });
            return;
        }
    });
    
    if(!artistIn){
        res.status(404).json({ error: 'The artist ' + artist + ' does not exist' });
        return;
    }

    // not owner
    if(req.loggedUser.username != artist){
        res.status(401).json({error: "You can't delete an album for another artist"});
        return;
    }

    let ismn = parseInt(req.params.ismn);

    // search for album to delete
    let albumIn = await Album.findOne({ismn: ismn, owner: artist}, (err) => {
        if(err){
            console.error(err);
            res.status(500).json({ error: 'server error on searching the album in the db, please retry' });
            return;
        }
    });
    if(!albumIn){
        res.status(404).json({ error: 'this album does not exists' });
        return;
    }

    // delete album
    Album.deleteOne({ owner: artist, ismn: ismn }, (err) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'server error on deleting the album, please retry' });
            return;
        } else {
            res.status(200).json({ message: 'The album has been correctly deleted from the db' });
            return;
        }
    });
};


// ######### CHANGE ALBUM DATA ##########
// function for changing album data with put method
// NEEDS METHODS FOR CHECKING AUTHENTICATION (Sprint #2)
const changeAlbumData = async function (req, res) {
    //console.log("new put album request from " + req.protocol + '://' + req.get('host') + req.originalUrl);
    
    // get user data from request
    if(!req.loggedUser){
        res.status(401).json({error: "Please authenticate first"});
        return;
    }

    let artist = req.params.name;

    // check if user is artist
    if(req.loggedUser.userType != 'artist'){
        res.status(401).json({error: "You must be an artist to access this page"});
        return;
    }

    // check if artist is in db
    let artistIn = await User.findOne({'username':artist, 'userType':'artist'}, (err) => {
        if(err) {
            res.status(500).json({ error: err });
            return;
        }
    });

    if(!artistIn){
        res.status(404).json({ error: 'The artist ' + artist + ' does not exist' });
        return;
    }

    // not owner
    if(req.loggedUser.username != artist){
        res.status(401).json({error: "You can't change the album data for another artist"});
        return;
    }

    let oldIsmn = req.params.ismn;

    // create updated album only with valid data
    let newData = {};
    let message = "\nWARNING(s): ";

    if (isNaN(parseInt(req.body.ismn))){
        message = message + "\nNew ismn is not valid (must be a number); ";
    } else {
        let ismn = await Album.findOne({ismn: parseInt(req.body.ismn)}, function (err) {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'server error on the db, please retry'});
                return;
            }
            return;
        });
        if(ismn) {
            message = message + "\nNew ismn is already present in the db; ";
        } else {
            newData.ismn = parseInt(req.body.ismn);
        }
    }

    if (req.body.title && typeof req.body.title == 'string') {
        newData.title = req.body.title;
    } else {
        message = message + "\nNew title is not valid (must be a non-empty string); ";
    }

    if (!isNaN(parseInt(req.body.year)) && (parseInt(req.body.year) <= getYear()) ) {
        newData.year = parseInt(req.body.year);
    } else {
        message = message + "\nNew year is not valid (must be a number/can't be a future year); ";
    }

    if (req.body.genre && typeof req.body.genre == 'string' && req.body.genre != "") {
        newData.genre = req.body.genre;
    } else {
        message = message + "\nNew genre is not valid (must be a non-empty string); ";
    }

    if (!isNaN(parseFloat(req.body.cost)) && parseFloat(req.body.cost)>=0) {
        newData.cost = parseFloat(req.body.cost);
    } else {
        message = message + "\nNew cost is not valid (must be a number); ";
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
        } else {
            message = message + "\nSome tracks in the new tracklist are not valid (must be non-empty strings);\n ";
        }
    } else {
        message = message + "\nNew tracklist is not valid (must be a collection of strings); ";
    }

    // update data in db and send warnings
    let target = newData.ismn ? newData.ismn : oldIsmn;
    Album.findOneAndUpdate({owner: artist, ismn: oldIsmn}, newData, function (err, album) {
        if(err){
            console.log(err);
            res.status(500).json({ error: "server error on finding the album data in the db, please retry" });
            return;
        } else if (album) {
            if (message == "\nWARNING(s): "){
                res.status(201).json({ message: "The album data has been correctly changed in the db", newIsmn: target});
                return;
            } else {
                res.status(201).json({ message: "The album data has been correctly changed in the db.\n"+message+"\nOld data will be kept in case of a warning.", newIsmn: target });
                return;
            }
        } else if (!album){
            res.status(404).json({ error: "error: this album does not exist in the db" });
            return;
        }
    });
};


// ######### GET ALBUM DATA ##########
// function for getting album data with get method
const getAlbum = function (req, res) {
    //console.log("new get album request from " + req.protocol + '://' + req.get('host') + req.originalUrl);
    let artist = req.params.name;
    let ismn = parseInt(req.params.ismn);
    Album.findOne({ owner: artist, ismn: ismn }, function (err, album) {
        if (err) {
            console.error(err);
        } else if (album) {
            res.status(200).json(album);
            return;
        } else {
            res.status(400).json({ error: "this album is not present in the db" });
            return;
        }
    });
}


module.exports = {
    addNewAlbum,
    deleteAlbum,
    changeAlbumData,
    getAlbum
};
