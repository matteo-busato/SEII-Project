// ########## MODULE FOR USER STORY #15 ############
// lets artits add new albums, change data of existing albums, deleting albums
// problems: - hardcoded variables and db data
//           - incremental ID
//           - maybe needs function to check if artist name and ismn are valid


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
        cost: 20
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
        title: "rock album 1",
        artist: "steely dan",
        year: 1975,
        genre: "rock",
        tracklist: ["track1", "track2", "track3"],
        cost: 20
    },
    {
        ismn: 5,
        title: "rock album 2",
        artist: "steely dan",
        year: 1976,
        genre: "rock",
        tracklist: ["track1", "track2", "track3"],
        cost: 20
    }
];

var incrementalID = 6;

// ######### DELETE ALBUM ##########
// function for adding album with post method
const addNewAlbum = (req, res) => {
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
        artist: req.body.artist,
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
        res.status(201).json({ message: 'the album has been correctly inserted in the db with ISMN = '+album.ismn });
    }
};

// ######### DELETE ALBUM ##########
// function for deleting album with delete method
const deleteAlbum = (req, res) => {
    console.log('delete called');
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
    console.log('put called');
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

    // create and check validity of updated album data
    let newData = {
        title: req.body.title,
        year: parseInt(req.body.year),
        tracklist: req.body.tracklist,
        genre: req.body.genre,
        cost: parseInt(req.body.cost)
    };
    let check = checkDataValidity(newData);
    if (!check) {
        res.status(400).json({ error: 'error on the new data of the given album' });
        return;
    } else {

        // update album data in the db
        albumList[index].title = newData.title;
        albumList[index].year = newData.year;
        albumList[index].tracklist = newData.tracklist;
        albumList[index].genre = newData.genre;
        albumList[index].cost = newData.cost;
        res.status(201).json({ message: 'the album data has been correctly changed in the db' });
    }
};


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
    changeAlbumData
};