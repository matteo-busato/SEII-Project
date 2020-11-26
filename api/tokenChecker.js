const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const tokenChecker = function (req, res, next) {
    //retrieve token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    //if there is no token return an error
    if (!token) {
        return res.status(401).json({ error: 'no token provided' });
    }

    //decode and verify token
    jwt.verify(token, process.env.SECRET, function (err, decoded) {
        if (err){
            return res.status(403).json({error: 'Failed to authenticate token'});
        } else {
            req.loggedUser = decoded;
            next();
        }
    });

}

module.exports = tokenChecker