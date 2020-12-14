const request = require('supertest');
const index = require('../index.js');
const mongoose = require('mongoose');

describe('test api/v1/cart/type/:type/id/:id ', () => {

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

    it('POST to api/v1/cart/type/:type/id/:id with invalid type', async function (done) {
        request(index)
            .post('/api/v1/cart/type/caramelle/id/10')
            .set('Content-Type', 'application/json')
            .send({
                token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1hdHRlb28iLCJ1c2VyVHlwZSI6InVzZXIiLCJpZCI6IjVmZDBlM2FjZmJmY2Q0MzgxYWFlYmQzYSIsImlhdCI6MTYwNzk0MjU5OCwiZXhwIjoxNjA4MDI4OTk4LCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwODAvIn0.UJsPBh7JIGxyNFbQ7sRwl6SbioshgA1_zQKm4dOIvu4"
            })
            .expect(400, done);
    });

    it('DELETE to api/v1/cart/type/:type/id/:id with invalid id', async function (done) {
        request(index)
            .delete('/api/v1/cart/type/event/id/nonSonoUnID')
            .set('Content-Type', 'application/json')
            .send({
                token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1hdHRlb28iLCJ1c2VyVHlwZSI6InVzZXIiLCJpZCI6IjVmZDBlM2FjZmJmY2Q0MzgxYWFlYmQzYSIsImlhdCI6MTYwNzk0MjU5OCwiZXhwIjoxNjA4MDI4OTk4LCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwODAvIn0.UJsPBh7JIGxyNFbQ7sRwl6SbioshgA1_zQKm4dOIvu4"
            })
            .expect(400, done);
    });

    it('GET to api/v1/cart with invalid token', async function (done) {
        request(index)
            .post('/api/v1/cart')
            .set('Content-Type', 'application/json')
            .send({
                token: "eyJhbGciOiJIUzI1NiIsInR5cCIkpXVCJ9.eyJ1c2VybmFtZSI6ImFsZSIsInVzZXJUeXBlIjoiYXJ0aXN0IiwiaWQiOiI1ZmI2OWI5NjlhZmU1YjI1ODA4N2Q4Y2YiLCJpYXQiOjE2MDY5ODc5NTAsImV4cCI6MTYwNzA3NDM1MCwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo4MDgwLyJ9.RZ80IsvW-9AH4W1nNeR28AtvDtvJubeuvG41s7S_a5Q"
            })
            .expect(403, done);
    });

});