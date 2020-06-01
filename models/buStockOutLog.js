const mongoose = require('mongoose');

const buStockOutLogSchema = new mongoose.Schema({
    uuid: {
        type: String
    },
    itemId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Item',
        required: [true, 'Please select Item']
    },
    qty: {
        type: Number,
        required: [true, 'Please add quantity']
    },
    buId: {
        type: mongoose.Schema.ObjectId,
        ref: 'businessUnit',
        required: [true, 'Please select Business Unit']
    },
    timeStamp: {
        type: Date,
        default: Date.now
    },
    visitId: {
        type: String
    },
    staffId: {
        type: mongoose.Schema.ObjectId,
        ref: 'staff',
        required: [true, 'Please select Staff']
    },
    salePrice: {
        type: Number,
        required: [true, 'Please add sale price'],
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

module.exports = mongoose.model('buStockOutLog', buStockOutLogSchema);
