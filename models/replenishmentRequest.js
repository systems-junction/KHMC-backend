const mongoose = require('mongoose');

const replenishmentRequestSchema = new mongoose.Schema({
  requestNo: {
    type: String,
  },
  generated: {
    type: String,
  },
  generatedBy: {
    type: String,
  },
  dateGenerated: {
    type: Date,
    default: Date.now,
  },
  reason: {
    type: String,
  },
  fuId: {
    type: mongoose.Schema.ObjectId,
    ref: 'functionalUnit',
  },
  to: {
    type: String,
  },
  from: {
    type: String,
  },
  comments: {
    type: String,
  },
  items: [
    {
      itemId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Item',
      },
      currentQty: {
        type: Number,
      },
      requestedQty: {
        type: Number,
      },
      recieptUnit: {
        type: String,
      },
      issueUnit: {
        type: String,
      },
      fuItemCost: {
        type: Number,
      },
      description: {
        type: String,
      },
      status: {
        type: String,
      },
      secondStatus: {
        type: String,
      },

      batchArray: [
        {
          batchNumber: String,
          expiryDate: {
            type: Date,
          },
          quantity: Number,
        },
      ],
    },
  ],
  status: {
    type: String,
  },
  secondStatus: {
    type: String,
  },
  rrB: {
    type: mongoose.Schema.ObjectId,
    ref: 'ReplenishmentRequestBU',
  },
  approvedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'staff',
  },
  requesterName: {
    type: String,
  },
  orderType: {
    type: String,
  },
  department: {
    type: String,
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
});

module.exports = mongoose.model(
  'ReplenishmentRequest',
  replenishmentRequestSchema
);
