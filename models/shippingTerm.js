const mongoose = require('mongoose');

const ShippingTermSchema = new mongoose.Schema({
    uuid: {
        type: String
    },
    description: {
        type: String,
        required: [true, 'Please add description']
    },
    vendorId: {
        type: String,
        required: [true, 'Please add vendor id']
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

module.exports = mongoose.model('shippingTerm', ShippingTermSchema);
