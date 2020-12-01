const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const User = require('../models/user.js');

function checkEmail(email) {
    re = new RegExp(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/);

    if (re.test(email))
        return true;
    else
        return false;
}

//login with email and password. get a token
//URI: POST: api/v1/users/auth
const auth = (req, res) => {

    let result = {};
    let status = 201;

    var email = req.body.email;
    var password = req.body.password;


    //check for problems
    if (!email || typeof email != 'string') {
        res.status(404).json("The field 'email' must be a non-empty string");
        return;
    }
    if (!checkEmail(email)) {
        res.status(404).json({ error: "Invalid email format" });
        return;
    }
    if (!password || typeof password != 'string') {
        res.status(401).json({ error: "The field 'password' must be a non-empty string" });
        return;
    }

    User.findOne({ email: email }, function (err, user) {
        if (!err && user) {   //we look at password matching

            bcrypt.compare(password, user.password, function (err, match) {
                if (err) {
                    status = 500;
                    result.status = status;
                    result.error = err;
                    res.status(status).send(result);
                    return;
                }
                if (match) { //matched password
                    //implements jsonwebtoken
                    const payload = {
                        username: user.username,      //to know if has right to change albums/events/merch
                        userType: user.userType,
                        id: user._id
                    }; //to know what type of user is
                    const options = { expiresIn: '1d', issuer: 'http://localhost:8080/' };
                    const token = jwt.sign(payload, process.env.SECRET, options);
                    result.token = token;
                    result.status = status;
                    result.username = user.username;
                    result.userType = user.userType;
                    res.status(status).json(result);
                    return;
                } else {
                    status = 401;
                    result.status = status;
                    result.error = 'wrong password';
                    res.status(status).json(result);
                    return;
                }
            });

        } else {      //email not matching
            status = 404;
            result.status = status;
            result.error = "wrong email";
            res.status(status).send(result);
            return;
        }
    });
}



module.exports = {
    auth
};
