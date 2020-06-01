const mongoose = require('mongoose');

const staffTypeSchema = new mongoose.Schema({
    uuid: {
        type: String
    },
    type: {
        type: String,
        required: [true, 'Please add type']
    },
    description: {
        type: String,
        required: [true, 'Please add description']
    },
    accessLevel: {
        type: String,
        required: [true, 'Please add access level']
    },
    status: {
        type: String,
        required: [true, 'Please add status']
    },
    createdBySystemAdminStaffId: {
        type: mongoose.Schema.ObjectId,
        ref: 'systemAdmin',
        required: [true, 'Please select System admin']
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

module.exports = mongoose.model('staffType', staffTypeSchema);
