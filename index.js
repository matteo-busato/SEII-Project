
var express = require('express');
const events = require('./lib/events.js');
const mongoose = require('mongoose');

// instantiate express
const app = express();
app.use(express.json());

//connect to db 
mongoose.connect('mongodb://localhost:27017/SEII', {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
    console.log('connected to db');
    
    app.listen(port, () => {
        console.log('EasyMusic on port ' + port);
    });
});


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

//###### manage events ###########
app.post('/api/v1/artists/:name/events', events.addEvent);
app.delete('/api/v1/artists/:name/events/:id', events.removeEvent);
app.put('/api/v1/artists/:name/events/:id', events.changeEvent);
app.get('/api/v1/artists/:name/events/:id', events.getEvent);

//get instance of path, required to serve html pages (?)
const path = require('path');

app.get('/v1/artists/:name/events/addNewEvent', (req, res) => {
    res.sendFile(path.join(__dirname + '/UI/addNewEvent.html'));
});
app.get('/v1/artists/:name/events/:id/changeEventData', (req, res) => {
    res.sendFile(path.join(__dirname + '/UI/changeEventData.html'));
});
app.get('/v1/artists/:name/events/:id/deleteEvent', (req, res) => {
    res.sendFile(path.join(__dirname + '/UI/deleteEvent.html'));
});

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



//######################## for testing #############################
module.exports = app;
