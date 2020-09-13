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
    patientReferenceNo:{
        type:String,
    },
    comments:{
        type: String
    },
    orderFor:{
        type:String
    },
    item:[{
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
        status: {
            type: String
        },
        secondStatus:{
            type:String
        },
        priority:{
            type:String
        },
        schedule:{
            type:String
        },
        dosage:{
            type:Number
        },
        noOfTimes:{
            type:Number
        },
        duration:{
            type:Number
        },
        form:{
            type:String
        },
        size:{type:String},
        make_model:{type:String},
        comments:{type:String}
    }],
    status: {
        type: String
    },
    secondStatus:{
        type:String
    },
    description:{
        type:String
    },
    commentNote:{
        type:String
    },
    requesterName: {
        type:String
    },
    department: {
        type:String
    },
    orderType:{
        type:String
    },
    orderBy:{
        type:String
    },
    reason:{
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
