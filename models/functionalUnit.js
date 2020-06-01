const mongoose = require('mongoose');

const functionalUnitSchema = new mongoose.Schema({
    uuid: {
        type: String
    },
    fuName: {
        type: String,
        required: [true, 'Please add name']
    },
    description: {
        type: String,
        required: [true, 'Please add description']
    },
    fuHead: {
        type: mongoose.Schema.ObjectId,
        ref: 'staff',
        required: [true, 'Please select Functional Unit Head']
    },
    status: {
        type: String
    },
    buId: {
        type: mongoose.Schema.ObjectId,
        ref: 'businessUnit',
        required: [true, 'Please select business unit']
    },
    fuLogId: {
        type: mongoose.Schema.ObjectId,
        ref: 'functionalUnitLogs'
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

module.exports = mongoose.model('functionalUnit', functionalUnitSchema);
