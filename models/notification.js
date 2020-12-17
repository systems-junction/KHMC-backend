const mongoose = require('mongoose');
const notificationSchema = new mongoose.Schema(
    {
        title: {
            type: String
        },
        message: {
            type: String
        },
        route: {
            type: String
        },
        searchId: {
            drugAllergy: [{ type: String }],
            _id: { type: String },
            profileNo: { type: String },
            SIN: { type: String },
            firstName: { type: String },
            lastName: { type: String },
            gender: { type: String },
            age: { type: Number },
            weight: { type: String },
            phoneNumber: { type: String },
            mobileNumber: { type: String }
        },
        sendTo: [
            {
                userId: {
                    type: mongoose.Schema.ObjectId,
                    ref: "User"
                },
                read: {
                    type: Boolean,
                    default: false
                }
            }],
        date: {
            type: Date,
            default: Date.now
        }
    });
module.exports = mongoose.model('notification', notificationSchema);