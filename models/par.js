const mongoose = require('mongoose');

const parSchema = new mongoose.Schema({
    requestNo: {
        type: String,
      },
      edrId:{
        type: mongoose.Schema.ObjectId,
        ref: 'EDR',    
      },
      iprId:{
        type: mongoose.Schema.ObjectId,
        ref: 'IPR',
      },
      // oprId:{
      //   type: mongoose.Schema.ObjectId,
      //   ref: 'OPR',
      // },
      generatedBy:{
        type: mongoose.Schema.ObjectId,
        ref: 'staff',
      },
      patient:{
        type: mongoose.Schema.ObjectId,
        ref: 'patient'
      },
      pharId:{
        type: mongoose.Schema.ObjectId
      },
      lrId:{
        type: mongoose.Schema.ObjectId
      },
      rrId:{
        type: mongoose.Schema.ObjectId
      },
      nsId:{
        type: mongoose.Schema.ObjectId
      },
      generatedFrom:{
        type:String
      },
      generatedFromSub:{
          type:String
      },
      approvalNo:{
        type:Number
      },
      approvalPerson:{
        type: mongoose.Schema.ObjectId,
        ref: 'staff',
      },
      comments:{
        type:String
      },
        status: {
            type: String
        },
        coPayment:{
          type:Number
        },
        netPayment:{
          type:Number
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

module.exports = mongoose.model('par', parSchema);
