const mongoose = require('mongoose');

const InsuranceSchema = new mongoose.Schema({
  englishName: {
    type: String,
  },
  arabicName: {
    type: String,
  },
  telephone1: {
    type: String,
  },
  telephone2: {
    type: String,
  },
  fax: {
    type: String,
  },
  email: {
    type: String,
  },
  tax: {
    type: String,
  },
  address1: {
    type: String,
  },
  address2: {
    type: String,
  },
  country: {
    type: String,
  },
  city: {
    type: String,
  },
  poBox: {
    type: String,
  },
  zipCode: {
    type: String,
  },
  discountRate: {
    type: Number,
  },
  coverageTerms: {
    type: String,
  },
  paymentTerms: {
    type: String,
  },
  exceptions: {
    type: String,
  },
  subsidiary: [
    {
      type: String,
    },
  ],
  priceList: [
    {
      serviceName: {
        type: String,
      },
      price: {
        type: Number,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('insurance', InsuranceSchema);
