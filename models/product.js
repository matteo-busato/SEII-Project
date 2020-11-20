const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: {
        type: 'String',
        required: true,
        unique: false
    }, 
    id: {
        type: 'Number',
        required: true,
        unique: true
    },
    description: {
        type: 'String',
        required: true,
        unique: false
    },
    qty: {
        type: 'Number',
        required: true,
        unique: false
    },
    cost: {
        type: 'Number',
        required: true,
        unique: false
    },
    owner: {
        type: 'String',
        required: true,
        unique: false
    },
});

module.exports = mongoose.model('Product', productSchema);