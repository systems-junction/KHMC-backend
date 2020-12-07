const mongoose = require('mongoose');

const ReturnedQuantitySchema = new mongoose.Schema({
  fuId:{
    type: mongoose.Schema.ObjectId,
    ref: 'functionalUnit',  
  },
  fuiId: {
    type: mongoose.Schema.ObjectId,
    ref: 'fuInventory',
  },
  whiId: {
    type: mongoose.Schema.ObjectId,
    ref: 'WarehouseInventory',
  },
  itemId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Item',
  },
  returnedQty: {
    type: Number,
  },
  reason:{
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

  batchArray: [
    {
      batchNumber: String,
      expiryDate: {
        type: Date,
      },
      quantity: Number,
      price: Number
    },
  ],
});

module.exports = mongoose.model('ReturnedQuantity', ReturnedQuantitySchema);
