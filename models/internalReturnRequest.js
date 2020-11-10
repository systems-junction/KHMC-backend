const mongoose = require('mongoose');
const internalReturnRequestSchema = new mongoose.Schema({
  returnRequestNo: {
    type: String,
  },
  generatedBy: {
    type: String,
  },
  dateGenerated: {
    type: Date,
    default: Date.now,
  },
  expiryDate: {
    type: Date,
  },
  to: {
    type: String,
  },
  from: {
    type: String,
  },
  currentQty: {
    type: Number,
  },
  returnedQty: {
    type: Number,
  },
  itemId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Item',
  },
  description: {
    type: String,
  },
  fuId: {
    type: mongoose.Schema.ObjectId,
    ref: 'functionalUnit',
  },
  reason: {
    type: String,
  },
  reasonDetail: {
    type: String,
  },
  buId: {
    type: mongoose.Schema.ObjectId,
    ref: 'businessUnit',
  },
  damageReport: {
    causedBy: {
      type: String,
    },
    totalDamageCost: {
      type: Number,
    },
    date: {
      type: Date,
    },
    itemCostPerUnit: {
      type: Number,
    },
  },
  status: {
    type: String,
  },
  replenishmentRequestBU: {
    type: mongoose.Schema.ObjectId,
    ref: 'ReplenishmentRequestBU',
  },
  replenishmentRequestFU: {
    type: mongoose.Schema.ObjectId,
    ref: 'ReplenishmentRequest',
  },
  approvedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'staff',
  },
  commentNote: {
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

  batchNo: {
    type: String,
  },
  returnBatchArray: [
    {
      batchNumber: String,
      expiryDatePerBatch: { type: Date },
      receivedQtyPerBatch: { type: Number },
      returnedQtyPerBatch: { type: Number },
      price: Number
    },
  ],
});

module.exports = mongoose.model(
  'InternalReturnRequest',
  internalReturnRequestSchema
);
