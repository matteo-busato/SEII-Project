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
        password: req.body.password
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

router.get('/drop', function(req,res){

    db.collection("user").remove(function(err, delOK) {
    if (err) throw err;
    if (delOK) console.log("Collection deleted");
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
