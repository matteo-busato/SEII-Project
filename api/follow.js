const User = require('../models/user.js');

const checkfollow = async function (req, res) {

    if(!req.loggedUser){
        res.status(401).json({error: "Please authenticate first"});
        return;
    }

    var user = req.loggedUser.username;
    var artist = req.params.name;

    var artistIn = await User.findOne({ username: artist, userType: 'artist'}, (err) => {
        if(err){
            console.error(err);
            res.status(500).json({ error: 'server error on finding the artist in the db, please retry'});
            return;
        }
    });
    if(!artistIn){
        res.status(404).json({ error: 'this artist does not exist' });
        return;
    }

    var userIn = await User.findOne({ username: user}, (err) => {
        if(err){
            console.error(err);
            res.status(500).json({ error: 'server error on finding the user in the db, please retry'});
            return;
        }
    });
    if(!userIn){
        res.status(404).json({ error: 'this user does not exist' });
        return;
    }

    var alreadyFollow = await User.findOne({ username: user, followed: { $in: [artist] } }, (err) => {
        if(err){
            console.error(err);
            res.status(500).json({ error: 'server error on checking if already following, please retry'});
            return;
        }
    })
    if(alreadyFollow){
        res.status(200).json({ message: 'follow' });
        return;
    } else {
        res.status(200).json({ message: 'not follow' });
        return;
    }
}

const follow = async function (req, res) {
    
    //console.log('new follow request by user = '+user+' to follow artist = '+artist);

    if(!req.loggedUser){
        res.status(401).json({error: "Please authenticate first"});
        return;
    }

    var user = req.loggedUser.username;
    var artist = req.params.name;

    if(user == artist){
        res.status(400).json({ error: 'An artist cannot follow himself' });
        return;
    }

    var artistIn = await User.findOne({ username: artist, userType: 'artist'}, (err) => {
        if(err){
            console.error(err);
            res.status(500).json({ error: 'server error on finding the artist in the db, please retry'});
            return;
        }
    });
    if(!artistIn){
        res.status(404).json({ error: 'this artist does not exist' });
        return;
    }

    var userIn = await User.findOne({ username: user}, (err) => {
        if(err){
            console.error(err);
            res.status(500).json({ error: 'server error on finding the user in the db, please retry'});
            return;
        }
    });
    if(!userIn){
        res.status(404).json({ error: 'this user does not exist' });
        return;
    }

    var alreadyFollow = await User.findOne({ username: user, followed: { $in: [artist] } }, (err) => {
        if(err){
            console.error(err);
            res.status(500).json({ error: 'server error on checking if already following, please retry'});
            return;
        }
    })
    if(alreadyFollow){
        res.status(400).json({ error: 'you already follow this artist' });
        return;
    }

    User.findOneAndUpdate({ username: user}, { $push: { followed: artist} }, (err) => {
        if(err){
            console.error(err);
            res.status(500).json({ error: 'server error on following this artist, please retry'});
            return;
        } else {
            res.status(200).json({ message: 'you now follow '+artist });
            return; 
        }
    });

}

const unfollow = async function (req, res) {

    //console.log('new follow request by user = '+user+' to follow artist = '+artist);

    if(!req.loggedUser){
        res.status(401).json({error: "Please authenticate first"});
        return;
    }

    var user = req.loggedUser.username;
    var artist = req.params.name;

    var artistIn = await User.findOne({ username: artist, userType: 'artist'}, (err) => {
        if(err){
            console.error(err);
            res.status(500).json({ error: 'server error on finding the artist in the db, please retry'});
            return;
        }
    });
    if(!artistIn){
        res.status(404).json({ error: 'this artist does not exist' });
        return;
    }

    var userIn = await User.findOne({ username: user}, (err) => {
        if(err){
            console.error(err);
            res.status(500).json({ error: 'server error on finding the user in the db, please retry'});
            return;
        }
    });
    if(!userIn){
        res.status(404).json({ error: 'this user does not exist' });
        return;
    }

    var alreadyUnfollow = await User.findOne({ username: user, followed: { $nin: [artist] } }, (err) => {
        if(err){
            console.error(err);
            res.status(500).json({ error: 'server error on checking if already following, please retry'});
            return;
        }
    })
    if(alreadyUnfollow){
        res.status(400).json({ error: 'you already don\'t follow this artist' });
        return;
    }

    User.findOneAndUpdate({ username: user}, { $pull: { followed: artist} }, (err) => {
        if(err){
            console.error(err);
            res.status(500).json({ error: 'server error on unfollowing this artist, please retry'});
            return;
        } else {
            res.status(200).json({ message: 'you no longer follow '+artist });
            return; 
        }
    });

}

module.exports = {
    checkfollow,
    follow,
    unfollow
}