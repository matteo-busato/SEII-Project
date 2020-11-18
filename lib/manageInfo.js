
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
        res.status(400).json({ error: 'error on the data of the given artist' });
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
    let bodyArtist = {
        name: req.body.name,
        password: req.body.password,
        bio: req.body.bio,
        genre: req.body.genre,
        email: req.body.email
    };
    let check = checkDataValidity(bodyArtist);
    if (!check) {
        res.status(400).json({ error: 'error on the data of the given artist' });
        return;
    } else {
        if(artist.name == bodyArtist.name) {
            let emptyBio = true, emptyPassword = true, emptyGenre = true, emptyEmail = true;
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
            if(artist.email == ''){
                artist.email = bodyArtist.email;
            }  
            else{
                emptyEmail = false;
            }        
            if(!emptyBio || !emptyGenre || !emptyPassword || !emptyEmail){
                res.status(300).json({ message: 'some informations need to be modified' }) 
            }
            else{
                res.status(200).json({ message: 'artist infos correctly inserted in the db'});
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
        if(artist.name == newArtistInfo.name) {
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

