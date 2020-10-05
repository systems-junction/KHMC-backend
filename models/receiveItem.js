const mongoose = require('mongoose');

const ReceiveItemSchema = new mongoose.Schema({
    itemId:{
        type: mongoose.Schema.ObjectId,
        ref: 'Item',
    },
    prId:{
        type: mongoose.Schema.ObjectId,
        ref: 'PurchaseRequest',
    },
    status:{
        type:String
    },
    currentQty: {
        type: Number,
        required: true
    },
    requestedQty: {
        type: Number,
        required: true
    },
    // requiredQty: {
    //     type: String,
    //     required: true
    // },
    receivedQty: {
        type: Number,
        required: true
    },
    bonusQty: {
        type: Number
    },
    batchNumber: {
        type: String
    },
    lotNumber: {
        type: String
    },
    expiryDate:{
        type: Date
    },
    unit: {
        type: String
    },
    discount: {
        type: Number
    },
    unitDiscount: {
        type: String
    },
    discountAmount: {
        type: Number
    },
    tax: {
        type: Number
    },
    taxAmount: {
        type: Number
    },
    finalUnitPrice: {
        type: Number
    },
    subTotal: {
        type: Number
    },
    discountAmount2: {
        type: Number
    },
    totalPrice: {
        type: Number
    },
    invoice: {
        type: String
    },
    dateInvoice: {
        type: Date,
        default: Date.now
    },
    dateReceived: {
        type: Date,
        default: Date.now
    },    
    notes: {
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
