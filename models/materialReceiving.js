const mongoose = require('mongoose');

const MaterialReceivingSchema = new mongoose.Schema({
    prId: [{
        id:{
        type: mongoose.Schema.ObjectId,
        ref: 'PurchaseRequest'
    },
    status:{
        type: String,
        default:"not recieved"
    }
    }
    ],
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
