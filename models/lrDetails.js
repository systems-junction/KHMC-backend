const mongoose = require('mongoose');

const lrDetailsSchema = new mongoose.Schema({
    uuid: {
        type: String
    },
    results: {
        type: String
    },
    lrId: {
        type: String
    },
    lServicesId: {
        type: String
    },
    amount: {
        type: Number
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

module.exports = mongoose.model('lrDetails', lrDetailsSchema);
