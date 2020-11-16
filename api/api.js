const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
var config = require('../config.js');

const User = require('../models/user.js');

//register a user
const register = (req, res) => {

    let result = {};
    let status = 201;

    var user = new User({           //create new User
            email: req.body.email,
            password: req.body.password,
            username: req.body.username,
            userType: "user"
        });

        user.save((err, user) => {
            if (!err) {
                result.status = status;
                result.result = user;
             }else{
                status = 500;
                result.status = status;
                result.error = err;
             }
                res.status(status).send(result);
        });
}

const auth = (req, res) => {

    let result = {};
    let status = 200;

    var email = req.body.email;
    var password = req.body.password;

    User.findOne( { email : email }, function (err,user) {
        if(!err && user){   //we look at password matching

            bcrypt.compare( password, user.password ).then( match => {
                if(match) { //matched password
                    //implements jsonwebtoken

                    const payload = { username: user.username,      //to know if has right to change albums/events/merch
                                        userType: user.userType }; //to know what type of user is

                    const options = { expiresIn: '1d', issuer: 'http://localhost:8080/' };
                    const secret = config.secret;
                    const token = jwt.sign(payload, secret, options);

                    result.token = token;

                    result.status = status;
                    result.result = user;
                }else{
                    status = 401;
                    result.status = status;
                    result.error = 'wrong password';
                }
                res.status(status).send(result);

            }).catch( err => {
                status = 500;
                result.status = status;
                result.error = err;
                res.status(status).send(result);
            });
        }else{      //email not matching
            status = 404;
            result.status = status;
            result.error = "wrong email";
            res.status(status).send(result);
        }
    });
}

const getUsers = (req,res) =>{

    const payload = req.decoded;
    // TODO: Log the payload here to verify that it's the same payload
    //  we used when we created the token
    console.log('PAYLOAD', payload);
    if(payload && payload.username === 'admin') {
        console.log("finding users...");
        User.find( function (err,users) {
            if(err) res.status(404).json({message: "error getting users."});
            else{
                var message = [];
                for(let i=0; i< users.length;i++){
                    message[i] = users[i].username ;
                }
                res.json({message: message });
            }
        });
    }else{
        res.status(401).send(`Authentication error`);
    }
}

const deleteUser = (req,res) =>{
    var id = req.params.id;
    User.findOneAndRemove({_id: id }, function(err){
        if(err) res.json("error:" + err)
        else{ res.json("removed user");}
    });
}


const  validateToken = (req, res, next) => {
    const authorizationHeaader = req.headers.authorization;
    let result;
    if(authorizationHeaader) {

        const token = req.headers.authorization.split(' ')[1]; // Bearer <token>
        const options = { expiresIn: '1d', issuer: 'http://localhost:8080/' };

        try{
            // verify makes sure that the token hasn't expired and has been issued by us
            result = jwt.verify(token, config.secret, options);
            // Let's pass back the decoded token to the request object
            req.decoded = result;
            // We call next to pass execution to the subsequent middleware
            next();
        }catch(err){
            // Throw an error just in case anything goes wrong with verification
            throw new Error(err);
        }
    }else{
        result = {
            error: `Authentication error. Token required.`,
            status: 401
        };
        res.status(401).send(result);
    }
}


module.exports = {
    register,
    auth,
    getUsers,
    deleteUser,
    validateToken
};
