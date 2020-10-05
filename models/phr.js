const mongoose = require('mongoose');

const phrSchema = new mongoose.Schema({
    uuid: {
        type: String
    },
    edrIprId: {
        type: String
    },
    requesterStaffId: {
        type: String
    },
    createdTimeStamp: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String
    },
    invoice: {
        type: String
    },
    resolvedByStaffId: {
        type: String
    },
    resolvedTimeStamp: {
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

module.exports = mongoose.model('phr', phrSchema);
