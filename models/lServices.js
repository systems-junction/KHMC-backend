const mongoose = require('mongoose');

const lServicesSchema = new mongoose.Schema({
    uuid: {
        type: String
    },
    name: {
        type: String
    },
    price: {
        type: Number
    },
    description: {
        type: String
    },
    status: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('lServices', lServicesSchema);
