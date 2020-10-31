const mongoose = require('mongoose');

const WarehousePRPOSchema = new mongoose.Schema({
    uuid: {
        type: String
    },
    requesterId: {
        type: String,
        required: [true, 'Please add requester id']
    },
    status: {
        type: String,
        required: [true, 'Please add status']
    },
    vendorId: {
        type: String
    },
    approvedByStaffId: {
        type: String
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

module.exports = mongoose.model('WarehousePRPO', WarehousePRPOSchema);
