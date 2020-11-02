const mongoose = require('mongoose');

const patientTriagingSchema = new mongoose.Schema({
    uuid: {
        type: String
    },
    edrIprId: {
        type: String
    },
    bloodPressure: {
        type: String
    },
    pulse: {
        type: String
    },
    temperature: {
        type: String
    },
    repositoryRate: {
        type: String
    },
    o2Saturation: {
        type: String
    },
    painScore: {
        type: String
    },
    staffId: {
        type: String
    },
    timeStamp: {
        type: Date,
        default: Date.now
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

module.exports = mongoose.model('patientTriaging', patientTriagingSchema);
