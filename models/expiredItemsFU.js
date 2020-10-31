const mongoose = require('mongoose');
const expiredItemsFUSchema = new mongoose.Schema(
  {
    itemId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Item'
    },
    fuId:{
        type: mongoose.Schema.ObjectId,
        ref: 'functionalUnit'
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

module.exports = mongoose.model('expiredItemfu', expiredItemsFUSchema);
