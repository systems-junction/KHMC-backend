const bcrypt = require('bcryptjs');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Account = require('../models/account');
const WhInventory = require('../models/warehouseInventory');
const ReceiveItem = require('../models/receiveItem');
exports.getAccount = asyncHandler(async (req, res) => {
  const account = await Account.find().populate({
    path : 'mrId',
     populate: [{
        path : 'poId',
        populate : {
          path : 'purchaseRequestId',
          populate:{
            path : 'item.itemId'
          }
          }}]
  }).populate('vendorId');
  res.status(200).json({ success: true, data: account });
});
exports.getAccountById = asyncHandler(async (req, res) => {
  const account = await Account.findOne({_id:req.params._id})
  .populate({
    path : 'mrId',
     populate: [{
        path : 'poId',
        populate : {
          path : 'purchaseRequestId',
          populate:{
            path : 'item.itemId'
          }
          }}]
  }).populate('vendorId');
  res.status(200).json({ success: true, data: account });
});

exports.updateAccount = asyncHandler(async (req, res, next) => {
  const { _id } = req.body;

  let account = await Account.findById(_id);

  if (!account) {
    return next(
      new ErrorResponse(`Staff type not found with id of ${_id}`, 404)
    );
  }
if(req.body.status=="approve"){
  const account = await Account.findOne({_id:req.body._id}).populate({
    path : 'mrId'
  })
  for(let i =0; i<account.mrId.prId.length; i++)
  {
    if(account.mrId.prId[i].status=="received"){
      var receive = await ReceiveItem.findOne({prId: account.mrId.prId[i].id})
      await WhInventory.updateOne({itemId: receive.itemId}, { $set: { qty: receive.currentQty+receive.receivedQty }})
    }
  }
}
  account = await Account.updateOne({ _id: _id }, req.body);
});