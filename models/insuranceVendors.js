const mongoose = require('mongoose');

const insuranceVendorsSchema = new mongoose.Schema({
    uuid: {
        type: String
    },
    name: {
        type: String
    },
    address: {
        type: String
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
        /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/,
        'Please add a valid email'
        ]
    },
    fax: {
        type: String
    },
    phone: {
        type: String
    },
    contactPerson: {
        type: String
    },
    prefix: {
        type: String
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

module.exports = mongoose.model('insuranceVendors', insuranceVendorsSchema);
