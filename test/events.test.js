const mongoose = require('mongoose');
const request = require('supertest');
const index = require('../index.js');
const events = require('../lib/events.js');

describe('test POST to /v1/api/artists/:name/events', () => {

    /*
    let connection;

    beforeAll(async () => {
        jest.setTimeout(8000);
        jest.unmock('mongoose');
        connection = await mongoose.connect('mongodb://localhost:27017/SEII', { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Database connected!');
    });

    afterAll(async () => {
        await mongoose.disconnect();
        console.log("Database connection closed");
    });
    */

    // test 1
    test('adding event with non-artist user', () => {
        return request(index)
            .post('/api/v1/artists/MeshuggahFanBoy/events')
            .set('Accept', 'application/json')
            .expect(404, { error: 'The artist MeshuggahFanBoy does not exist' });
    });

    // test 2
    test('adding event with empty title', () => {
        return request(index)
            .post('/api/v1/artists/beatles/events')
            .set('Accept', 'application/json')
            .send({
                title: '',
                date: '28/06/2021 23:00',
                place: 'Milan',
                description: 'no title event',
                cost: 20.00,
            })
            .expect(400, { error: "The field 'title' must be a non-empty string" });
    });

    // test 3
    test('adding event with negative cost', () => {
        return request(index)
            .post('/api/v1/artists/beatles/events')
            .set('Accept', 'application/json')
            .send({
                title: 'negative event',
                date: '30/11/2020 20:30',
                place: 'Milan',
                description: 'negative cost event',
                cost: -30.5
            })
            .expect(400, { error: "The field 'cost' must be a decimal number greater than zero" });
    });

    // test 4
    test('adding event with past date', () => {
        return request(index)
            .post('/api/v1/artists/beatles/events')
            .set('Accept', 'application/json')
            .send({
                title: 'event in the past',
                date: '28/06/1998 23:00',
                place: 'Milan',
                description: 'past event',
                cost: 20.00,
            })
            .expect(400, { error: "You can't add an event for a date in the past" });
    });
    
});

describe('test DELETE to api/v1/artists/:name/events/:id', () => {

    /*
    let connection;

    beforeAll(async () => {
        jest.setTimeout(8000);
        jest.unmock('mongoose');
        connection = await mongoose.connect('mongodb://localhost:27017/SEII', { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Database connected!');
    });

    afterAll(async () => {
        await mongoose.disconnect();
        console.log("Database connection closed");
    });
    */

    // test 5
    test('delete event of another artist', () => {
        return request(index)
            .delete('/api/v1/artists/Meshuggah/events/5fb7c763e326614b8c652f41')
            .set('Accept', 'application/json')
            .expect(404, { error: "There is no event with id 5fb7c763e326614b8c652f41 created by Meshuggah" });
    });

});

describe('test PUT to api/v1/artists/:name/events/:id', () => {

    // test 6
    test('change event data of another artist', () => {
        return request(index)
            .put('/api/v1/artists/Meshuggah/events/5fb7e0b7dae5a80808a78cc6')
            .set('Accept', 'application/json')
            .send({
                title: 'new title',
                place: 'Milan',
                cost: 30.00,
            })
            .expect(404, { error: "There is no event with id 5fb7e0b7dae5a80808a78cc6 created by Meshuggah" });
    });

    // test 7
    test('changing event title to empty title', () => {
        return request(index)
            .post('/api/v1/artists/beatles/events')
            .set('Accept', 'application/json')
            .send({
                title: '',
                place: 'Milan',
                description: 'no title event',
            })
            .expect(400, { error: "The field 'title' must be a non-empty string" });
    });

    // test 8
    test('changing event cost to a negative number', () => {
        return request(index)
        .put('/api/v1/artists/Meshuggah/events/5fb7e06cdae5a80808a78cc5')
        .set('Accept', 'application/json')
        .send({
            title: 'new title',
            place: 'Milan',
            cost: -30.00,
        })
        .expect(400, { error: "The field 'cost' must be a decimal number greater than zero" });    
    });

    // test 9
    test('sending a change data request with empty body', () => {
        return request(index)
        .put('/api/v1/artists/Meshuggah/events/5fb7e06cdae5a80808a78cc5')
        .set('Accept', 'application/json')
        .send({

        })
        .expect(201, { message: 'Event updated successfully'});
    });

    test('changing event date to date in the past', () => {
        return request(index)
        .put('/api/v1/artists/Meshuggah/events/5fb7e06cdae5a80808a78cc5')
        .set('Accept', 'application/json')
        .send({
            date: '30/06/1999 23:00'
        })
        .expect(400, { error: "The new date can't be a date in the past" });
    });

});

