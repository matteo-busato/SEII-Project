const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const User = require('../models/user.js');

function checkEmail(email){
    re = new RegExp(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/);

    if(re.test(email))
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
    if(!email || typeof email != 'string' ){
        res.status(404).json("The field 'email' must be a non-empty string");
        return;
    }
    if(!checkEmail(email)){
        res.status(404).json({ error: "Invalid email format"});
        return;
    }
    if(!password || typeof password != 'string'){
        res.status(401).json({ error: "The field 'password' must be a non-empty string"});
        return;
    }

    User.findOne( { email : email }, function (err,user) {
        if(!err && user){   //we look at password matching

            bcrypt.compare( password, user.password ).then( match => {
                if(match) { //matched password
                    //implements jsonwebtoken

                    const payload = { username: user.username,      //to know if has right to change albums/events/merch
                                        userType: user.userType,
                                        id: user._id                }; //to know what type of user is

                    const options = { expiresIn: '1d', issuer: 'http://localhost:8080/' };
                    const token = jwt.sign(payload, process.env.SECRET, options);

                    result.token = token;
                    result.status = status;
                    result.username = user.username;
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

/*  SOME SPARE APIs
//get all the usernames ( only if you are an admin)
// URI: GET: /api/v1/users
const getUsers = (req,res) =>{

    const payload = req.decoded;
    //const payload = req.header['x-access-token'];
    if(payload && payload.userType === 'admin') {
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

//delete user only if it is your account or if you are an admin
//URI: DELETE: api/v1/users
const deleteUser = (req,res) =>{
    const payload = req.decoded;
    var username = req.params.username;
    //const payload = req.header['x-access-token'];
    if(payload && (payload.userType === 'admin' || payload.username === username) ) {

        User.findOneAndRemove({username: username }, function(err){
            if(err) res.status(500).json("error:" + err)
            else{ res.status(200).json("removed user");}
        });
    }else{
        res.status(401).send(`Authentication error`);
    }
}
*/

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
    auth
    /*
    deleteUser,
    validateToken
    */
};
