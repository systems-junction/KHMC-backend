const mongoose = require('mongoose');

const accessLevelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add Access level name'],
    },
    read: { type: String, enum: [0, 1] },
    write: { type: String, enum: [0, 1] },
    update: { type: String, enum: [0, 1] },
    del: { type: String, enum: [0, 1] },
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

module.exports = mongoose.model('accessLevel', accessLevelSchema);
