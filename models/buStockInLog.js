const mongoose = require('mongoose');

const buStockInLogSchema = new mongoose.Schema({
    uuid: {
        type: String
    },
    buRepRequestId: {
        type: mongoose.Schema.ObjectId,
        ref: 'buRepRequest',
        required: [true, 'Please select Bu Rep Request']
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
    buPrice: {
        type: Number,
        required: [true, 'Please add BU price']
    },
    salePrice: {
        type: Number,
        required: [true, 'Please add sale price'],
    },
    batchNo: {
        type: String,
        required: [true, 'Please add batch number'],
    },
    expiryDate: {
        type: Date
    },
    timeStamp: {
        type: Date,
        default: Date.now
    },
    staffId: {
        type: mongoose.Schema.ObjectId,
        ref: 'staff',
        required: [true, 'Please select Staff']
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

module.exports = mongoose.model('buStockInLog', buStockInLogSchema);
