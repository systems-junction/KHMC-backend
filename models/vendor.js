const mongoose = require('mongoose');

const VendorSchema = new mongoose.Schema({
    uuid: {
        type: String
    },
    vendorNo: {
        type:String
    },
    englishName: {
        type: String,
        required: [true, 'Please add name']
    },
    arabicName: {
        type: String,
    },
    telephone1: {
        type: String,
        required: [true, 'Please add telephone']
    },
    telephone2: {
        type: String,
    },
    contactEmail: {
        type: String,
    },
    address: {
        type: String,
        required: [true, 'Please add address']
    },
    country: {
        type: String,
    },
    city: {
        type: String,
    },
    zipcode: {
        type: String,
        required: [true, 'Please add zipcode']
    },
    faxno: {
        type: String,
    },
    taxno: {
        type: String,
        required: [true, 'Please add tax number']
    },
    contactPersonName: {
        type: String,
        required: [true, 'Please add contact person name'],
    },
    contactPersonTelephone: {
        type: String,
        required: [true, 'Please add contact person telephone'],
    },
    contactPersonEmail: {
        type: String,
    },
    paymentTerms: {
        type: String
    },
    shippingTerms: {
        type: String
    },
    rating: {
        type: String,
    },
    status: {
        type: String,
    },
    cls: {
        type: String
    },
    subClass:[
        {
        type: String
    }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Vendor', VendorSchema);
