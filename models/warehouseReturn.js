const mongoose = require('mongoose');

const warehouseReturnSchema = new mongoose.Schema({
    uuid: {
        type: String
    },
    itemId: {
        type: String
    },
    qty: {
        type: Number,
        required: [true, 'Please add quantity']
    },
    dateTime: {
        type: Date,
        default: Date.now
    },
    returnReason: {
        type: String,
        required: [true, 'Please add return reason']
    },
    batchNo: {
        type: String,
        required: [true, 'Please add batch number'],
    },
    staffId: {
        type: String,
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

module.exports = mongoose.model('warehouseReturn', warehouseReturnSchema);
