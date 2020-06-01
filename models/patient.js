const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    uuid: {
        type: String
    },
    name: {
        type: String,
        required: [true, 'Please add name']
    },
    dob: {
        type: Date,
        required: [true, 'Please select dob']
    },
    gender: {
        type: String,
        required: [true, 'Please select gender']
    },
    phoneNumber: {
        type: String,
        required: [true, 'Please add phone number']
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
    idNumber: {
        type: String
    },
    image: {
        type: String
    },
    otherDetails: {
        type: String
    },
    insuranceNumber: {
        type: String
    },
    insuranceVendorId: {
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

module.exports = mongoose.model('patient', patientSchema);
