const mongoose = require ('mongoose');
const User = require('../models/user.js');

const follow = async function (req, res) {
    
    var user = req.body.username;
    var artist = req.params.name;

    console.log('new follow request by user = '+user+' to follow artist = '+artist);

    if(!req.body.username){
        res.status(401).json({error: "Please authenticate first"});
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

module.exports = {
    follow
}