const mongoose = require('mongoose');
const request = require('supertest');
const index = require('../index.js');
const events = require('../api/events.js');

describe('test POST authorization to /api/v1/artists/:name/events', () => {
    
    test('post event without token', () => {
        return request(index)
        .post('/api/v1/artists/ale/events')
        .set('Content-Type', 'application/json')
        .send({
            id: '7000',
            title: 'test concert',
            date: '29/02/2021 21:30',
            place: 'Milan',
            description: 'test event just for testing',
            cost: '25.50'
        })
        .expect(401, { error: 'Please login first' });
    });

    test('post event with valid token to another artist', () => {
        return request(index)
        .post('/api/v1/artists/bob/events')
        .set('Content-Type', 'application/json')
        .send({
            token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFsZSIsInVzZXJUeXBlIjoiYXJ0aXN0IiwiaWQiOiI1ZmI2OWI5NjlhZmU1YjI1ODA4N2Q4Y2YiLCJpYXQiOjE2MDY5ODc5NTAsImV4cCI6MTYwNzA3NDM1MCwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo4MDgwLyJ9.RZ80IsvW-9AH4W1nNeR28AtvDtvJubeuvG41s7S_a5Q",
            id: '7000',
            title: 'test concert',
            date: '29/02/2021 21:30',
            place: 'Milan',
            description: 'test event just for testing',
            cost: '25.50'
        })
        .expect(401, { error: 'You can\'t add an event for this artist' });
    });

});

describe('test DELETE authorization to /api/v1/artists/:name/events/:id', () => {

    test('delete event with invalid token', () => {
        return request(index)
        .delete('/api/v1/artists/ale/events/1')
        .set('Content-Type', 'application/json')
        .send({
            token: "NotAValidToken"
        })
        .expect(403, {error: 'Failed to authenticate token'});
    });

    test('delete event with simple user token', () => {
        return request(index)
        .delete('/api/v1/artists/ale/events/1')
        .set('Content-Type', 'application/json')
        .send({
            token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QiLCJ1c2VyVHlwZSI6InVzZXIiLCJpZCI6IjVmYzhiZjJhNTQ0MDI1M2QwMGIwMzAwNCIsImlhdCI6MTYwNjk5MTY3NiwiZXhwIjoxNjA3MDc4MDc2LCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwODAvIn0.r9ZHP5pQ6ej9vtE0-IK99gy7v-jNSslqyGDF-Ml_Zo8"
        })
        .expect(401, { error: "You must be an artist to access this page" });
    });

});

describe('test PUT authorization to /api/v1/artists/:name/events/:id', () => {

    test('change event data without token', () => {
        return request(index)
        .put('/api/v1/artists/ale/events/1')
        .set('Content-Type', 'application/json')
        .send({
            title: "new title"
        })
        .expect(401, { error: 'Please login first' });
    });

    test('change event data with valid token', () => {
        return request(index)
        .put('/api/v1/artists/ale/events/1')
        .set('Content-type', 'application/json')
        .send({
            token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFsZSIsInVzZXJUeXBlIjoiYXJ0aXN0IiwiaWQiOiI1ZmI2OWI5NjlhZmU1YjI1ODA4N2Q4Y2YiLCJpYXQiOjE2MDY5ODc5NTAsImV4cCI6MTYwNzA3NDM1MCwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo4MDgwLyJ9.RZ80IsvW-9AH4W1nNeR28AtvDtvJubeuvG41s7S_a5Q",
            description: 'changing description for testing'
        })
        .expect(201, { message: 'Event updated successfully' });
    });

});