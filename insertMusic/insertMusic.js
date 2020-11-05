const albumList = [
    {
        title: 'Album1',
        artist: 'Artist1',
        year: 1969,
        genre: 'genre1'
    },
    {
        title: 'Album2',
        artist: 'Artist2',
        year: 1971,
        genre: 'genre1'
    },
    {
        title: 'Album2',
        artist: 'Artist1',
        year: 1975,
        genre: 'genre2'
    }
];

const addNewAlbum = (req, res) => {
    let album = {
        title: req.body.title,
        artist: req.body.artist,
        year: parseInt(req.body.year),
        genre: req.body.genre
    };
    let check = checkDataValidity(album);
    if (!check) {
        res.status(400).json({ error: 'error on the data of the given album' });
        return;
    } else {
        let found = false;
        albumList.forEach(element => {
            if (element.artist == album.artist &&
                element.title == album.title &&
                element.year == album.year &&
                element.genre == album.genre) {
                found = true;
            }
        });
        if (found) {
            res.status(400).json({ error: 'this album has already been inserted in the db' });
            return;
        }

        albumList.push(album);
        res.status(201).json({ message: 'the album has been correctly inserted in the db' });
    }
};

const deleteAlbum = (req, res) => {
    let album = {
        title: req.body.title,
        artist: req.body.artist,
        year: parseInt(req.body.year),
        genre: req.body.genre
    };
    let check = checkDataValidity(album);
    if (!check) {
        res.status(400).json({ error: 'error on the data of the given album' });
        return;
    } else {
        let found = false;
        let index = 0;
        for (index; index < albumList.length && !found; index++) {
            var element = albumList[index];
            if (element.artist == album.artist &&
                element.title == album.title &&
                element.year == album.year &&
                element.genre == album.genre) {
                found = true;
                index = index - 1;
            }
        }
        if (!found) {
            res.status(400).json({ error: 'this album is not present in the db' });
            return;
        }
        albumList.splice(index, 1);
        res.status(201).json({ message: 'the album has been correctly deleted from the db' });
    }
};

const changeAlbumData = (req, res) => {
    let oldData = {
        title: req.body.oldTitle,
        artist: req.body.oldArtist,
        year: parseInt(req.body.oldYear),
        genre: req.body.oldGenre
    };
    let check = checkDataValidity(oldData);
    if (!check) {
        res.status(400).json({ error: 'error on the old data of the given album' });
        return;
    } else {
        let newData = {
            title: req.body.newTitle,
            artist: req.body.newArtist,
            year: req.body.newYear,
            genre: req.body.newGenre
        };
        let check = checkDataValidity(newData);
        if (!check) {
            res.status(400).json({ error: 'error on the new data of the given album' });
            return;
        } else {
            let found = false;
            let index = 0;
            for (index; index < albumList.length && !found; index++) {
                var element = albumList[index];
                if (element.artist == oldData.artist &&
                    element.title == oldData.title &&
                    element.year == oldData.year &&
                    element.genre == oldData.genre) {
                    found = true;
                    index = index - 1;
                }
            }
            if (!found) {
                res.status(400).json({ error: 'this album is not present in the db' });
                return;
            }
            albumList[index].title = newData.title;
            albumList[index].artist = newData.artist;
            albumList[index].year = newData.year;
            albumList[index].genre = newData.genre;
            res.status(201).json({ message: 'the album data has been correctly changed in the db' });
        }
    }
};

const checkDataValidity = (album) => {
    if (!album.title || typeof album.title != 'string') {
        return false;
    }

    if (!album.artist || typeof album.artist != 'string') {
        return false;
    }

    if (!album.genre || typeof album.genre != 'string') {
        return false;
    }

    if (isNaN(album.year)) {
        return false;
    }
    return true;
}

module.exports = {
    addNewAlbum,
    deleteAlbum,
    changeAlbumData
};