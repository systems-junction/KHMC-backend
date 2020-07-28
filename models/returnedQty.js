const mongoose = require('mongoose');

const ReturnedQuantitySchema = new mongoose.Schema({
  fuiId: {
    type: mongoose.Schema.ObjectId,
    ref: 'fuInventory',
  },
  whiId: {
    type: mongoose.Schema.ObjectId,
    ref: 'WarehouseInventory',
  },
  itemId:{
    type: mongoose.Schema.ObjectId,
    ref: 'Item' 
},
  returnedQty: {
    type: Number,
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

module.exports = mongoose.model('ReturnedQuantity', ReturnedQuantitySchema);
