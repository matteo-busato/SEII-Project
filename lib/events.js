const artists = [{ username: "autechre", email: "aemusic@ae.com", bio: "electronic duo", userType:'artist' },
{ username: "bob marley", email: "bob.marley@me.com", bio: "weed", userType:'artist' },
{ username: "beatles", email: "betles@me", bio: "softrockband", userType:'artist' },
{ username: "Meshuggah", email: "mesh@me", bio: "catsNcats", userType:'artist' },
{ username: "MeshuggahFanBoy", email: "meshFan@me", bio: "catsNcats", userType:'user' }];

  
const bcrypt = require('bcrypt');
const Event = require('../models/event');
const User = require('../models/user');

//INSERT ARTISTS FOR TESTING
for(a of artists){
    a.password = a.username+'1234';
    User(a).save();
}

function checkDate(date) {
    let re = new RegExp(/^(0?[1-9]|[12][0-9]|3[01])[\/](0?[1-9]|1[012])[\/]\d{4}[\ ](0?[0-9]|[1][0-9]|[2][0-3]):(0?[0-9]|[12345][0-9])$/);

    if (re.test(date))
        return true;
    else
        return false;
}

function toDate(dateStr) {
    let dmy = dateStr.split(" ")[0];
    let hm = dateStr.split(" ")[1];

    let date = dmy.split("/");
    let hourMin = hm.split(":");

    //year, month-1, day
    return new Date(date[2], date[1] - 1, date[0], hourMin[0], hourMin[1]);
}

/*
    Add new events
    POST api/v1/artists/:name/events
*/
const addEvent = async (req, res) => {

    let artist = req.params.name;

    let artistIn = await User.findOne({'username':artist, 'userType':'artist'}, (err) => {
        if(err) {
            res.status(500).json({ error: err });
            return;
        }
    });

    if(!artistIn){
        res.status(404).json({ error: 'The artist ' + artist + ' does not exist' });
        return;
    }

    let event = {
        title: req.body.title,
        date: req.body.date,
        place: req.body.place,
        description: req.body.description,
        cost: parseFloat(req.body.cost),
        owner: artist
    }

    //checks
    if (!event.title || typeof event.title != 'string') {
        res.status(400).json({ error: "The field 'title' must be a non-empty string" });
        return;
    }

    if (!event.date || typeof event.date != 'string') {
        res.status(400).json({ error: "The field 'date' must be a non-empty string" });
        return;
    }

    if (!checkDate(event.date)) {
        res.status(400).json({ error: "The field 'date' must be in the form dd/mm/yyyy hh:mm" });
        return;
    }
    event.date = toDate(event.date);

    let dates = await Event.findOne({ 'date': event.date, 'owner': artist }, function (err) {
        if (err) {
            res.status(500).json({ error: err });
            return;
        }
    });

    if (dates) {
        res.status(409).json({ error: "In this date there is already an event, please remove it first" });
        return;
    }

    if (!event.place || typeof event.place != 'string') {
        res.status(400).json({ error: "The field 'place' must be a non-empty string" });
        return;
    }

    if (!event.description || typeof event.description != 'string') {
        res.status(400).json({ error: "The field 'description' must be a non-empty string" });
        return;
    }

    if (isNaN(event.cost) || event.cost < 0.0) {
        res.status(400).json({ error: "The field 'cost' must be a decimal number greater than zero" });
        return;
    }


    let newEvent = new Event(event);
    newEvent = await newEvent.save(function (err, result) {
        if (err)
            res.status(500).json({ error: err });
        else
            res.status(201).json({ message: "The event has been correctly inserted in the db with id " + result.id });
    });
}

/*
    Remove an event
    DELETE /api/v1/artists/:name/events/:id
*/
const removeEvent = async (req, res) => {

    let artist = req.params.name;

    let artistIn = await User.findOne({'username':artist, 'userType':'artist'}, (err) => {
        if(err) {
            res.status(500).json({ error: err });
            return;
        }
    });

    if(!artistIn){
        res.status(404).json({ error: 'The artist ' + artist + ' does not exist' });
        return;
    }

    let id = req.params.id;

    if (!id || typeof id != 'string') {
        res.status(400).json({ error: 'The id field should be a non-empty string' });
        return;
    }

    let isIn = await Event.findOne({ '_id': id, 'owner': artist }, function (err) {
        if (err)
            if (err.kind == "ObjectId")
                res.status(400).json({ error: "The id is not valid" });
            else
                res.status(500).json({ error: err });

        return;
    });

    if (!isIn) {
        res.status(404).json({ error: 'There is no event with id ' + id + ' created by ' + artist });
        return;
    }

    await Event.remove({ '_id': id, 'owner': artist }, function (err) {
        if (err)
            res.status(500).json({ error: err });
        else
            res.status(200).json({ message: 'Event deleted successfully' });
    });

}

