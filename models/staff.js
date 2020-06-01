const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
    staffTypeId: {
        type: mongoose.Schema.ObjectId,
        ref: 'staffType',
        required: [true, 'Please select System type']
    },
    firstName: {
        type: String,
        required: [true, 'Please add first name']
    },
    lastName: {
        type: String,
        required: [true, 'Please add last name']
    },
    designation: {
        type: String,
        required: [true, 'Please add designation']
    },
    contactNumber: {
        type: String,
        required: [true, 'Please add contact number']
    },
    identificationNumber: {
        type: String,
        required: [true, 'Please add identification number']
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
    password: {
        type: String,
        required: [true, 'Please add password']
    },
    gender: {
        type: String,
        required: [true, 'Please add gender']
    },
    dob: {
        type: Date,
        required: [true, 'Please select dob']
    },
    address: {
        type: String,
        required: [true, 'Please add address']
    },
    createdBySystemAdminStaffId: {
        type: mongoose.Schema.ObjectId,
        ref: 'systemAdmin',
        required: [true, 'Please select System admin']
    },
    timeStamp: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        required: [true, 'Please add status']
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

module.exports = mongoose.model('staff', staffSchema);
