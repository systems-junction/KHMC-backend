const mongoose = require('mongoose');

const PurchaseRequestItemsSchema = new mongoose.Schema({
    purchaseRequestId: {
        type: mongoose.Schema.ObjectId,
        ref: 'PurchaseRequest',
    },
    itemCode: {
        type: String,
        required: [true, 'Please add item code']
    },
    name: {
        type: String,
        required: [true, 'Please add item code']
    },
    vendorId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Vendor',
        required: [true, 'Please select Vendor']
    },
    description: {
        type: String,
        required: [true, 'Please add item code']
    },
    currentQty: {
        type: String,
        required: [true, 'Please add current qty']
    },
    reqQty: {
        type: String,
        required: [true, 'Please add req qty']
    },
    comments: {
        type: String,
        required: [true, 'Please add comments']
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

module.exports = mongoose.model('PurchaseRequestItems', PurchaseRequestItemsSchema);
