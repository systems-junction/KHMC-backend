const mongoose = require('mongoose');

const warehouseInventoryLogSchema = new mongoose.Schema({
    uuid: {
        type: String
    },
    warehousePOId: {
        type: String
    },
    itemId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Item',
        required: [true, 'Please select Item']
    },
    purchasePrice: {
        type: String,
        required: [true, 'Please add purchase price'],
    },
    buPrice: {
        type: String,
        required: [true, 'Please add BU price'],
    },
    salePrice: {
        type: String,
        required: [true, 'Please add sale price'],
    },
    qty: {
        type: Number,
        required: [true, 'Please add qty']
    },
    batchNo: {
        type: String,
        required: [true, 'Please add batch number']
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
    rating: {
        type: String,
    },
    reviews: {
        type: String,
        required: [true, 'Please add review'],
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

module.exports = mongoose.model('warehouseInventoryLog', warehouseInventoryLogSchema);
