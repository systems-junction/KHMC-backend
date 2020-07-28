const mongoose = require('mongoose');

const WarehouseInventorySchema = new mongoose.Schema({
    itemId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Item',
        required: [true, 'Please select Item']
    },
    qty: {
        type: Number
    },
    maximumLevel:{
        type:Number
    },
    reorderLevel:{
        type:Number
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

module.exports = mongoose.model('WarehouseInventory', WarehouseInventorySchema);
