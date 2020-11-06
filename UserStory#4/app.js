const artists = [{name:"autechre",email:"aemusic@ae.com",bio:"electronic duo"},
                {name:"bob marley",email:"bob.marley@me.com",bio:"weed"},
                {name:"beatles",email:"betles@me",bio:"softrockband"},
                {name:"Meshuggah",email:"mesh@me",bio:"catsNcats"}];
const albums = [{title:"catch33",ismn:"435490",year:"2003",genre:"metal",tracklist:[{uno:"track1",due:"track2"}],cost:10.0,owner:"Meshuggah"},
                {title:"catch66",ismn:"4354ew90",year:"2004",genre:"metal",tracklist:[{uno:"track1",due:"track2"}],cost:10.0,owner:"Meshuggah"},
                {title:"catch0",ismn:"435490",year:"2003",genre:"lounge",tracklist:[{uno:"track1",due:"track2"}],cost:10.0,owner:"autechre"}];
const events = [{title:"debutalbum",id:"001",date:"10/10/21",description:"none",cost:25.0,owner:"autechre"},
                {title:"secret show",id:"002",date:"10/10/??",description:"none",cost:50.0,owner:"autechre"}];
const merch = [{ title:"coolshirt", id:"1234", description:"a cool t-shirt", cost:12.0, owner:"beatles"}];

//return all the artists
// URI : api/artists
const getArtists = (req,res) => {
    if (0) {
        res.status(400).json({ error: 'error on retrying artists' });
        return;
    }
    res.status(200).json(artists);
}

//return all the albums
// URI : api/albums
const getAlbums = (req,res) => {
    if (0) {
        res.status(400).json({ error: 'error on retrying albums' });
        return;
    }
    res.status(200).json(albums);
}

//return all the merch
// URI : api/merch
const getMerchs = (req,res) => {
    if (0) {
        res.status(400).json({ error: 'error on retrying merch' });
        return;
    }
    res.status(200).json(merch);
}

//return all the events
// URI : api/events
const getEvents = (req,res) => {
    if (0) {
        res.status(400).json({ error: 'error on retrying events' });
        return;
    }
    res.status(200).json(events);
}

//return the selected artist
// URI : api/artists/{artist-name}
const getArtist = (req,res) => {
    var found = false;
    var name = req.params.name;
    for (let i=0; i < artists.length && !found; ++i) {
        if (artists[i].name == name){
            found = true;
            res.status(200).json(artists[i]);
        }
    }
    if(!found){
        res.status(400).json({ error: 'no artist with name : ' + name });
    }
}

//return the selected album
// URI : api/albums/{ismn}
const getAlbum = (req,res) => {
    var found = false;
    var ismn = req.params.ismn;
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
// URI : api/merch/{ID}
const getMerch = (req,res) => {
    var found = false;
    var id = req.params.id;
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
// URI : api/events/{ID}
const getEvent = (req,res) => {
    var found = false;
    var id = req.params.id;
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
// URI : api/artists/{artist-name}/albums
const getArtistAlbum = (req, res) => {
    var name = req.params.name;
    var selectedAlbum = [];
    for (let i=0; i < albums.length; ++i) {
        if (albums[i].owner == name){
            selectedAlbum.append[albums[i]];
        }
    }
    if(selectedAlbum.length > 0)
        res.status(200).json(selectedAlbum);
    else
        res.status(400).json({ error: 'no albums from artist with name : ' + name });
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
    getArtistAlbum
};
