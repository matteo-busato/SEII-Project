const artists = [{ name: "autechre", email: "aemusic@ae.com", bio: "electronic duo" },
{ name: "bob marley", email: "bob.marley@me.com", bio: "weed" },
{ name: "beatles", email: "betles@me", bio: "softrockband" },
{ name: "Meshuggah", email: "mesh@me", bio: "catsNcats" }];

const events = [{ title: "debutalbum", id: "001", date: "10/10/21", description: "none", cost: 25.0, owner: "autechre" },
{ title: "secret show", id: "002", date: "10/10/??", description: "none", cost: 50.0, owner: "autechre" }];


//Use db
var incrementalId = 3

/*
 Add new events
 POST /api/v1/artists/:name/events
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
        cost: parseInt(req.body.cost),
        owner: req.body.owner
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

    if (!event.description || typeof event.description != 'string') {
        res.status(400).json({ error: "The field 'description' must be a non-empty string" });
        return;
    }

    //Todo cost - owner checks

}

function checkDate(date) {
    let re = new RegExp(/^(0?[1-9]|[12][0-9]|3[01])[\/](0?[1-9]|1[012])[\/]\d{4}$/);

    if (re.test(date))
        return true;
    else
        return false;
}