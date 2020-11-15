const artists = [{ name: "autechre", email: "aemusic@ae.com", bio: "electronic duo" },
{ name: "bob marley", email: "bob.marley@me.com", bio: "weed" },
{ name: "beatles", email: "betles@me", bio: "softrockband" },
{ name: "Meshuggah", email: "mesh@me", bio: "catsNcats" }];

events = [{ title: "debutalbum", id: 1, date: "10/10/21", place: "Toronto", description: "none", cost: 25.0, owner: "autechre" },
{ title: "secret show", id: 2, date: "10/10/??",place: "Berlin", description: "none", cost: 50.0, owner: "autechre" }];


//Use db
var incrementalId = 3

function checkDate(date) {
    let re = new RegExp(/^(0?[1-9]|[12][0-9]|3[01])[\/](0?[1-9]|1[012])[\/]\d{4}$/);

    if (re.test(date))
        return true;
    else
        return false;
}

/*
    Add new events
    POST api/v1/artists/:name/events
*/
const addEvent = (req, res) => {

    let artist = req.params.name;

    //Use db
    if (!artists.some(a => a.name === artist)) {
        res.status(404).json({ error: 'The artist ' + artist + ' does not exist' });
        return;
    }

    let event = {
        title: req.body.title,
        id: incrementalId,
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
        res.status(400).json({ error: "The field 'date' must be in the form dd/mm/yyyy" });
        return;
    }

    if (events.some(e => (e.date === event.date && e.owner === artist))) {
        res.status(409).json({ error: "In this date there is already an event, please remove it first" });
        return;
    }

    if(!event.place || typeof event.place != 'string'){
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



    events.push(event);
    incrementalId += 1;
    res.status(201).json({ message: "The event has been correctly inserted in the db with id " + event.id });
    console.log(events);
}

/*
    Remove an event
    DELETE /api/v1/artists/:name/events/:id
*/
const removeEvent = (req, res) => {

    let artist = req.params.name;

    if (!artists.some(a => a.name === artist)) {
        res.status(404).json({ error: 'The artist ' + artist + ' does not exist' });
        return;
    }

    let id = parseInt(req.params.id);

    if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid id, please use an integer greater than zero' });
        return;
    }

    if (!events.some(e => (e.id === id && e.owner === artist))) {
        res.status(404).json({ error: 'There is no event with id ' + id + ' created by ' + artist });
        return;
    }

    //use db
    events = events.filter(e => (e.owner != artist || e.id != id));

    res.status(200).json({ message: 'Event deleted successfully' });
    console.log(events);

}

/*
    Change event data
    PUT /api/v1/artists/:name/events/:id
*/
const changeEvent = (req, res) => {

    let artist = req.params.name;

    if (!artists.some(a => a.name === artist)) {
        res.status(404).json({ error: 'The artist ' + artist + ' does not exist' });
        return;
    }

    let id = parseInt(req.params.id);

    if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid id, please use an integer greater than zero' });
        return;
    }

    let index = events.findIndex(e => (e.id === id && e.owner === artist));

    if (index == -1) {
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

    if (newEvent.date != undefined && events.some(e => (e.date === newEvent.date && e.owner === artist))) {
        res.status(409).json({ error: "In this date there is already an event, please remove it first" });
        return
    }

    if (newEvent.date != undefined && !checkDate(newEvent.date)) {
        res.status(400).json({ error: "The field 'date' must be in the form dd/mm/yyyy" });
        return;
    }

    if(newEvent.place != undefined && (!newEvent.place || typeof newEvent.place != 'string')){
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
        events[index].title = newEvent.title;
    }

    if (newEvent.date) {
        events[index].date = newEvent.date;
    }

    if (newEvent.place){
        events[index].place = newEvent.place;
    }

    if (newEvent.description) {
        events[index].description = newEvent.description;
    }

    if (!isNaN(newEvent.cost)) {
        events[index].cost = newEvent.cost;
    }

    res.status(201).json({ message: 'Event updated successfully' });
    console.log(events);

}

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