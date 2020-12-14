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

    test('post info with valid token to another artist', async function (done) {
        request(index)
        .post('/api/v1/artists/bob/manageInfo')
        .set('Content-Type', 'application/json')
        .send({
            // needs new token every time
            token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFsZSIsInVzZXJUeXBlIjoiYXJ0aXN0IiwiaWQiOiI1ZmI2OWI5NjlhZmU1YjI1ODA4N2Q4Y2YiLCJpYXQiOjE2MDc5NDg3ODEsImV4cCI6MTYwODAzNTE4MSwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo4MDgwLyJ9.VVkzW6ZxnMDY2gyNCgL7VbTUWMae3IZ7-C1-bRRu9Z0",
            email: "bob@gmail.com",
            username: "bob",
            password: "$2b$10$e92CJEpRB1hmZlCOTa7OO.v2KtPxw13wCWjxTlOBLV6HO5KUldwa.",
            userType: "artist",
            bio: "Cool Rock Artist"
        })
        .expect(401, { error: 'You can\'t add info for this artist' }, done);
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


