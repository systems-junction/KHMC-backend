const mongoose = require('mongoose');

const buReturnSchema = new mongoose.Schema({
    uuid: {
        type: String
    },
    buId: {
        type: mongoose.Schema.ObjectId,
        ref: 'businessUnit',
        required: [true, 'Please select Business unit']
    },
    itemId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Item',
        required: [true, 'Please select item']
    },
    qty: {
        type: Number,
        required: [true, 'Please add quantity']
    },
    timeStamp: {
        type: Date,
        default: Date.now
    },
    returnReason: {
        type: String,
        required: [true, 'Please add return reason'],
    },
    batchNo: {
        type: String
    },
    staffId: {
        type: mongoose.Schema.ObjectId,
        ref: 'staff',
        required: [true, 'Please select Staff']
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

module.exports = mongoose.model('buReturn', buReturnSchema);
