const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
    ismn: {
        type: 'Number',
        required: true,
        unique: true
    },
    title: {
        type: 'String',
        required: true,
        unique: false
    },
    owner: {
        type: 'String',
        required: true,
        unique: false
    },
    year: {
        type: 'Number',
        required: true,
        unique: false
    },
    genre: {
        type: 'String',
        required: true,
        unique: false
    },
    tracklist: {
        type: [String],
        required: true,
        unique: false
    },
    cost: {
        type: 'Number',
        required: true,
        unique: false
    }
});

module.exports = mongoose.model('Album', albumSchema);
