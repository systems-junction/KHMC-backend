const mongoose = require('mongoose');

const insuranceItemsSchema = new mongoose.Schema({
    providerId:{
        type: mongoose.Schema.ObjectId,
        ref: 'insuranceVendors',
    },
    itemId:{
        type: mongoose.Schema.ObjectId,
        ref: 'Item',
    },
    laboratoryServiceId:{
        type:mongoose.Schema.ObjectId,
        ref:'LaboratoryService',
    },
    radiologyServiceId:{
        type:mongoose.Schema.ObjectId,
        ref:'RadiologyService',
    },
    price:{
        type:Number
    },
    details: {
        type: String
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

module.exports = mongoose.model('insuranceItems', insuranceItemsSchema);
