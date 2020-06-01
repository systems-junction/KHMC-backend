const mongoose = require('mongoose');

const ecrSchema = new mongoose.Schema({
    uuid: {
        type: String
    },
    edrIprId: {
        type: String
    },
    createdTimeStamp: {
        type: Date,
        default: Date.now
    },
    staffId: {
        type: String
    },
    resolvedTimeStamp: {
        type: Date,
        default: Date.now
    },
    consultantId: {
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

module.exports = mongoose.model('ecr', ecrSchema);
