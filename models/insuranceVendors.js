const mongoose = require('mongoose');

const insuranceVendorsSchema = new mongoose.Schema({
    name: {
        type: String
    },
    poBox:{
        type:String
    },
    zipCode:{
        type:String
    },
    telephone1:{
        type:String
    },
    telephone2:{
        type:String
    },
    address: {
        type: String
    },
    faxNo: {
        type: String
    },
    email: {
        type: String,
        // required: [true, 'Please add an email'],
        // unique: true,
        // match: [
        // /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/,
        // 'Please add a valid email'
        // ]
    },
    country:{
        type:String
    },
    city:{
        type:String
    },
    taxNo:{
        type:String
    },
    contractualDiscount:{
        type:String
    },
    subCompanies:[{
        type:String
    }],
    exceptions:{
        type:String
    },
    agreedPricePolicy: {
        type: String
    },
    paymentTerms: {
        type: String
    },
    insuranceCodes:[{
        type:String
    }],
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
