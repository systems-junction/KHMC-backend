const mongoose = require('mongoose');

const businessUnitLogsSchema = new mongoose.Schema({
    uuid: {
        type: String
    },
    status: {
        type: String
    },
    reason: {
        type: String 
    },
    updatedBy: {
        type: String
    },
    buId:{
        type: mongoose.Schema.ObjectId,
        ref: 'businessUnit'
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

module.exports = mongoose.model('businessUnitLogs', businessUnitLogsSchema);
