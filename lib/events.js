const artists = [{ name: "autechre", email: "aemusic@ae.com", bio: "electronic duo" },
{ name: "bob marley", email: "bob.marley@me.com", bio: "weed" },
{ name: "beatles", email: "betles@me", bio: "softrockband" },
{ name: "Meshuggah", email: "mesh@me", bio: "catsNcats" }];

const events = [{ title: "debutalbum", id: "001", date: "10/10/21", description: "none", cost: 25.0, owner: "autechre" },
{ title: "secret show", id: "002", date: "10/10/??", description: "none", cost: 50.0, owner: "autechre" }];


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
        res.status(404).json({ error: 'This artist does not exist' });
        return;
    }

    let event = {
        title: req.body.title,
        id: incrementalId,
        date: req.body.date,
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
    }

    if (events.some(e => (e.date === event.date && e.owner === artist))) {
        res.status(409).json({ error: "In this date there is already an event, please remove it first" });
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
    //console.log(events);
}

/*
    Remove an event
    DELETE /api/v1/artists/:name/events/:ID
*/
const removeEvent = (req, res) => {

    
}


module.exports = {
    addEvent
}