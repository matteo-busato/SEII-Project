
const artist =
    {
        name: 'Beatles',
        bio: 'From Liverpool',
        genre: 'Rock'
    };

const addBio = (req, res) => {
    var name = req.params.name;
    let bodyArtist = {
        name: req.body.name,
        bio: req.body.bio,
        genre: req.body.genre
    };
    let check = checkDataValidity(bodyArtist);
    if (!check) {
        res.status(400).json({ error: 'error on the data of the given artist' });
        return;
    } else {
        let found = false;
        if(name == bodyArtist.name) 
            found = true;        
        if (found) {
            if(artist.bio != ''){
                res.status(400).json({ error: 'the bio already exists, try to modify it with changeBio'});
                return; 
            }
            artist.bio = bodyArtist.bio;
            res.status(201).json({ message: 'artist bio correctly inserted in the db' });
        }   
        else{
            res.status(400).json({ error: 'no artist with the given name'});
        }
    }
};



const deleteBio = (req, res) => {
    var name = req.params.name;  
    let bodyName = req.body.name;
    if (name != bodyName) {
        res.status(400).json({ error: 'this artist is not present in the db' });
        return;
    }
    artist.bio = '';
    res.status(201).json({ message: 'the bio has been correctly deleted from the db '});
};

const changeBio = (req, res) => {
    var name = req.params.name;
    let bodyName = req.body.name;
    if (name != bodyName) {
        res.status(400).json({ error: 'this artist is not present in the db' });
        return;
    }
    artist.bio = req.body.bio;
    res.status(201).json({ message: 'the bio has been correctly modified'});
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
    addBio,
    deleteBio,
    changeBio,
};

