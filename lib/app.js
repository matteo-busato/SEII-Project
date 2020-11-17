const artists = [{name:"autechre",email:"aemusic@ae.com",bio:"electronic duo"},
                {name:"bob marley",email:"bob.marley@me.com",bio:"weed"},
                {name:"beatles",email:"betles@me",bio:"softrockband"},
                {name:"Meshuggah",email:"mesh@me",bio:"catsNcats"}];
const albums = [{title:"catch33",ismn:"435490",year:"2003",genre:"metal",tracklist:["track1","track2"],cost:10.0,owner:"Meshuggah"},
                {title:"catch66",ismn:"4354ew90",year:"2004",genre:"metal",tracklist:["track1","track2"],cost:10.0,owner:"Meshuggah"},
                {title:"catch0",ismn:"4354909",year:"2003",genre:"lounge",tracklist:["track1","track2"],cost:10.0,owner:"autechre"}];
const events = [{title:"debutalbum",id:"001",date:"10/10/21",description:"none",cost:25.0,owner:"autechre"},
                {title:"secret show",id:"002",date:"10/10/??",description:"none",cost:50.0,owner:"autechre"}];
const merch = [{ title:"coolshirt", id:"1234", description:"a cool t-shirt", cost:12.0, owner:"beatles"},
                { title:"coolsocks", id:"12ab", description:"a cool pair of socks with satanic symbols", cost:12.0, owner:"Meshuggah"}];

//return all the artists
// URI : api/v1/artists
const getArtists = (req,res) => {
    if (0) {    //db problems future implementations
        res.status(400).json({ error: 'error on artists' });
        return;
    }
    res.status(200).json(artists);
}

//return all the albums
// URI : api/v1/albums
const getAlbums = (req,res) => {
    if (0) {    //db problems future implementations
        res.status(400).json({ error: 'error on albums' });
        return;
    }
    res.status(200).json(albums);
}

//return all the merch
// URI : api/v1/merch
const getMerchs = (req,res) => {
    if (0) {    //db problems future implementations
        res.status(400).json({ error: 'error on merch' });
        return;
    }
    res.status(200).json(merch);
}

//return all the events
// URI : api/v1/events
const getEvents = (req,res) => {
    if (0) {    //db problems future implementations
        res.status(400).json({ error: 'error on events' });
        return;
    }
    res.status(200).json(events);
}

//return the selected artist
// URI : api/v1/artists/:name
const getArtist = (req,res) => {
    var found = false;
    var name = req.params.name;

    //check input params
    if (!name || typeof name != 'string') {
        res.status(400).json({ error: 'error on name param'});
        return ;
    }

    var data = [];
    for (let i=0; i < artists.length && !found; ++i) {
        if (artists[i].name == name){
            found = true;
            data.push(artists[i]);
        }
    }
    if(found){
        var books = [];
        var five = 0;
        for (let i=0; i < albums.length && five<5; ++i) {  //prendo i primi 5 album
            if (albums[i].owner == name){
                books.push(albums[i]);
                five++;
            }
        }
        var d = { "albums": books }
        data.push(d);

        var merchandise = [];
        five = 0;

        for (let i=0; i < merch.length && five<5; ++i) {  //prendo i primi 5 merch
            if (merch[i].owner == name){
                merchandise.push(merch[i]);
                five++;
            }
        }
        d = { "merch": merchandise }
        data.push(d);

        var concerts = [];
        five = 0;
        for (let i=0; i < events.length && five<5; ++i) {  //prendo i primi 5 album
            if (events[i].owner == name){
                concerts.push(events[i]);
                five++;
            }
        }
        d = { "events": concerts }
        data.push(d);

        res.status(200).json(data);
    }else{
        res.status(400).json({ error: 'no artist with name : ' + name });
    }
}

//return the selected album
// URI : api/v1/albums/:ismn
const getAlbum = (req,res) => {
    var found = false;
    var ismn = req.params.ismn;

    //check input params
    if (typeof ismn != 'number' || !isNaN(ismn)) {
        res.status(400).json({ error: 'error on ismn param'});
        return ;
    }

    for (let i=0; i < albums.length && !found; ++i) {
        if (albums[i].ismn == ismn){
            found = true;
            res.status(200).json(albums[i]);
        }
    }
    if(!found){
        res.status(400).json({ error: 'no album with ismn : ' + ismn });
    }
}

//return the selected merch
// URI : api/v1/merch/:id
const getMerch = (req,res) => {
    var found = false;
    var id = req.params.id;

    //check input params
    if (typeof id != 'number' || !isNaN(id)) {
        res.status(400).json({ error: 'error on id param'});
        return ;
    }

    for (let i=0; i < merch.length && !found; ++i) {
        if (merch[i].id == id){
            found = true;
            res.status(200).json(merch[i]);
        }
    }
    if(!found){
        res.status(400).json({ error: 'no merch with id :' + id });
    }
}

