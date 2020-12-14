const mongoose = require('mongoose');
const request = require('supertest');
const index = require('../index.js');
const merch = require('../api/manageMerch.js');

// Test dopo aver implementato l'autenticazione
describe("test security on apis", () => {
    
    beforeAll(async () => {
        jest.setTimeout(8000);
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

    it('POST /api/v1/artists/:name/ without a token should return an error', async function(done) {
        request(index)
        .post('/api/v1/artists/ale/manageInfo')
        .send({
            email: "ale@gmail.com",
            username: "Ale",
            password: "ale1234",
            userType: "artist",
            bio: "Cool Rock Artist"
        })
        .expect(401, { error: 'Please login first' }, done)
    });

    it('POST /api/v1/artists/:name/manageInfo with the token of another artist should return an error', async function(done) {
        request(index)
        .post('/api/v1/artists/ale/manageInfo')
        .send({
            token:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImJvYiIsInVzZXJUeXBlIjoiYXJ0aXN0IiwiaWQiOiI1ZmI2OWJhMjlhZmU1YjI1ODA4N2Q4ZDAiLCJpYXQiOjE2MDcxNzIwNDIsImV4cCI6MTYwNzI1ODQ0MiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo4MDgwLyJ9.feCxr4nNL409go_4QQ1YYTNnGxW1xw-GsfGx1GftAn8",
            email: "ale@gmail.com",
            username: "Ale",
            password: "ale1234",
            userType: "artist",
            bio: "Cool Rock Artist"
        })
        .expect(401, {error: "You can't add an product for this artist"}, done)
    });

    it('DELETE /api/v1/artists/:name/manageInfo with an invalid token should return an error', async function(done) {
        request(index)
        .delete('/api/v1/artists/ale/manageInfo')
        .send({
            token: "NotValid",
        })
        .expect(403, {error: 'Failed to authenticate token'}, done)
    });

    it('PUT /api/v1/artists/:name/manageInfo without a token should return an error', async function(done) {
        request(index)
        .put('/api/v1/artists/ale/manageInfo')
        .send({
        })
        .expect(401, { error: 'Please login first' }, done)
    });
});