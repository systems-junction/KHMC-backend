const bcrypt = require('bcryptjs');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Account = require('../models/account');
const WhInventory = require('../models/warehouseInventory');
const ReceiveItem = require('../models/receiveItem');
const ReplenishmentRequest = require('../models/replenishmentRequest')
const MaterialReceiving = require('../models/materialReceiving')
const PurchaseRequest = require('../models/purchaseRequest')
const PurchaseOrder = require('../models/purchaseOrder')
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
    path : 'mrId',
    populate: [{
       path : 'prId.id'
}]
  })

  await MaterialReceiving.updateOne({_id:account.mrId._id}, { $set: { status: "complete" }})
  await PurchaseOrder.updateOne({_id:account.mrId.poId}, { $set: { status: "complete" }})
  for(let i =0; i<account.mrId.prId.length; i++)
  {
    if(account.mrId.prId[i].status=="received")
    {
      for(let j =0 ;j<account.mrId.prId[i].id.item.length; j++)
    {
      if(account.mrId.prId[i].id.item[j].status=="received") 
      {
        var receive = await ReceiveItem.findOne({prId: account.mrId.prId[i].id,itemId:account.mrId.prId[i].id.item[j].itemId}).populate('prId')
        await WhInventory.updateOne({itemId: receive.itemId}, { $set: { qty: receive.currentQty+receive.receivedQty }})
        await PurchaseRequest.updateOne({_id:account.mrId.prId[i].id}, { $set: { status: "receive" }})
        if(receive.prId.rr)
        {
        await ReplenishmentRequest.updateOne({_id:receive.prId.rr}, { $set: { secondStatus: "Can be fulfilled" }})
      }
      }
    }
    }
    else if (account.mrId.prId[i].status=="rejected"){
      await PurchaseRequest.updateOne({_id:account.mrId.prId[i].id}, { $set: { status: "partially_complete" }})
    }
  }
}
  account = await Account.updateOne({ _id: _id }, req.body);
  res.status(200).json({ success: true });
});