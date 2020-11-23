const index = require('../index');
const api = require('../api/userStory4');
const request = require('supertest');
const mongoose = require('mongoose');

describe('GET /api/v1/artists/', () => {

    afterAll(async () => {
        try {
          // Connection to Mongo killed.
          await mongoose.disconnect();
        } catch (error) {
          console.log(`Error: ${error} `);
          throw error;
        }
    });
    
    it('GET /api/v1/artists/:name with a name not present in db should return an error', function (done) {
      request(index)
      .get('/api/v1/artists/NotInDB')
      .expect(404, done);
    });

    it('GET /api/v1/artists/:name/albums/:ismn with a name not present in db should return an error', function(done){
      request(index)
      .get('/api/v1/artists/NotInDB/albums/2')
      .expect(404, done);
    });

    it('GET /api/v1/artists/:name/albums/:ismn with a non number ismn should return an error', function(done){
      request(index)
      .get('/api/v1/artists/Meshuggah/albums/AAAA')
      .expect(400, { error: 'error on ismn param'}, done);
    });

    it('GET /api/v1/artists/:name/albums/:ismn with a negative ismn should return an error', function(done){
      request(index)
      .get('/api/v1/artists/Meshuggah/albums/-10')
      .expect(404, { error: 'The album -10 does not exist' }, done);
    });
    
    it('GET /api/v1/artists/:name/albums/:ismn with a float ismn should use the integer part of the ismn', function(done){
      request(index)
      .get('/api/v1/artists/Meshuggah/albums/10.12')
      .expect(404,{ error: 'The album 10 does not exist' }, done);
    });

});
