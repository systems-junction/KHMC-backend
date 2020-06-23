const mongoose = require('mongoose');

const PurchaseRequestSchema = new mongoose.Schema({
  requestNo: {
    type: String,
  },
  generatedBy: {
    type: String,
    required: [true, 'Please add generated By'],
  },
  status: {
    type: String,
    required: true,
  },
  committeeStatus: {
    type: String,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  vendorId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Vendor',
  },
  item: {
    itemId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Item',
    },
    currQty: {
      type: Number,
      required: [true, 'Please add req qty'],
    },
    reqQty: {
      type: Number,
      required: [true, 'Please add req qty'],
    },
    comments: {
      type: String,
      required: [true, 'Please add comments'],
    },
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
  },
  requesterName: {
    type: String,
  },
  department: {
    type: String,
  },
  orderType: {
    type: String,
  },
  generated: {
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
});

module.exports = mongoose.model('PurchaseRequest', PurchaseRequestSchema);
