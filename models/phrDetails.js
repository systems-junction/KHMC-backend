const mongoose = require('mongoose');

const phrDetailsSchema = new mongoose.Schema({
    uuid: {
        type: String
    },
    phrId: {
        type: String
    },
    itemsId: {
        type: String
    },
    price: {
        type: Number
    },
    qty: {
        type: Number
    },
    amount: {
        type: Number
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

module.exports = mongoose.model('phrDetails', phrDetailsSchema);
