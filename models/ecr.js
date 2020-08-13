const mongoose = require('mongoose');

const ECRSchema = new mongoose.Schema({
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
  generatedBy:{
    type: mongoose.Schema.ObjectId,
    ref: 'staff',
  },
  generatedFor:{
    type: mongoose.Schema.ObjectId,
    ref: 'staff',
  },
  patient:{
    type: mongoose.Schema.ObjectId,
    ref: 'patient'
  },
  generatedFrom:{
    type:String
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('ECR', ECRSchema);
