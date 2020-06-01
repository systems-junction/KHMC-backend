const mongoose = require('mongoose');

const surgeryServicesSchema = new mongoose.Schema({
    uuid: {
        type: String
    },
    name: {
        type: String
    },
    description: {
        type: String
    },
    status: {
        type: Number
    },
    price: {
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

module.exports = mongoose.model('surgeryServices', surgeryServicesSchema);
