const mongoose = require('mongoose');

const ecrNotesSchema = new mongoose.Schema({
    uuid: {
        type: String
    },
    ecrId: {
        type: String
    },
    consultationNotes: {
        type: String,
        required: [true, 'Please add Consultation Notes']
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

module.exports = mongoose.model('ecrNotes', ecrNotesSchema);
