const app = require("../index.js");
const fetch = require("node-fetch");
const mongoose = require('mongoose');
const request = require('supertest');

const url = "http://localhost:8080"

describe('api.test', () => {

    let server;
    let connection;

    beforeAll(async () => {
        jest.setTimeout(8000);
        jest.unmock('mongoose');
        connection = await mongoose.connect('mongodb://localhost/test', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });
        console.log('Database connected!');
    });

    afterAll(() => {
        mongoose.connection.close(true);
        console.log("Database connection closed");
    });

    //## 1 ##
    it('insert a product from an artist not presented in db', async () => {
        expect.assertions(1);
        var response = await fetch(url + '/api/v1/artists/artista sconosciuto/merch', {
            method: 'POST',
            body: JSON.stringify({
                title: "title",
                id: 123674,
                description: "none",
                qty: 12,
                cost: 30,
                owner: "artista sconosciuto"
            }),
            headers: {
                'Content-Type': 'application/json',
            }
        });
        var json = await response.json();
        expect(response.status).toEqual(404);
    });

    //## 2 ##
    it('insert a product with negative qty', async () => {
        expect.assertions(1);
        var response = await fetch(url + '/api/v1/artists/autechre/merch', {
            method: 'POST',
            body: JSON.stringify({
                title: "title",
                id: 1233424,
                description: "none",
                qty: -12,
                cost: 30,
                owner: "autechre"
            }),
            headers: {
                'Content-Type': 'application/json',
            }
        });
        var json = await response.json();
        expect(response.status).toEqual(400);
    });

    //## 3 ##
    it('insert a product with negative cost', async () => {
        expect.assertions(1);
        var response = await fetch(url + '/api/v1/artists/autechre/merch', {
            method: 'POST',
            body: JSON.stringify({
                title: "title",
                id: 124,
                description: "none",
                qty: 12,
                cost: -30,
                owner: "autechre"
            }),
            headers: {
                'Content-Type': 'application/json',
            }
        });
        var json = await response.json();
        expect(response.status).toEqual(400);
    });

});

