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

//####################################### SET ROUTER #################
// register our router on /
app.use('/', router);

//################## connect to db #################

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test', {
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

//############# manageMerch part ################

const path = require('path');

const manageMerch = require('./lib/manageMerch.js');

app.get('/v1/artists/:name/merch/addNewProduct', (req, res) => {
    res.sendFile(path.join(__dirname + '/UI/addNewProduct.html'));
});
app.get('/v1/artists/:name/merch/:id/changeProductData', (req, res) => {
    res.sendFile(path.join(__dirname + '/UI/changeProductData.html'));
});
app.get('/v1/artists/:name/merch/:id/deleteProduct', (req, res) => {
    res.sendFile(path.join(__dirname + '/UI/deleteProduct.html'));
});

app.post('/api/v1/artists/:name/merch', manageMerch.addNewProduct);
app.delete('/api/v1/artists/:name/merch/:id', manageMerch.deleteProduct);
app.put('/api/v1/artists/:name/merch/:id', manageMerch.changeProductData);
app.get('/api/v1/artists/:name/merch/:id', manageMerch.getProduct);

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
