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

    it('POST /api/v1/artists/:name/merch without a token should return an error', async function(done) {
        request(index)
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
        request(index)
        .post('/api/v1/artists/ale/merch')
        .send({
            token:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImJvYiIsInVzZXJUeXBlIjoiYXJ0aXN0IiwiaWQiOiI1ZmI2OWJhMjlhZmU1YjI1ODA4N2Q4ZDAiLCJpYXQiOjE2MDcxNzIwNDIsImV4cCI6MTYwNzI1ODQ0MiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo4MDgwLyJ9.feCxr4nNL409go_4QQ1YYTNnGxW1xw-GsfGx1GftAn8",
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
        request(index)
        .post('/api/v1/artists/gino/merch')
        .send({
            token:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imdpbm8iLCJ1c2VyVHlwZSI6InVzZXIiLCJpZCI6IjVmYjY5ZjY4ZjNkMjAwMzVmMDEyMzEyMCIsImlhdCI6MTYwNzE3MjE4MywiZXhwIjoxNjA3MjU4NTgzLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwODAvIn0.XAFvZO0irTWeZpfpKcms_mCNJE-EDrJuwUODJHzqhSI",
            title: 'Test product 1',
            id: 12,
            description: 'Test product',
            qty: 10,
            cost: 20.00,
            owner: 'gino'
        })
        .expect(401, {error: "You must be an artist to access this page"}, done)
    });

    it('DELETE /api/v1/artists/:name/merch/:id with an invalid token should return an error', async function(done) {
        request(index)
        .delete('/api/v1/artists/ale/merch/11')
        .send({
            token: "NotValid",
        })
        .expect(403, {error: 'Failed to authenticate token'}, done)
    });

    it('PUT /api/v1/artists/:name/merch/:id without a token should return an error', async function(done) {
        request(index)
        .put('/api/v1/artists/ale/merch/11')
        .send({
        })
        .expect(401, { error: 'Please login first' }, done)
    });

    it('PUT /api/v1/artists/:name/merch/:id with a valid token should update the product successfully', async function(done) {
        request(index)
        .put('/api/v1/artists/ale/merch/11')
        .set('Content-Type', 'application/json')
        .send({
            token:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFsZSIsInVzZXJUeXBlIjoiYXJ0aXN0IiwiaWQiOiI1ZmI2OWI5NjlhZmU1YjI1ODA4N2Q4Y2YiLCJpYXQiOjE2MDcxNzMwODYsImV4cCI6MTYwNzI1OTQ4NiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo4MDgwLyJ9.DTsIW1Jvof_VdT90hWhcLXjrqILNvfY1N7mOeNwGPdQ",
            title:"collanina di oro"
        })
        .expect(201, { message: 'Product updated successfully' }, done)
    });

});