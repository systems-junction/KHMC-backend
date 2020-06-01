const mongoose = require('mongoose');

const buRepRequestSchema = new mongoose.Schema({
    uuid: {
        type: String
    },
    buId: {
        type: mongoose.Schema.ObjectId,
        ref: 'businessUnit',
        required: [true, 'Please select Business unit']
    },
    requesterStaffId: {
        type: mongoose.Schema.ObjectId,
        ref: 'staff',
        required: [true, 'Please select Staff']
    },
    timeStamp: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        required: [true, 'Please add status'],
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

module.exports = mongoose.model('buRepRequest', buRepRequestSchema);