//return the selected event
// URI : api/v1/events/:id
const getEvent = (req,res) => {
    var found = false;
    var id = req.params.id;

    //check input params
    if (typeof id != 'number' || !isNaN(id)) {
        res.status(400).json({ error: 'error on id param'});
        return ;
    }

    for (let i=0; i < events.length && !found; ++i) {
        if (events[i].id == id){
            found = true;
            res.status(200).json(events[i]);
        }
    }
    if(!found){
        res.status(400).json({ error: 'no event with id : ' + id });
    }
}

//return all the albums of a selected artists
// URI : api/v1/artists/:name/albums
const getArtistAlbums = (req, res) => {
    let name = req.params.name;

    //check input params
    if (!name || typeof name != 'string') {
        res.status(400).json({ error: 'error on name param'});
        return ;
    }

    let selectedAlbum = [];
    for (let i=0; i < albums.length; ++i) {
        if (albums[i].owner == name){
            selectedAlbum.push(albums[i]);
        }
    }
    if(selectedAlbum.length > 0)
        res.status(200).json(selectedAlbum);
    else
        res.status(400).json({ error: 'no albums from artist with name : ' + name });
}

//return all the merch of a selected artists
// URI : api/v1/artists/:name/merch
const getArtistMerch = (req, res) => {
    let name = req.params.name;

    //check input params
    if (!name || typeof name != 'string') {
        res.status(400).json({ error: 'error on name param'});
        return ;
    }

    let selectedMerch = [];
    for (let i=0; i < merch.length; ++i) {
        if (merch[i].owner == name){
            selectedMerch.push(merch[i]);
        }
    }
    if(selectedMerch.length > 0)
        res.status(200).json(selectedMerch);
    else
        res.status(400).json({ error: 'no merch from artist with name : ' + name });
}

//return all the events of a selected artists
// URI : api/v1/artists/:name/events
const getArtistEvents = (req, res) => {
    let name = req.params.name;

    //check input params
    if (!name || typeof name != 'string') {
        res.status(400).json({ error: 'error on name param'});
        return ;
    }

    let selectedEvents = [];
    for (let i=0; i < events.length; ++i) {
        if (events[i].owner == name){
            selectedEvents.push(events[i]);
        }
    }
    if(selectedEvents.length > 0)
        res.status(200).json(selectedEvents);
    else
        res.status(400).json({ error: 'no events from artist with name : ' + name });
}

//return  the ismn album of a selected artist
// URI : api/v1/artists/:name/albums/:ismn
const getArtistAlbumIsmn = (req, res) => {
    let name = req.params.name;
    let ismn = req.params.ismn;

    //check input params
    if (typeof ismn != 'number' || !isNaN(ismn)) {
        res.status(400).json({ error: 'error on ismn param'});
        return ;
    }
    if (!name || typeof name != 'string') {
        res.status(400).json({ error: 'error on name param'});
        return ;
    }

    let found = false;
    for (let i=0; i < albums.length && !found; ++i) {
        if (albums[i].owner == name && albums[i].ismn == ismn){
            res.status(200).json(album[i]);
            found = true;
        }
    }
    if(!found)
        res.status(400).json({ error: 'no albums with ismn : ' + ismn + ' from artist with name : ' + name });
}
// return the id merch of a selected artist
// URI : /api/v1/artists/:name/merch/:id
const getArtistMerchId = (req, res) => {
    let name = req.params.name;
    let id = req.params.id;

    //check input params
    if (typeof id != 'number' || !isNaN(id)) {
        res.status(400).json({ error: 'error on id param'});
        return ;
    }
    if (!name || typeof name != 'string') {
        res.status(400).json({ error: 'error on name param'});
        return ;
    }

    let found = false;
    for (let i=0; i < merch.length && !found; ++i) {
        if (merch[i].owner == name && merch[i].id == id){
            res.status(200).json(merch[i]);
            found = true;
        }
    }
    if(!found)
        res.status(400).json({ error: 'no merch with id : ' + id + ' from artist with name : ' + name });
}

// return the id event of a selected artist
// URI : /api/v1/artists/:name/events/:id
const getArtistEventId = (req, res) => {
    let name = req.params.name;
    let id = req.params.id;

    //check input params
    if (typeof id != 'number' || !isNaN(id)) {
        res.status(400).json({ error: 'error on id param'});
        return ;
    }
    if (!name || typeof name != 'string') {
        res.status(400).json({ error: 'error on name param'});
        return ;
    }

    let found = false;
    for (let i=0; i < events.length && !found; ++i) {
        if (events[i].owner == name && events[i].id == id){
            res.status(200).json(events[i]);
            found = true;
        }
    }
    if(!found)
        res.status(400).json({ error: 'no event with id : ' + id + ' from artist with name : ' + name });
}

module.exports = {
    getArtists,
    getAlbums,
    getMerchs,
    getEvents,
    getArtist,
    getAlbum,
    getMerch,
    getEvent,
    getArtistAlbums,
    getArtistMerch,
    getArtistEvents,
    getArtistAlbumIsmn,
    getArtistMerchId,
    getArtistEventId
};
