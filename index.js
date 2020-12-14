var express = require('express');
var bodyparser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// instantiate express
const app = express();
app.use(express.json());

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));


// get an instance of the express Router
var router = express.Router();

//get instance of APIs
const login = require('./api/login.js');
const userStory4 = require('./api/userStory4.js');
const registration = require('./api/register.js');
const events = require('./api/events.js');
const manageAlbum = require('./api/manageAlbum.js');
const manageMerch = require('./api/manageMerch.js');
const manageInfo = require('./api/manageInfo.js');
const follow = require('./api/follow.js');

const tokenChecker = require('./api/tokenChecker.js');

// test route to make sure everything is working
router.get('/test', function (req, res) {
    res.json({ message: 'API is working correctly!' });
});

//####################### connection to database ###############################
//connect to db 

mongoose.connect('mongodb+srv://' + process.env.DB_USER + ':' + process.env.DB_PASS + '@cluster0.hyvpx.mongodb.net/SEII?retryWrites=true&w=majority',
{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => {
    console.log('connected to db');
});

//connection to database
/*
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

/*
mongoose.connect('mongodb://localhost:27017/SEII', {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});
*/

//user model for database
const User = require('./models/user.js');
//album model for database
const Album = require('./models/album.js');
//event model for database
const Event = require('./models/event.js');
//product model for database
const Product = require('./models/product.js');

//################## SET STATIC PAGES ###########
app.use(express.static('UI'));
app.use("/UI_scripts", express.static('./UI_scripts/'));
app.use('/', router);
app.use(express.static('UI'));
app.use("/UI_scripts", express.static('./UI_scripts/'));

//check token for this pages
app.post('/api/v1/artists/:name/events', tokenChecker);
app.put('/api/v1/artists/:name/events', tokenChecker);
app.delete('/api/v1/artists/:name/events', tokenChecker);

app.post('/api/v1/artists/:name/events/:id', tokenChecker); 
app.put('/api/v1/artists/:name/events/:id', tokenChecker);
app.delete('/api/v1/artists/:name/events/:id', tokenChecker);

//route the login UI
app.get('/login', (req, res) => {
        res.sendFile('UI/login.html', {root:'./'}, (err) => {
        res.end();
        if(err) throw(err);
    });
});

//route the registration UI
app.get('/register', (req, res) => {    
    res.sendFile('UI/register.html', {root:'./'}, (err) => {
        res.end();
        console.log(err);
        if(err) throw(err);
    });
});



//####################################### SET static pages USERSTORY#4 #################

app.get('/artists', (req, res) => {
        res.sendFile('UI/artists.html', {root:'./'}, (err) => {
        res.end();
        if(err) throw(err);
    });
});

app.get('/albums', (req, res) => {
        res.sendFile('UI/albums.html', {root:'./'}, (err) => {
        res.end();
        if(err) throw(err);
    });
});

app.get('/merch', (req, res) => {
        res.sendFile('UI/merch.html', {root:'./'}, (err) => {
        res.end();
        if(err) throw(err);
    });
});

app.get('/events', (req, res) => {
        res.sendFile('UI/events.html', {root:'./'}, (err) => {
        res.end();
        if(err) throw(err);
    });
});

app.get('/artist-mainpage', (req, res) => {
        res.sendFile('UI/artist-mainpage.html', {root:'./'}, (err) => {
        res.end();
        if(err) throw(err);
    });
});

app.get('/artist-albums', (req, res) => {
        res.sendFile('UI/artist-albums.html', {root:'./'}, (err) => {
        res.end();
        if(err) throw(err);
    });
});

app.get('/artist-events', (req, res) => {
        res.sendFile('UI/artist-events.html', {root:'./'}, (err) => {
        res.end();
        if(err) throw(err);
    });
});

app.get('/artist-merch', (req, res) => {
        res.sendFile('UI/artist-merch.html', {root:'./'}, (err) => {
        res.end();
        if(err) throw(err);
    });
});

app.get('/artist-selected-album', (req, res) => {
        res.sendFile('UI/artist-selected-album.html', {root:'./'}, (err) => {
        res.end();
        if(err) throw(err);
    });
});

app.get('/artist-selected-event', (req, res) => {
        res.sendFile('UI/artist-selected-event.html', {root:'./'}, (err) => {
        res.end();
        if(err) throw(err);
    });
});

app.get('/artist-selected-merch', (req, res) => {
        res.sendFile('UI/artist-selected-merch.html', {root:'./'}, (err) => {
        res.end();
        if(err) throw(err);
    });
});

app.get('/mainpage', (req, res) => {
    res.sendFile('UI/mainPage.html', {root:'./'}, (err) => {
    res.end();
    if(err) throw(err);
});
});

//############# Change / add / remove albums/events/merch UI ################
//get instance of path, required to serve html pages (?)
const path = require('path');

app.get('/addNewEvent', (req, res) => {
    res.sendFile(path.join(__dirname + '/UI/addNewEvent.html'));
});
app.get('/changeEventData', (req, res) => {
    res.sendFile(path.join(__dirname + '/UI/changeEventData.html'));
});
app.get('/deleteEvent', (req, res) => {
    res.sendFile(path.join(__dirname + '/UI/deleteEvent.html'));
});
app.get('/addNewAlbum', (req, res) => {
    res.sendFile(path.join(__dirname + '/UI/addNewAlbum.html'));
});
app.get('/changeAlbumData', (req, res) => {
    res.sendFile(path.join(__dirname + '/UI/changeAlbumData.html'));
});
app.get('/deleteAlbum', (req, res) => {
    res.sendFile(path.join(__dirname + '/UI/deleteAlbum.html'));
});
app.get('/addNewProduct', (req, res) => {
    res.sendFile(path.join(__dirname + '/UI/addNewProduct.html'));
});
app.get('/changeProductData', (req, res) => {
    res.sendFile(path.join(__dirname + '/UI/changeProductData.html'));
});
app.get('/deleteProduct', (req, res) => {
    res.sendFile(path.join(__dirname + '/UI/deleteProduct.html'));
});

app.get('/addInfo', (req, res) => {
    res.sendFile(path.join(__dirname + '/UI/addInfo.html'));
});

app.get('/deleteInfo', (req, res) => {
    res.sendFile(path.join(__dirname + '/UI/deleteInfo.html'));
});

app.get('/changeInfo', (req, res) => {
    res.sendFile(path.join(__dirname + '/UI/changeInfo.html'));
});

//####################################### SET API USERSTORY#4 #################

app.get('/api/v1/overview',userStory4.getOverview);
app.get('/api/v1/overview/:name',userStory4.getOverview);

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

//############# login and registration api ################
app.post('/api/v1/users', registration.postRegister);
router.post('/api/v1/users/auth', login.auth);

//###### manage events api ###########
app.post('/api/v1/artists/:name/events', events.addEvent);
app.delete('/api/v1/artists/:name/events/:id', events.removeEvent);
app.put('/api/v1/artists/:name/events/:id', events.changeEvent);

//###### manage albums api ###########

app.use('/api/v1/artists/:name/albums', tokenChecker);
app.use('/api/v1/artists/:name/albums/:ismn', tokenChecker);

app.post('/api/v1/artists/:name/albums', manageAlbum.addNewAlbum);
app.delete('/api/v1/artists/:name/albums/:ismn', manageAlbum.deleteAlbum);
app.put('/api/v1/artists/:name/albums/:ismn', manageAlbum.changeAlbumData);
app.get('/api/v1/artists/:name/albums/:ismn', manageAlbum.getAlbum);

//############# manageMerch part ################
app.use('/api/v1/artists/:name/merch', tokenChecker);
app.use('/api/v1/artists/:name/merch/:id', tokenChecker);

app.post('/api/v1/artists/:name/merch', manageMerch.addNewProduct);
app.delete('/api/v1/artists/:name/merch/:id', manageMerch.deleteProduct);
app.put('/api/v1/artists/:name/merch/:id', manageMerch.changeProductData);
app.get('/api/v1/artists/:name/merch/:id', manageMerch.getProduct);

//############# manageInfo part ################
app.use('/api/v1/artists/:name', tokenChecker);

app.get('/api/v1/artists/:name', manageInfo.getInfo);
app.post('/api/v1/artists/:name', manageInfo.addInfo);
app.put('/api/v1/artists/:name', manageInfo.changeInfo);
app.delete('/api/v1/artists/:name', manageInfo.deleteInfo);

//############# follow artists part ################
app.use('/api/v1/artists/:name/follow', tokenChecker);
app.get('/api/v1/artists/:name/follow', follow.checkfollow);
app.post('/api/v1/artists/:name/follow', follow.follow);
app.delete('/api/v1/artists/:name/follow', follow.unfollow);

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
module.exports = app
