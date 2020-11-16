
var bodyparser = require('body-parser');
var express = require('express');

const mongoose = require('mongoose');
// instantiate express
const app = express();
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

// set our port
var port = process.env.PORT || 8080;

// get an instance of the express Router
var router = express.Router();
const api = require('./api/api.js');

app.use(express.static('UI'));
app.use('/', router);

//####################### connection to database ###############################
//including system congifuration
var config = require('./config.js');    //includes user and password for database, secret password for tokens

mongoose.connect( config.database.uri ,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

//connection to database
const db = mongoose.connection;
db.on('error', console.error.bind( console , 'connection error:' ) );
db.once('open', function() {
  console.log("we're connected to db");
});

//##############################################################################

//user model for database
const User = require('./models/user.js');


// insert a user
app.post('/api/v1/users', api.register );

//authenticate user - login
router.post('/api/v1/users/auth', api.auth);

//get all the name of users
router.get('/api/v1/users', api.getUsers );


//delete a user by its _id
router.delete('/api/v1/users', api.deleteUser );

//route the login UI
app.get('/login', (req, res) => {
        res.sendFile('UI/login.html', {root:'./'}, (err) => {
        res.end();
        if(err) throw(err);
    });
});

//####################################### SET ROUTER #################
// register our router on /
app.use('/', router);

// handle invalid requests and internal error
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({ error: { message: err.message } });
});

//####################################################################

app.listen(port);
console.log('EasyMusic on port ' + port);
