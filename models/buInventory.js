const mongoose = require('mongoose');

const buInventorySchema = new mongoose.Schema({
    uuid: {
        type: String
    },
    buId: {
        type: mongoose.Schema.ObjectId,
        ref: 'businessUnit',
        required: [true, 'Please select Business Unit']
    },
    fuId:{
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
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('buInventory', buInventorySchema);
