const mongoose = require('mongoose');

const warehouseStockOutSchema = new mongoose.Schema({
    uuid: {
        type: String
    },
    itemId: {
        type: String
    },
    buRepRequestId: {
        type: String
    },
    qty: {
        type: Number,
        required: [true, 'Please add quantity']
    },
    dateTime: {
        type: Date,
        default: Date.now
    },
    buPrice: {
        type: String,
        required: [true, 'Please add BU price'],
    },
    salePrice: {
        type: String,
        required: [true, 'Please add sale price'],
    },
    staffId: {
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

module.exports = mongoose.model('warehouseStockOut', warehouseStockOutSchema);
