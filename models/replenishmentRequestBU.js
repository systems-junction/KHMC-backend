const mongoose = require('mongoose');
const replenishmentRequestBUSchema = new mongoose.Schema({
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
    fuId: {
        type: mongoose.Schema.ObjectId,
        ref: 'functionalUnit'
    },
    buId:{
        type: mongoose.Schema.ObjectId,
        ref: 'businessUnit'
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
    description:{
        type:String
    },
    status: {
        type: String
    },
    secondStatus:{
        type:String
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

module.exports = mongoose.model('ReplenishmentRequestBU', replenishmentRequestBUSchema);
