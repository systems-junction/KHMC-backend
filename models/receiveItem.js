const mongoose = require('mongoose');

const ReceiveItemSchema = new mongoose.Schema({
    itemCode: {
        type: String,
        required: true
    },
    itemName: {
        type: String,
        required: true
    },
    currentQty: {
        type: String,
        required: true
    },
    requiredQty: {
        type: String,
        required: true
    },
    receivedQty: {
        type: String,
        required: true
    },
    bonusQty: {
        type: String
    },
    batchNumber: {
        type: String
    },
    unit: {
        type: String
    },
    discount: {
        type: String
    },
    uniyDiscount: {
        type: String
    },
    discountAmount: {
        type: String
    },
    tax: {
        type: String
    },
    taxAmount: {
        type: String
    },
    finalUnitPrice: {
        type: String
    },
    subTotal: {
        type: String
    },
    totalPrice: {
        type: String
    },
    invoice: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    },
    comments: {
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

module.exports = mongoose.model('ReceiveItem', ReceiveItemSchema);
