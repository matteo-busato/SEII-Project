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

//################## SET ROUTER #################
// register our router on /
app.use('/', router);


//############# insertMusic part ################

//get instance of path, required to serve html pages (?)
const path = require('path');

const insertMusic = require('./lib/insertMusic.js');

app.get('/v1/profiles/:name/albums/addNewAlbum', (req, res) => {
    res.sendFile(path.join(__dirname + '/UI/addNewAlbum.html'));
});
app.get('/v1/profiles/:name/albums/:ismn/changeAlbumData', (req, res) => {
    res.sendFile(path.join(__dirname + '/UI/changeAlbumData.html'));
});
app.get('/v1/profiles/:name/albums/:ismn/deleteAlbum', (req, res) => {
    res.sendFile(path.join(__dirname + '/UI/deleteAlbum.html'));
});

app.post('/api/v1/artists/:name/albums', insertMusic.addNewAlbum);
app.delete('/api/v1/artists/:name/albums/:ismn', insertMusic.deleteAlbum);
app.put('/api/v1/artists/:name/albums/:ismn', insertMusic.changeAlbumData);
app.get('/api/v1/artists/:name/albums/:ismn', insertMusic.getAlbum);

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
