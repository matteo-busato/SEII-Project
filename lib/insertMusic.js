// ########## MODULE FOR USER STORY #15 ############
// lets artits add new albums, change data of existing albums, deleting albums
// problems: - hardcoded variables and db data
//           - incremental ID
//           - needs proper way for dealing with errors (in backend and frontend)

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

const albumList = [
    {
        ismn: 1,
        title: "metal album 1",
        artist: "black sabbath",
        year: 1970,
        genre: "metal",
        tracklist: ["track1", "track2", "track3"],
        cost: 20
    },
    {
        ismn: 2,
        title: "metal album 2",
        artist: "black sabbath",
        year: 1972,
        genre: "metal",
        tracklist: ["track4", "track5", "track6"],
        cost: 30
    },
    {
        ismn: 3,
        title: "blues album 1",
        artist: "srv",
        year: 1985,
        genre: "blues",
        tracklist: ["track1", "track2", "track3"],
        cost: 20
    },
    {
        ismn: 4,
        title: "blues album 2",
        artist: "srv",
        year: 1988,
        genre: "blues",
        tracklist: ["track4", "track5", "track6"],
        cost: 25
    },
    {
        ismn: 5,
        title: "rock album 1",
        artist: "steely dan",
        year: 1975,
        genre: "rock",
        tracklist: ["track1", "track2", "track3"],
        cost: 25
    },
    {
        ismn: 6,
        title: "rock album 2",
        artist: "steely dan",
        year: 1976,
        genre: "rock",
        tracklist: ["track1", "track2", "track3"],
        cost: 30
    }
];

var incrementalID = 7;

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

    // create and check validity of new album data
    let album = {
        ismn: incrementalID,
        title: req.body.title,
        artist: artist,
        year: parseInt(req.body.year),
        tracklist: req.body.tracklist,
        genre: req.body.genre,
        cost: parseInt(req.body.cost)
    };
    let check = checkDataValidity(album);
    if (!check) {
        res.status(400).json({ error: 'error on the data of the given album' });
        return;
    } else {
        incrementalID = incrementalID + 1;
        albumList.push(album);
        res.status(201).json({ message: 'the album has been correctly inserted in the db with ISMN = ' + album.ismn });
    }
};

// ######### DELETE ALBUM ##########
// function for deleting album with delete method
const deleteAlbum = (req, res) => {
    console.log("new delete album request from " + req.protocol + '://' + req.get('host') + req.originalUrl);
    let artist = req.params.name;
    let ismn = parseInt(req.params.ismn);

    // verify if (artist name, ismn) exists in db
    let found = false;
    let index = 0;
    for (index; index < albumList.length && !found; index++) {
        var element = albumList[index];
        if (element.ismn == ismn && element.artist == artist) {
            found = true;
            index = index - 1;
        }
    }
    if (!found) {
        res.status(400).json({ error: 'this album does not exist in the db' });
        return;
    }
    albumList.splice(index, 1);
    res.status(201).json({ message: 'the album has been correctly deleted from the db' });
};


// ######### CHANGE ALBUM DATA ##########
// function for changing album data with put method
const changeAlbumData = (req, res) => {
    console.log("new put album request from " + req.protocol + '://' + req.get('host') + req.originalUrl);
    let artist = req.params.name;
    let ismn = parseInt(req.params.ismn);

    // verify if (artist name, ismn) exists in db
    let found = false;
    let index = 0;
    for (index; index < albumList.length && !found; index++) {
        var element = albumList[index];
        if (element.ismn == ismn && element.artist == artist) {
            found = true;
            index = index - 1;
        }
    }
    if (!found) {
        res.status(400).json({ error: 'this album does not exist in the db' });
        return;
    }

    // create updated album data
    let newData = {
        title: req.body.title,
        year: parseInt(req.body.year),
        tracklist: req.body.tracklist,
        genre: req.body.genre,
        cost: parseInt(req.body.cost)
    };

    // update album data in the db if valid or keep old data
    if (newData.title && typeof newData.title == 'string') {
        albumList[index].title = newData.title;
    }

    if (!isNaN(newData.year)) {
        albumList[index].year = newData.year;
    }

    let validTracklist = true;
    if (!newData.tracklist) {
        validTracklist = false;
    } else {
        newData.tracklist.forEach(track => {
            if (!track || typeof track != 'string') {
                validTracklist = false;
            }
        });
    }

    if (validTracklist) {
        albumList[index].tracklist = newData.tracklist;
    }

    if (newData.genre && typeof newData.genre == 'string') {
        albumList[index].genre = newData.genre;
    }

    if (!isNaN(newData.cost)) {
        albumList[index].cost = newData.cost;
    }
    res.status(201).json({ message: 'the album data has been correctly changed in the db' });
};


// ######### GET ALBUM DATA ##########
// function for getting album data with get method (copiata da Matteo Busato)
const getAlbum = (req, res) => {
    console.log("new get album request from " + req.protocol + '://' + req.get('host') + req.originalUrl);
    let artist = req.params.name;
    let ismn = req.params.ismn;
    let found = false;
    for (let i = 0; i < albumList.length && !found; i++) {
        if (albumList[i].artist == artist && albumList[i].ismn == ismn) {
            res.status(200).json(albumList[i]);
            found = true;
        }
    }
    if (!found) {
        res.status(400).json({ error: 'no albums with ismn : ' + ismn + ' from artist with name : ' + name });
    }
}


// ######### CHECK ALBUM DATA VALIDITY ##########
// function for checking validity of album data in input
const checkDataValidity = (album) => {
    if (!album.title || typeof album.title != 'string') {
        return false;
    }

    if (!album.genre || typeof album.genre != 'string') {
        return false;
    }

    if (isNaN(album.year)) {
        return false;
    }

    if (!album.tracklist) {
        return false;
    } else {
        album.tracklist.forEach(track => {
            if (!track || typeof track != 'string') {
                return false;
            }
        });
    }

    if (isNaN(album.cost)) {
        return false;
    }

    return true;
}

module.exports = {
    addNewAlbum,
    deleteAlbum,
    changeAlbumData,
    getAlbum
};