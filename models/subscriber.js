const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const SubscriberSchema = new mongoose.Schema({
     endpoint: String,
     keys: Schema.Types.Mixed,
     user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Please select System admin'],
      },
     createDate: {
         type: Date,
         default: Date.now
     }
});
module.exports = mongoose.model('subscribers', SubscriberSchema);