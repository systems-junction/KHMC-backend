const mongoose = require('mongoose');

const buRepRequestDetailsSchema = new mongoose.Schema({
    uuid: {
        type: String
    },
    buRepRequestId: {
        type: mongoose.Schema.ObjectId,
        ref: 'buRepRequest',
        required: [true, 'Please select Bu Rep Request']
    },
    itemId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Item',
        required: [true, 'Please select item']
    },
    qty: {
        type: Number,
        required: [true, 'Please enter quantity'],
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

module.exports = mongoose.model('buRepRequestDetails', buRepRequestDetailsSchema);