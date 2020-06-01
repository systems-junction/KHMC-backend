const mongoose = require('mongoose');

const parSchema = new mongoose.Schema({
    uuid: {
        type: String
    },
    edrIprId: {
        type: String
    },
    requesterStaffId: {
        type: String
    },
    requestedTimeStamp: {
        type: Date,
        default: Date.now
    },
    parStatus: {
        type: String
    },
    updatedByStaffId: {
        type: String
    },
    updatedTimeStamp: {
        type: Date,
        default: Date.now
    },
    patientConsent: {
        type: String
    },
    refReqId: {
        type: String
    },
    requestType: {
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

module.exports = mongoose.model('par', parSchema);
