const mongoose = require('mongoose');
const systemAdminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please add password'],
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model('systemAdmin', systemAdminSchema);
