const mongoose = require('mongoose');

const SurgeryServiceSchema = new mongoose.Schema({
    serviceNo: {
        type:String
    },
    name: {
    type: String,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
  },
  status: {
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

module.exports = mongoose.model('SurgeryService', SurgeryServiceSchema);
