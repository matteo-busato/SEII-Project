const { json } = require('body-parser');
var express = require('express');

// instantiate express
const app = express();
app.use(express.json());

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

app.get('/api/v1/artists',userStory4.getArtists);
app.get('/api/v1/albums',userStory4.getAlbums);
app.get('/api/v1/merch',userStory4.getMerchs);
app.get('/api/v1/events',userStory4.getEvents);
app.get('/api/v1/artists/:name',userStory4.getArtist);
app.get('/api/v1/albums/:ismn',userStory4.getAlbum);
app.get('/api/v1/merch/:id',userStory4.getMerch);
app.get('/api/v1/events/:id',userStory4.getEvent);
app.get('/api/v1/artists/:name/albums',userStory4.getArtistAlbums);
app.get('/api/v1/artists/:name/merch',userStory4.getArtistMerch);
app.get('/api/v1/artists/:name/events',userStory4.getArtistEvents);
app.get('/api/v1/artists/:name/albums/:ismn',userStory4.getArtistAlbumIsmn);
app.get('/api/v1/artists/:name/merch/:id',userStory4.getArtistMerchId);
app.get('/api/v1/artists/:name/events/:id',userStory4.getArtistEventId);


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
