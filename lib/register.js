/*
MODULE FOR USER STORY #3 - Registrazione
*/

const bcrypt = require('bcrypt');

const User = require('../models/user.js');

function checkEmail(email) {
    re = new RegExp(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/);

    if (re.test(email))
        return true;
    else
        return false;
}

/*
 ### Register a user ###
        request: json with name, email, password of the new user
        response: json with an error message or a success message
*/
const postRegister = async (req, res) => {
    let data = {
        username: req.body.name,
        email: req.body.email,
        password: req.body.password,
        userType: "user"
    };

    if (!data.username || typeof data.username != 'string') {
        res.status(400).json({ error: "The field 'username' must be a non-empty string" });
        return;
    }

    if (!data.email || typeof data.email != 'string') {
        res.status(400).json({ error: "The field 'email' must be a non-empty string" });
        return;
    }

    if (!checkEmail(data.email)) {
        res.status(400).json({ error: "Invalid email format" });
        return;
    }

    if (!data.password || typeof data.password != 'string') {
        res.status(400).json({ error: "The field 'password' must be a non-empty string" });
        return;
    }

    let alreadyIn = await User.findOne({email: data.email}, (err) => {
        if (err) {
            res.status(500).json({ error: err });
            return;
        }
    });

    if(alreadyIn){
        res.status(409).json({ error: "This email is already registered"});
        return;
    }

    var user = new User(data);

    await user.save((err, user) => {
        if (err){
            res.status(500).json(err);
        }
    });

    res.status(201).json({ message: "User registered successfully" });

};

module.exports = {
    postRegister
};