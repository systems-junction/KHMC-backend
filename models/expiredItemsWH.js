const mongoose = require('mongoose');
const expiredItemsWHSchema = new mongoose.Schema(
  {
    itemId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Item'
    },
    batch: 
      {
        batchNumber:{type:String},
        expiryDate: {type:Date},
        quantity:{type:Number},
        price:{type:Number}
      },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('expiredItemwh', expiredItemsWHSchema);
