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

// test route to make sure everything is working
router.get('/test', function (req, res) {
    res.json({ message: 'API is working correctly!' });
});

//################## SET ROUTER #################
// register our router on /
app.use(express.static('UI'));
app.use('/', router);

//################## SET STATIC PAGES ###########
app.get('/register', (req, res) => {
    
    res.sendFile('UI/register.html', {root:'./'}, (err) => {
        res.end();
        console.log(err);
        if(err) throw(err);
    });
});

//############# registration part ################
const registration = require('./register/register.js');

app.post('/api/v1/users', registration.postRegister);

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