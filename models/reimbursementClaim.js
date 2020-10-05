const mongoose = require('mongoose');

const reimbursementClaimSchema = new mongoose.Schema({
    requestNo: {
        type: String,
      },
      generatedBy:{
        type: mongoose.Schema.ObjectId,
        ref: 'staff',
      },
      patient:{
        type: mongoose.Schema.ObjectId,
        ref: 'patient'
      },
      insurer:{
        type: mongoose.Schema.ObjectId,
        ref: 'insurance'
      },
        status: {
            type: String
        },
        treatmentDetail:{
          type:String
        },
        document:{
          type:String
        },
        responseCode:{
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

module.exports = mongoose.model('ReimbursementClaim', reimbursementClaimSchema);