/*
    Change event data
    PUT /api/v1/artists/:name/events/:id
*/
const changeEvent = async (req, res) => {

    let artist = req.params.name;

    let artistIn = await User.findOne({'username':artist, 'userType':'artist'}, (err) => {
        if(err) {
            res.status(500).json({ error: err });
            return;
        }
    });

    if(!artistIn){
        res.status(404).json({ error: 'The artist ' + artist + ' does not exist' });
        return;
    }

    let id = req.params.id;

    if (!id || typeof id != 'string') {
        res.status(400).json({ error: 'The id field should be a non-empty string' });
        return;
    }

    let isIn = await Event.findOne({ '_id': id, 'owner': artist }, function (err) {
        if (err)
            if (err.kind == "ObjectId")
                res.status(400).json({ error: "The id is not valid" });
            else
                res.status(500).json({ error: err });

        return;
    });

    if (!isIn) {
        res.status(404).json({ error: 'There is no event with id ' + id + ' created by ' + artist });
        return;
    }


    let newEvent = {
        title: req.body.title,
        date: req.body.date,
        place: req.body.place,
        description: req.body.description,
        cost: req.body.cost
    }

    console.log("NEW EVENT = ", newEvent);

    //Errors checks
    if (newEvent.title != undefined && (!newEvent.title || typeof newEvent.title != 'string')) {
        res.status(400).json({ error: "The field 'title' must be a non-empty string" });
        return;
    }

    if (newEvent.date != undefined && (!newEvent.date || typeof newEvent.date != 'string')) {
        res.status(400).json({ error: "The field 'date' must be a non-empty string" });
        return;
    }

    if (newEvent.date != undefined && !checkDate(newEvent.date)) {
        res.status(400).json({ error: "The field 'date' must be in the form dd/mm/yyyy hh:mm" });
        return;
    }



    if (newEvent.date != undefined) {
        newEvent.date = toDate(newEvent.date);
        let dates = await Event.findOne({ 'date': newEvent.date, 'owner': artist }, function (err) {
            if (err) {
                res.status(500).json({ error: err });
                return;
            }
        });
        if (dates) {
            res.status(409).json({ error: "In this date there is already an event, please remove it first" });
            return;
        }
    }

    if (newEvent.place != undefined && (!newEvent.place || typeof newEvent.place != 'string')) {
        res.status(400).json({ error: "The field 'place' must be a non-empty string" });
        return;
    }

    if (newEvent.description != undefined && (!newEvent.description || typeof newEvent.description != 'string')) {
        res.status(400).json({ error: "The field 'description' must be a non-empty string" });
        return;
    }

    if (newEvent.cost != undefined) {
        newEvent.cost = parseFloat(newEvent.cost);
        if (isNaN(newEvent.cost) || newEvent.cost < 0.0) {
            res.status(400).json({ error: "The field 'cost' must be a decimal number greater than zero" });
            return;
        }
    }

    //Data insertion
    if (newEvent.title) {
        await Event.updateOne({ '_id': id, 'owner': artist }, { $set: { 'title': newEvent.title } }, (err) => {
            if (err) {
                res.status(500).json({ error: 'Error updating the db' });
                return;
            }
        });
    }

    if (newEvent.date) {
        await Event.updateOne({ '_id': id, 'owner': artist }, { $set: { 'date': newEvent.date } }, (err) => {
            if (err) {
                res.status(500).json({ error: 'Error updating the db' });
                return;
            }
        });
    }

    if (newEvent.place) {
        await Event.updateOne({ '_id': id, 'owner': artist }, { $set: { 'place': newEvent.place } }, (err) => {
            if (err) {
                res.status(500).json({ error: 'Error updating the db' });
                return;
            }
        });
    }

    if (newEvent.description) {
        await Event.updateOne({ '_id': id, 'owner': artist }, { $set: { 'description': newEvent.description } }, (err) => {
            if (err) {
                res.status(500).json({ error: 'Error updating the db' });
                return;
            }
        });
    }

    if (!isNaN(newEvent.cost)) {
        await Event.updateOne({ '_id': id, 'owner': artist }, { $set: { 'cost': newEvent.cost } }, (err) => {
            if (err) {
                res.status(500).json({ error: 'Error updating the db' });
                return;
            }
        });
    }

    res.status(201).json({ message: 'Event updated successfully' });
}

//Da decidere se lasciarla qua o no
// ######### GET EVENT DATA ########## 
// function for getting event data with get method (copiata da Matteo Busato)
const getEvent = (req, res) => {
    let artist = req.params.name;
    let id = parseInt(req.params.id);
    let found = false;
    for (let i = 0; i < events.length && !found; i++) {
        if (events[i].owner == artist && events[i].id == id) {
            res.status(200).json(events[i]);
            found = true;
        }
    }
    if (!found) {
        res.status(400).json({ error: 'no event with id : ' + id + ' from artist with name : ' + name });
    }
}

module.exports = {
    addEvent,
    removeEvent,
    changeEvent,
    getEvent
}