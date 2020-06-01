const mongoose = require('mongoose');

const MaterialReceivingSchema = new mongoose.Schema({
    itemCode: {
        type: String,
        required: [true, 'Please add item code']
    },
    itemName: {
        type: String,
        required: [true, 'Please add item name']
    },
    prId: {
        type: mongoose.Schema.ObjectId,
        ref: 'PurchaseRequest'
    },
    poId: {
        type: mongoose.Schema.ObjectId,
        ref: 'PurchaseOrder'
    },
    vendorId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Vendor',
        required: [true, 'Please select Vendor']
    },
    status: {
        type: String,
        required: [true, 'Please select Status']
    },
    poSentDate: {
        type: Date
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

module.exports = mongoose.model('MaterialReceiving', MaterialReceivingSchema);
