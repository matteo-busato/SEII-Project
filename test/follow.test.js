const mongoose = require('mongoose');
const request = require('supertest');
const index = require('../index.js');


// Test dopo aver implementato l'autenticazione
describe("test security on apis", () => {
    
    beforeAll(async () => {
        jest.setTimeout(8080);
        jest.unmock('mongoose');
        console.log('Database connected!');
    });

    afterAll(async () => {
        try {
          // Connection to Mongo killed.
          await mongoose.disconnect();
        } catch (error) {
          console.log(`Error: ${error} `);
          throw error;
        }
    });

    it('follow an artist without a token should return an error', async function(done) {
        request(index)
        .post('/api/v1/artists/ale/follow')
        .send({
        })
        .expect(401, { error: 'Please login first' }, done)
    });

    it('An artist cannot follow himself', async function(done) {
        request(index)
        .post('/api/v1/artists/ale/follow')
        .send({
            token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFsZSIsInVzZXJUeXBlIjoiYXJ0aXN0IiwiaWQiOiI1ZmI2OWI5NjlhZmU1YjI1ODA4N2Q4Y2YiLCJpYXQiOjE2MDc1MTYyOTUsImV4cCI6MTYwNzYwMjY5NSwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo4MDgwLyJ9.ryWR_FaRyO2DHjgEys5QzhVm50XghV0iUzEtCTkm4XY"
        })
        .expect(400, { error: 'An artist cannot follow himself' }, done)
    });

    it('Artist already follow this artist', async function(done) {
        request(index)
        .post('/api/v1/artists/bob/follow')
        .send({
            token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFsZSIsInVzZXJUeXBlIjoiYXJ0aXN0IiwiaWQiOiI1ZmI2OWI5NjlhZmU1YjI1ODA4N2Q4Y2YiLCJpYXQiOjE2MDc1MTYyOTUsImV4cCI6MTYwNzYwMjY5NSwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo4MDgwLyJ9.ryWR_FaRyO2DHjgEys5QzhVm50XghV0iUzEtCTkm4XY"
        })
        .expect(400, {error: 'you already follow this artist'}, done)
    });

    it('Artist already don\'t follow this artist', async function(done) {
        request(index)
        .delete('/api/v1/artists/ale/follow ')
        .send({
            token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImJvYiIsInVzZXJUeXBlIjoiYXJ0aXN0IiwiaWQiOiI1ZmI2OWJhMjlhZmU1YjI1ODA4N2Q4ZDAiLCJpYXQiOjE2MDc1MjA1MjEsImV4cCI6MTYwNzYwNjkyMSwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo4MDgwLyJ9.jZLsAxKD5ItZOB86SelkCR-u5alVRxO81xrTw323vH0",
        })
        .expect(400, {error: 'you already don\'t follow this artist'}, done)
    });
    
});