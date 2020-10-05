const mongoose = require('mongoose');
const externalReturnRequestSchema = new mongoose.Schema({
    returnRequestNo: {
        type: String
    },
    generatedBy: {
        type: String
    },
    generated: {
        type: String
    },
    dateGenerated: {
        type: Date,
        default: Date.now
    },
    expiryDate:{
        type:Date
    },
    currentQty:{
        type:Number
    },
    itemId:{
        type: mongoose.Schema.ObjectId,
        ref: 'Item'
    },
    prId:{
        type: mongoose.Schema.ObjectId,
        ref: 'PurchaseRequest'
    },
    description:{
        type:String
    },
    reason:{
        type:String
    },
    reasonDetail:{
        type:String
    },
    damageReport:{
        causedBy:{
            type:String
        },
        totalDamageCost:{
            type:Number
        },
        date:{
            type:Date
        },
        itemCostPerUnit:{
            type:Number
        }
    },
    status: {
        type: String
    },
    approvedBy:{
        type: mongoose.Schema.ObjectId,
        ref: 'staff'
    },
    commentNote:{
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

module.exports = mongoose.model('ExternalReturnRequest', externalReturnRequestSchema);
