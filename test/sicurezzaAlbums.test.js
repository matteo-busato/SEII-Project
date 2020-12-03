const mongoose = require('mongoose');
const request = require('supertest');
const index = require('../index.js');
const events = require('../api/manageAlbum.js');

//In questo caso sono stati presi i test di "sicurezzaEventi.test.js" e adattati per queste API. 
//perchè le implementazioni della parte di sicurezza sono identiche.

describe('test POST authorization to /api/v1/artists/:name/albums', () => {

    test('post album without token', () => {
        return request(index)
        .post('/api/v1/artists/ale/albums')
        .set('Content-Type', 'application/json')
        .send({
            ismn: '123123',
            title: 'fakeAlbum',
            owner: 'ale',
            year: 2007,
            genre: "super black metal scandinavo",
            tracklist: "fake,this,album",
            cost: '13.9'
        })
        .expect(401, { error: 'Please login first' });
    });

    test('post album with valid token to another artist', () => {
        return request(index)
        .post('/api/v1/artists/bob/events')
        .set('Content-Type', 'application/json')
        .send({
            token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFsZSIsInVzZXJUeXBlIjoiYXJ0aXN0IiwiaWQiOiI1ZmI2OWI5NjlhZmU1YjI1ODA4N2Q4Y2YiLCJpYXQiOjE2MDY5ODc5NTAsImV4cCI6MTYwNzA3NDM1MCwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo4MDgwLyJ9.RZ80IsvW-9AH4W1nNeR28AtvDtvJubeuvG41s7S_a5Q",
            ismn: '123123',
            title: 'fakeAlbum',
            owner: 'bob',
            year: 2007,
            genre: "super black metal scandinavo",
            tracklist: "fake,this,album",
            cost: '13.9'
        })
        .expect(401, { error: 'You can\'t add an event for this artist' });
    });

    describe('test DELETE authorization to /api/v1/artists/:name/albums/:ismn', () => {

        test('delete album with invalid token', () => {
            return request(index)
            .delete('/api/v1/artists/ale/albums/69')
            .set('Content-Type', 'application/json')
            .send({
                token: "NotAValidToken"
            })
            .expect(403, {error: 'Failed to authenticate token'});
        });
    
        test('delete album with simple user token', () => {
            return request(index)
            .delete('/api/v1/artists/ale/albums/69')
            .set('Content-Type', 'application/json')
            .send({
                token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1hdHRlbyIsInVzZXJUeXBlIjoidXNlciIsImlkIjoiNWZjOTZjNWQ4MmFkODU3NzdjNDUxMWY1IiwiaWF0IjoxNjA3MDM2MDEwLCJleHAiOjE2MDcxMjI0MTAsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6ODA4MC8ifQ.-i_ozRvIjAiElXS5cOm4Pbtd0pMaVyYCldrMmmLe64w"
            })
            .expect(401, { error: "You must be an artist to access this page" });
        });
    
    });

    describe('test PUT authorization to /api/v1/artists/:name/albums/:ismn', () => {

        test('change album data without token', () => {
            return request(index)
            .put('/api/v1/artists/ale/albums/69')
            .set('Content-Type', 'application/json')
            .send({
                title: "new title"
            })
            .expect(401, { error: 'Please login first' });
        });
    
        test('change album data with valid token', () => {
            return request(index)
            .put('/api/v1/artists/ale/albums/69')
            .set('Content-type', 'application/json')
            .send({
                token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFsZSIsInVzZXJUeXBlIjoiYXJ0aXN0IiwiaWQiOiI1ZmI2OWI5NjlhZmU1YjI1ODA4N2Q4Y2YiLCJpYXQiOjE2MDcwMzY1ODMsImV4cCI6MTYwNzEyMjk4MywiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo4MDgwLyJ9.wpmBoSnSVq5paEteybsS4RV_FTJ1gvLL1M6E20mFEyw",
                description: 'changing description for testing'
            })
            .expect(201, { message: 'Event updated successfully' });
        });
    
    });

});

