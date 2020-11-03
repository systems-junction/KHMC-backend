const mongoose = require('mongoose');

const accessLevelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add Access level name'],
    },
    read: { type: String, enum: ['false', 'true'] },
    write: { type: String, enum: ['false', 'true'] },
    update: { type: String, enum: ['false', 'true'] },
    del: { type: String, enum: ['false', 'true'] },
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
