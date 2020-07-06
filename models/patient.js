const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    identificationNumber: {
        type: String
    },
    title:{
        type:String
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    dob: {
        type: Date,
    },
    gender: {
        type: String,
    },
    phoneNumber: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
        match: [
        /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/,
        'Please add a valid email'
        ]
    },
    country:{
        type:String
    },
    city:{
        type:String
    },
    address:{
        type:String
    },
    otherDetails: {
        type: String
    },
    insuranceNumber:{
        type:String
    },
    insuranceVendor:{
        type:String
    },
    coverageDetails:{
        type:String
    },
    coverageTerms:{
        type:String
    },
    payment:{
        type:String
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

module.exports = mongoose.model('patient', patientSchema);
