const { json } = require('body-parser');
var express = require('express');

// instantiate express
const app = express();
app.use(express.json());

//const insertMusic = require('./insertMusic/insertMusic.js');
const userStory4 = require('./userStory#4/app.js');

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
/*
app.post('/api/addNewAlbum', insertMusic.addNewAlbum);
app.delete('/api/deleteAlbum', insertMusic.deleteAlbum);
app.post('/api/changeAlbumData', insertMusic.changeAlbumData);
*/
app.get('/api/artists/:name',userStory4.getArtist);
app.get('/api/artists',userStory4.getArtists);
app.get('/api/albums',userStory4.getAlbums);
app.get('/api/merch',userStory4.getMerchs);
app.get('/api/events',userStory4.getEvents);
app.get('/api/artists/:name',userStory4.getArtist);
app.get('/api/albums/:ismn',userStory4.getAlbum);
app.get('/api/merch/:id',userStory4.getMerch);
app.get('/api/events/:id',userStory4.getEvent);
app.get('/api/artists/:name/albums',userStory4.getArtistAlbum);


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
