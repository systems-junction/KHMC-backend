const mongoose = require('mongoose');

const patientClearanceSchema = new mongoose.Schema({
    clearanceNo:{
        type:String
    },
    patientId:{
        type: mongoose.Schema.ObjectId,
        ref: 'patient',    
      },
      edrId:{
        type: mongoose.Schema.ObjectId,
        ref: 'EDR',
      },
      iprId:{
        type: mongoose.Schema.ObjectId,
        ref: 'IPR',
      },
    generatedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'staff',
    },
    consultantFee:{
        type:Number
    },
    residentFee:{
        type:Number
    },
    subTotal:{
        type:Number
    },
    total:{
        type:Number
    },
    returnedAmount:{
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

module.exports = mongoose.model('patientClearance', patientClearanceSchema);
