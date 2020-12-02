const app = require("../index.js");
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

//## 1 ##
    it('insert an album from an artist not presented in db', async () => {
        expect.assertions(1);
        var response = await fetch(url + '/api/v1/artists/artista sconosciuto/albums', {
            method: 'POST',
            body: JSON.stringify({
                ismn: 213,
                title: "100%",
                year: 2016,
                tracklist: ["lite nite","joy is a cool guy"],
                genre: "electronic",
                cost: 30
            }),
            headers: {
            'Content-Type': 'application/json',
            }
        });
        var json = await response.json();
        expect(response.status).toEqual(404);
    });


//## 2 ##
    it('insert an album from an artist with negative cost', async () => {
        expect.assertions(1);
        var response = await fetch(url + '/api/v1/artists/autechre/albums', {
            method: 'POST',
            body: JSON.stringify({
                ismn: 432,
                title: "paranoid",
                year: 2010,
                tracklist: ["paranoid","crazy train"],
                genre: "metal",
                cost: -35
            }),
            headers: {
            'Content-Type': 'application/json',
            }
        });
        var json = await response.json();
        expect(response.status).toEqual(400);
    });


//## 3 ##
    it('insert an album with a future year date', async () => {
        expect.assertions(1);
        var response = await fetch(url + '/api/v1/artists/autechre/albums', {
            method: 'POST',
            body: JSON.stringify({
                ismn: 111,
                title: "paranoid",
                year: 2032,
                tracklist: ["paranoid","crazy train"],
                genre: "metal",
                cost: 35
            }),
            headers: {
            'Content-Type': 'application/json',
            }
        });
        var json = await response.json();
        expect(response.status).toEqual(400);
    });


//## 4 ##
    it('insert an album to a user that are not an artist ( user or admin )', async () => {
        expect.assertions(1);
        var response = await fetch(url + '/api/v1/artists/admin/albums', {
            method: 'POST',
            body: JSON.stringify({
                ismn: 4321,
                title: "paranoid",
                year: 2020,
                tracklist: ["paranoid","crazy train"],
                genre: "metal",
                cost: 35
            }),
            headers: {
            'Content-Type': 'application/json',
            }
        });
        var json = await response.json();
        expect(response.status).toEqual(404);
    });


//## 5 ##
    it('insert an album with no traklist', async () => {
        expect.assertions(1);
        var response = await fetch(url + '/api/v1/artists/autechre/albums', {
            method: 'POST',
            body: JSON.stringify({
                ismn: 666,
                title: "paranoid",
                year: 2020,
                tracklist: '',
                genre: "metal",
                cost: 35
            }),
            headers: {
            'Content-Type': 'application/json',
            }
        });
        var json = await response.json();
        expect(response.status).toEqual(400);
    });

    //## 6 ##
    it('insert an album from an artist with float cost', async () => {
        expect.assertions(1);
        var response = await fetch(url + '/api/v1/artists/autechre/albums', {
            method: 'POST',
            body: JSON.stringify({
                ismn: 433212,
                title: "paranoiaAtomicaMafloat",
                year: 2010,
                tracklist: ["paranoid","crazy train"],
                genre: "metal",
                cost: 35.5
            }),
            headers: {
            'Content-Type': 'application/json',
            }
        });
        var json = await response.json();
        expect(response.status).toEqual(200);
    });



});
