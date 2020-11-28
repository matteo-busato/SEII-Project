
const artist =
    {
        name: 'Radiohead',
        password: '',
        bio: '',
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
        if (!req.body.email || typeof req.body.email != 'string') {
            res.status(400).json({ error: 'error: wrong data for the password' });
            return;
        }
        if(artist.password != "" || artist.bio != "" ||  artist.email != ""){
            res.status(300).json({ error: 'Some informations for the given artist are non-empty yet, you can try to modify it' });
            return;
        }
        artist.password = req.body.password;
        artist.bio = req.body.bio;
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
    artist.email = "";
    res.status(201).json({ message: `the infos of ${name} has been correctly deleted from the db `});
};

const changeInfo = (req, res) => {
    let name = req.params.name;
    if(name != artist.name){
        res.status(400).json({ error: 'no artist with the given name'}); 
    }
    else {
        if (!req.body.newName || typeof req.body.newName != 'string') {
            res.status(400).json({ error: 'error: wrong data for the name' });
            return;
        }
        if (!req.body.newPassword || typeof req.body.newPassword != 'string' || !req.body.oldPassword || typeof req.body.oldPassword != 'string' ) {
            res.status(400).json({ error: 'error: wrong data for the password' });
            return;
        }
        if (!req.body.newBio || typeof req.body.newBio != 'string') {
            res.status(400).json({ error: 'error: wrong data for the bio' });
            return;
        }
        if (!req.body.newEmail || typeof req.body.newEmail != 'string') {
            res.status(400).json({ error: 'error: wrong data for the email' });
            return;
        }
        if(req.body.newName != artist.name)
            artist.name = req.body.newName;
        if(req.body.oldPassword == artist.password){
            if(req.body.newPassword != artist.password)
                artist.password = req.body.newPassword;
        }
        if(req.body.newBio != artist.bio)
            artist.bio = req.body.newBio;
        if(req.body.newEmail != artist.email)
            artist.email = req.body.newEmail;
        res.status(201).json({ message: `the infos of ${name} has been correctly modified in the db `});
    }
   
};

module.exports = {
    addInfo,
    deleteInfo,
    changeInfo,
    getInfo,
};

