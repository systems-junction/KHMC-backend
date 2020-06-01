const mongoose = require('mongoose');

const edrIprSchema = new mongoose.Schema({
    uuid: {
        type: String
    },
    patientId: {
        type: String
    },
    createdTimeStamp: {
        type: Date,
        default: Date.now
    },
    createdStaffId: {
        type: String
    },
    status: {
        type: String
    },
    dischargeTimestamp: {
        type: Date,
        default: Date.now
    },
    type: {
        type: String
    },
    lrStatus: {
        type: String
    },
    rrStatus: {
        type: String
    },
    phrStatus: {
        type: String
    },
    doctorStaffId: {
        type: String
    },
    consultantId: {
        type: String
    },
    paymentMode: {
        type: String
    },
    chiefComplaint: {
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

module.exports = mongoose.model('edrIpr', edrIprSchema);
