var bodyparser = require('body-parser');
var express = require('express');

// instantiate express
const app = express();
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

// set our port
var port = process.env.PORT || 8080;

// get an instance of the express Router
var router = express.Router();

app.use(express.static('UI'));
app.use('/', router);

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test',{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

//connection to database
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("we're connected to db");
});

const User = require('./models/user.js');
// instantiate express


// insert a predefined user
app.post('/api/v1/insert'  ,function (req, res) {

    var user = new User({
        email: req.body.email,
        password: req.body.password,
        username: req.body.username,
        userType: "user"
    });

    console.log(user.email);
    console.log(user.password);

    user.save( function (err,data) {
        if(err){
            res.status(400).json({message: "error saving user." + err});
        }
        else{
            res.status(200).json({message: "saved new user." + user});
        }
    });
});

//get all the users
router.get('/find', function (req, res) {
    User.find( function (err,utente) {
        if(err) res.json({message: "error getting users."});
        else{
            var message = "users: ";
            res.json({message: utente });
        }
    });
});

//authenticate user - login
router.post('/api/v1/authenticate', function (req, res) {
    var email = req.body.email;
    var password = req.body.password;

    User.find( { email : email, password: password }, function (err,utente) {
        if(err)
            res.json({message: "email or password not matched"});
        else
            res.json({message: "user: " + utente });
    });
});

router.get('/drop/:id', function(req,res){
    var id = req.params.id;
    User.findOneAndRemove({_id: id }, function(err){
        if(err) res.json("error:" + err)
        else{ res.json("removed user");}
    });
})

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
