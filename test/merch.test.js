const app = require("../index.js");
const fetch = require("node-fetch");
const mongoose = require('mongoose');
const request = require('supertest');

const url = "http://localhost:8080"

// Test fatti da Mattia prima dell'autenticazione

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


// Test dopo aver implementato l'autenticazione
describe("test security on apis", () => {
    
    afterAll(async () => {
        try {
          // Connection to Mongo killed.
          await mongoose.disconnect();
        } catch (error) {
          console.log(`Error: ${error} `);
          throw error;
        }
    });

    it('POST /api/v1/artists/:name/merch without a token should return an error', async function(done) {
        request(app)
        .post('/api/v1/artists/ale/merch')
        .send({
            title: 'Test product 1',
            id: 12,
            description: 'Test product',
            qty: 10,
            cost: 20.00,
            owner: 'ale'
        })
        .expect(401, { error: 'Please login first' }, done)
    });

    it('POST /api/v1/artists/:name/merch with the token of another artist should return an error', async function(done) {
        request(app)
        .post('/api/v1/artists/ale/merch')
        .send({
            token:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImJvYiIsInVzZXJUeXBlIjoiYXJ0aXN0IiwiaWQiOiI1ZmI2OWJhMjlhZmU1YjI1ODA4N2Q4ZDAiLCJpYXQiOjE2MDcwNzA3MDgsImV4cCI6MTYwNzE1NzEwOCwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo4MDgwLyJ9.65QwC_vfVaO0nPjFdEkFar4Bg6bvf5LijWwMmAVv9UA",
            title: 'Test product 1',
            id: 12,
            description: 'Test product',
            qty: 10,
            cost: 20.00,
            owner: 'ale'
        })
        .expect(401, {error: "You can't add an product for this artist"}, done)
    });

    it('POST /api/v1/artists/:name/merch with the token of a user that is not an artist should return an error', async function(done) {
        request(app)
        .post('/api/v1/artists/gino/merch')
        .send({
            token:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imdpbm8iLCJ1c2VyVHlwZSI6InVzZXIiLCJpZCI6IjVmYjY5ZjY4ZjNkMjAwMzVmMDEyMzEyMCIsImlhdCI6MTYwNzA3MTEwNiwiZXhwIjoxNjA3MTU3NTA2LCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwODAvIn0.zIT5sA6zKSI_z03IAgSJok5-G1W_vr-XTmeA4nGK1Q0",
            title: 'Test product 1',
            id: 12,
            description: 'Test product',
            qty: 10,
            cost: 20.00,
            owner: 'gino'
        })
        .expect(401, {error: "You must be an artist to access this page"}, done)
    });

});