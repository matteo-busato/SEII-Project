const { json } = require('body-parser');
var express = require('express');

// instantiate express
const app = express();
app.use(express.json());

// set our port
var port = process.env.PORT || 8080;


// get an instance of the express Router
var router = express.Router();

// test route to make sure everything is working
router.get('/test', function (req, res) {
    res.json({ message: 'API is working correctly!' });
});

//################## SET ROUTER ###########
app.use('/', router);
app.use(express.static('UI'));
app.use("/UI_scripts", express.static('./UI_scripts/'));

//################## connect to db #################

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/SEII', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("correctly connected to db");
});


//############# manageInfo part ################
const path = require('path');
const manageInfo = require('./lib/manageInfo.js');

app.get('/v1/artists/:name/addInfo', (req, res) => {
    res.sendFile(path.join(__dirname + '/UI/addInfo.html'));
});

app.get('/v1/artists/:name/deleteInfo', (req, res) => {
    res.sendFile(path.join(__dirname + '/UI/deleteInfo.html'));
});

app.get('/v1/artists/:name/changeInfo', (req, res) => {
    res.sendFile(path.join(__dirname + '/UI/changeInfo.html'));
});

app.get('/api/v1/artists/:name', manageInfo.getInfo);
app.post('/api/v1/artists/:name', manageInfo.addInfo);
app.put('/api/v1/artists/:name', manageInfo.changeInfo);
app.delete('/api/v1/artists/:name', manageInfo.deleteInfo);


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
