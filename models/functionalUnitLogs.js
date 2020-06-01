const mongoose = require('mongoose');

const functionalUnitLogsSchema = new mongoose.Schema({
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
    fuId:{
        type: mongoose.Schema.ObjectId,
        ref: 'functionalUnit'
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

module.exports = mongoose.model('functionalUnitLogs', functionalUnitLogsSchema);
