const index = require('../index');
const api = require('../api/userStory4');
const request = require('supertest');
const mongoose = require('mongoose');

describe('GET /api/v1/artists', () => {

    afterAll(async () => {
        try {
          // Connection to Mongo killed.
          await mongoose.disconnect();
        } catch (error) {
          console.log(`
            You did something wrong dummy!
            ${error}
          `);
          throw error;
        }
    });
    
    it('GET /api/v1/artists ', function (done) {
        request(index)
        .get('/api/v1/artists')
        .expect(200, done);
    });
});
