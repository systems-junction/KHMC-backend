const mongoose = require('mongoose');

const PurchaseOrderSchema = new mongoose.Schema({
    purchaseOrderNo: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now,
        required: [true, 'Please add date']
    },
    generated: {
        type: String,
        required: [true, 'Please add generated data']
    },
    paymentTerm: {
        String
    },
    shippingTerm: {
        type: String
    },
    vendorId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Vendor',
        required: [true, 'Please select Vendor']
    },
    vendorEmail: {
        type: String
        // required: [true, 'Please add an email'],
        // unique: true,
        // match: [
        // /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/,
        // 'Please add a valid email'
        // ]
    },
    vendorPhoneNo: {
        type: String
    },
    vendorAddress: {
        type: String
    },
    status: {
        type: String,
        required: true
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

module.exports = mongoose.model('PurchaseOrder', PurchaseOrderSchema);
