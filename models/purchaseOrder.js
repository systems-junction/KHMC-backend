const mongoose = require('mongoose');

const PurchaseOrderSchema = new mongoose.Schema({
  purchaseOrderNo: {
    type: String,
  },
  purchaseRequestId: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'PurchaseRequest',
    },
  ],
  date: {
    type: Date,
    default: Date.now,
    // required: [true, 'Please add date']
  },
  generated: {
    type: String,
    // required: [true, 'Please add generated data']
  },
  generatedBy: {
    type: String,
    // required: [true, 'Please add generated data']
  },
  vendorId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Vendor',
    required: [true, 'Please select Vendor'],
  },
  status: {
    type: String,
    required: true,
  },
  committeeStatus: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  sentAt: {
    type: Date,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('PurchaseOrder', PurchaseOrderSchema);
