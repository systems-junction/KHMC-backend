const mongoose = require('mongoose');

const staffTypeSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: [true, 'Please add type'],
    },
    description: {
      type: String,
      required: [true, 'Please add description'],
    },
    accessLevelId: {
      type: mongoose.Schema.ObjectId,
      ref: 'accessLevel',
      required: [true, 'Please select Access Level'],
    },
    status: {
      type: String,
      required: [true, 'Please add status'],
    },
    systemAdminId: {
      type: mongoose.Schema.ObjectId,
      ref: 'systemAdmin',
      required: [true, 'Please select System admin'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('staffType', staffTypeSchema);
