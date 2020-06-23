const mongoose = require('mongoose');

const replenishmentRequestSchema = new mongoose.Schema({
    requestNo: {
        type: String
    },
    generated: {
        type: String
    },
    generatedBy: {
        type: String
    },
    dateGenerated: {
        type: Date,
        default: Date.now
    },
    reason:{
        type:String
    },
    fuId: {
        type: mongoose.Schema.ObjectId,
        ref: 'functionalUnit'
    },
    buId:{
        type: mongoose.Schema.ObjectId,
        ref: 'businessUnit'
    },
    to:{
        type:String
    },
    from:{
        type:String
    },    
    comments:{
        type: String
    },
    itemId:{
        type: mongoose.Schema.ObjectId,
        ref: 'Item'
    },
    currentQty:{
        type:Number
    },
    requestedQty:{
        type:Number
    },
    recieptUnit:{
        type:String
    },
    issueUnit:{
        type:String
    },
    fuItemCost:{
        type:Number
    },
    description:{
        type:String
    },
    status: {
        type: String
    },
    secondStatus:{
        type:String
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

module.exports = mongoose.model('ReplenishmentRequest', replenishmentRequestSchema);
