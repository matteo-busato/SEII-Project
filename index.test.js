const app = require("./index.js");
const fetch = require("node-fetch");
const mongoose = require('mongoose');

const url = "http://localhost:8080"


describe('api.test', () => {

    let server;
    let connection;

  beforeAll( async ()  => {
    jest.setTimeout(8000);
    jest.unmock('mongoose');
    connection = await  mongoose.connect('mongodb://localhost/test',{
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    });
    console.log('Database connected!');
  });

  afterAll( () => {
    mongoose.connection.close(true);
    console.log("Database connection closed");
  });

// ## 1 ##
    it('insert info for an artist that is not in the db', async () => {
        expect.assertions(1);
        var response = await fetch(url + '/api/v1/artists/artista sconosciuto', {
            method: 'POST',
            body: JSON.stringify({
                email: "artistasconosciuto@me.it",
                username: "artista sconosciuto",
                password: "1234",
                userType: "artist",
                bio: "bio"
            }),
            headers: {
            'Content-Type': 'application/json',
            }
        });
        var json = await response.json();
        expect(response.status).toEqual(404);
    });

   //## 2 ##
   it('insert empty info for an artist', async () => {
    expect.assertions(1);
    var response = await fetch(url + '/api/v1/artists/Pantera', {
        method: 'POST',
        body: JSON.stringify({
            email: "Pantera@me.com",
            username: "Pantera",
            password: "$2b$10$lk8dDWC5NcZ9E6veC7clr.IzKEE3NHMOLKvnar4L.q1bgMgDdzyP6",
            userType: "artist",
            bio: ""
        }),
        headers: {
        'Content-Type': 'application/json',
        }
    });
    var json = await response.json();
    expect(response.status).toEqual(400);
});

//## 3 ##
it('try to modify non empty bio field for an artist', async () => {
    expect.assertions(1);
    var response = await fetch(url + '/api/v1/artists/Pantera', {
        method: 'POST',
        body: JSON.stringify({
            email: "Pantera@me.com",
            username: "Pantera",
            password: "$2b$10$lk8dDWC5NcZ9E6veC7clr.IzKEE3NHMOLKvnar4L.q1bgMgDdzyP6",
            userType: "artist",
            bio: "Metal"
        }),
        headers: {
        'Content-Type': 'application/json',
        }
    });
    var json = await response.json();
    expect(response.status).toEqual(300);
});


//## 4 ##
it('insert info for an artist', async () => {
    expect.assertions(1);
    var response = await fetch(url + '/api/v1/artists/Metallica', {
        method: 'POST',
        body: JSON.stringify({
            email: "Metallica@me.com",
            username: "Metallica",
            password: "$2b$10$lk8dDWC5NcZ9E6veC7clr.IzKEE3NHMOLKvnar4L.q1bgMgDdzyP6",
            userType: "artist",
            bio: "Metal"
        }),
        headers: {
        'Content-Type': 'application/json',
        }
    });
    var json = await response.json();
    expect(response.status).toEqual(201);
});



});