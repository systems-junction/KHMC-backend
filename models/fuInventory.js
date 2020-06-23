const mongoose = require('mongoose');

const fuInventorySchema = new mongoose.Schema({
    uuid: {
        type: String
    },
    fuId: {
        type: mongoose.Schema.ObjectId,
        ref: 'functionalUnit',
        required: [true, 'Please select Business Unit']
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
