const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add name'],
  },
  description: {
    type: String,
    required: [true, 'Please add description'],
  },
  itemCode: {
    type: String,
    required: [true, 'Please add bar code'],
  },
  form:{
    type:String
  },
  drugAllergy:[
    {type:String}
  ],
  receiptUnit: {
    type: String,
    required: [true, 'Please Insert Receipt Unit'],
  },
  issueUnit: {
    type: String,
    required: [true, 'Please Insert Issue Unit'],
  },
  vendorId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Vendor',
    required: [true, 'Please select Vendor'],
  },
  purchasePrice: {
    type: Number,
    required: [true, 'Please add purchase price'],
  },
  minimumLevel: {
    type: Number,
  },
  maximumLevel: {
    type: Number,
  },
  reorderLevel: {
    type: Number,
  },
  cls: {
    type: String,
  },
  medClass:{
    type:String
  },
  subClass: {
    type: String,
  },
  grandSubClass: {
    type: String,
  },
  comments: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },

  receiptUnitCost: {
    type: Number,
    required: [true, 'Please Insert Receipt Unit Cost'],
  },
  issueUnitCost: {
    type: Number,
    required: [true, 'Please Insert Issue Unit Cost'],
  },
  scientificName: {
    type: String,
  },
  tradeName: {
    type: String,
  },
  temprature: {
    type: String,
  },
  humidity: {
    type: String,
  },
  lightSensitive: {
    type: String,
  },
  resuableItem: {
    type: String,
  },
  storageCondition: {
    type: String,
  },
  expiration: {
    type: Date,
  },
  tax: {
    type: Number,
    required: [true, 'Please Insert Tax'],
  },
});

module.exports = mongoose.model('Item', itemSchema);
