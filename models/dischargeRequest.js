const mongoose = require('mongoose');

const dischargeRequestSchema = new mongoose.Schema({
    edrId:{
        type: mongoose.Schema.ObjectId,
        ref: 'EDR',    
      },
      iprId:{
        type: mongoose.Schema.ObjectId,
        ref: 'IPR',
      },
      generatedFor: {
        type: String
    },
    paymentMethod:{
        type:String
    },
      depositAmount: {
        type: Number,
      },
      amountReceived: {
        type: Number,
      },
      totalAmount:{
          type:Number
      },
      bankName: {
        type: String,
      },
      depositorName: {
        type: String,
      },
      depositSlip: {
        type: String,
      },
      receivedBy:{
        type: mongoose.Schema.ObjectId,
        ref: 'staff',
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

module.exports = mongoose.model('dischargeRequest', dischargeRequestSchema);
