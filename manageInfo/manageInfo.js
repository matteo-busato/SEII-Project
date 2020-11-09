
const artist =
    {
        name: 'Beatles',
        password: '',
        bio: '',
        genre: ''
    };

const addInfo = (req, res) => {
    let bodyArtist = {
        name: req.body.name,
        password: req.body.password,
        bio: req.body.bio,
        genre: req.body.genre
    };
    let check = checkDataValidity(bodyArtist);
    if (!check) {
        res.status(400).json({ error: 'error on the data of the given artist' });
        return;
    } else {
        if(artist.name == bodyArtist.name) {
            let emptyBio = true, emptyPassword = true, emptyGenre = true;
            if(artist.bio == ''){
                artist.bio = bodyArtist.bio;
            }
            else{
                emptyBio = false;
            }
            if(artist.genre == ''){
                artist.genre = bodyArtist.genre;
            }
            else{
                emptyGenre = false;
            }
            if(artist.password == ''){
                artist.password = bodyArtist.password;
            }  
            else{
                emptyPassword = false;
            }         
            if(!emptyBio || !emptyGenre || !emptyPassword){
                res.status(201).json({ message: 'some informations need to be modified' }) 
            }
            else{
                res.status(201).json({ message: 'artist infos correctly inserted in the db'});
            }
        }   
        else{
            res.status(400).json({ error: 'no artist with the given name'});
        }
    }
};

const deleteInfo = (req, res) => {
    var name = req.params.name;  
    if (name !=artist.name) {
        res.status(400).json({ error: 'no artist with the given name' });
        return;
    }
    artist.bio = '';
    artist.password = '';
    artist.genre = '';
    res.status(201).json({ message: `the infos of ${name} has been correctly deleted from the db `});
};

const changeInfo = (req, res) => {
    let newArtistInfo = {
        name: req.body.name,
        password: req.body.password,
        bio: req.body.bio,
        genre: req.body.genre
    };
    let check = checkDataValidity(newArtistInfo);
    if (!check) {
        res.status(400).json({ error: 'error on the data of the given artist' });
        return;
    }
    else{
        if(artist.name == newArtistInfo.name) {
            if(artist.password != newArtistInfo.password)
                artist.password = newArtistInfo.password;
            if(artist.genre != newArtistInfo.genre)
                artist.emptyGenre = newArtistInfo.genre;
            if(artist.bio != newArtistInfo.bio)
                artist.bio = newArtistInfo.bio;
                res.status(201).json({ message: `the infos of ${artist.name} has been correctly modified`});
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
    return true;
};

module.exports = {
    addInfo,
    deleteInfo,
    changeInfo,
};

