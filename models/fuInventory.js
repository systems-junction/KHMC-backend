const mongoose = require('mongoose');

const fuInventorySchema = new mongoose.Schema({
    fuId: {
        type: mongoose.Schema.ObjectId,
        ref: 'functionalUnit',
    },
    itemId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Item',
        required: [true, 'Please select item']
    },
    qty: {
        type: Number,
        required: [true, 'Please add qty']
    },
    maximumLevel:{
        type:Number
    },
    reorderLevel:{
        type:Number
    },
    minimumLevel:{
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

module.exports = mongoose.model('fuInventory', fuInventorySchema);
