var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const eventSchema = new Schema({
    id:{
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true,
        unique: false
    },
    date: {
        type: Date,
        required: true,
        unique: false
    },
    place: {
        type: String,
        required: true,
        unique: false
    },
    description: {
        type: String,
        required: true,
        unique: false
    },
    cost:{
        type: Number,
        required: true,
        unique: false
    },
    owner:{
        type: String,
        required: true,
        unique: false
    }
}, {collection: 'events'});

module.exports = mongoose.model('Event', eventSchema);
