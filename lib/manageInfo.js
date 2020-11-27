
const artist =
    {
        name: 'Radiohead',
        password: '',
        bio: '',
        genre: '',
        email: ""
    };

const getInfo = (req, res) => {
    var found = false;
    var name = req.params.name;
    if (!name || typeof name != 'string') {
        res.status(400).json({ error: 'error on the data of the given artist'});
        return ;
    } else {
        if(artist.name == name) {
            res.status(200).json(artist);
        } else {
            res.status(400).json({ error: 'no artist with the given name'});
        }
    }
};
const addInfo = (req, res) => {
    let name = req.params.name;
    if(name != artist.name){
        res.status(400).json({ error: 'no artist with the given name'}); 
    }
    else {
        if (!req.body.password || typeof req.body.password != 'string') {
            res.status(400).json({ error: 'error: wrong data for the password' });
            return;
        }
        if (!req.body.bio || typeof req.body.bio != 'string') {
            res.status(400).json({ error: 'error: wrong data for the bio' });
            return;
        }
        if (!req.body.genre || typeof req.body.genre != 'string') {
            res.status(400).json({ error: 'error: wrong data for the genre' });
            return;
        }
        if (!req.body.email || typeof req.body.email != 'string') {
            res.status(400).json({ error: 'error: wrong data for the password' });
            return;
        }
        if(artist.password != "" || artist.bio != "" || artist.genre != "" || artist.email != ""){
            res.status(300).json({ error: 'Some informations for the given artist are non-empty yet, you can try to modify it' });
            return;
        }
        artist.password = req.body.password;
        artist.bio = req.body.bio;
        artist.genre = req.body.genre;
        artist.email = req.body.email;
        res.status(201).json({ message: `the infos of ${name} has been correctly inserted in the db `});
    }
};

const deleteInfo = (req, res) => {
    var name = req.params.name;  
    if (name != artist.name) {
        res.status(400).json({ error: 'no artist with the given name' });
        return;
    }
    artist.bio = '';
    artist.password = '';
    artist.genre = '';
    artist.email = "";
    res.status(201).json({ message: `the infos of ${name} has been correctly deleted from the db `});
};

const changeInfo = (req, res) => {
    let newArtistInfo = {
        name: req.body.name,
        password: req.body.password,
        bio: req.body.bio,
        genre: req.body.genre,
        email: req.body.email
    };
    let check = checkDataValidity(newArtistInfo);
    if (!check) {
        res.status(400).json({ error: 'error on the data of the given artist' });
        return;
    }
    else{
        if(req.param.name == artist.name) {
            if(artist.password != newArtistInfo.password)
                artist.password = newArtistInfo.password;
            if(artist.genre != newArtistInfo.genre)
                artist.emptyGenre = newArtistInfo.genre;
            if(artist.bio != newArtistInfo.bio)
                artist.bio = newArtistInfo.bio;
            if(artist.email != newArtistInfo.email)
                artist.email = newArtistInfo.email;
            res.status(200).json({ message: `the infos of ${artist.name} has been correctly modified`});
        }
        else{
            res.status(400).json({ error: 'no artist with the given name'});
        } 
    }
};

const checkDataValidity = (bodyArtist) => {
    if (!bodyArtist.name || typeof artist.name != 'string') {
        return false;
    }

    if (!bodyArtist.bio || typeof artist.bio != 'string') {
        return false; 
    }
    
    if (!bodyArtist.genre || typeof artist.genre != 'string') {
        return false;
    }
    if (!bodyArtist.email || typeof artist.email != 'string') {
        return false;
    }
    return true;
};

module.exports = {
    addInfo,
    deleteInfo,
    changeInfo,
    getInfo,
};

