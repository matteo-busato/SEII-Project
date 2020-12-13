const request = require('supertest');
const index = require('../index.js');
const mongoose = require('mongoose');

describe('test GET to /api/v1/overview and /api/v1/overview/:name', () => {

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

    it('get to /api/v1/overview/:name with invalid username', async function (done) {
        request(index)
        .get('/api/v1/overview/Not_A_User')
        .expect(200, done);
    });

    it('get to /api/v1/overview/:name with valid username', async function (done) {
        request(index)
        .get('/api/v1/overview/ale')
        .expect(200, done);
    });

});