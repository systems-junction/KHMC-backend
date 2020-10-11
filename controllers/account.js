const bcrypt = require('bcryptjs');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Account = require('../models/account');
const WhInventory = require('../models/warehouseInventory');
const ReceiveItem = require('../models/receiveItem');
const ReplenishmentRequest = require('../models/replenishmentRequest');
const MaterialReceiving = require('../models/materialReceiving');
const PurchaseRequest = require('../models/purchaseRequest');
const PurchaseOrder = require('../models/purchaseOrder');
exports.getAccount = asyncHandler(async (req, res) => {
  const account = await Account.find()
    .populate({
      path: 'mrId',
      populate: [
        {
          path: 'poId',
          populate: {
            path: 'purchaseRequestId',
            populate: {
              path: 'item.itemId',
            },
          },
        },
      ],
    })
    .populate('vendorId');
  res.status(200).json({ success: true, data: account });
});

exports.getAccountById = asyncHandler(async (req, res) => {
  const account = await Account.findOne({ _id: req.params._id })
    .populate({
      path: 'mrId',
      populate: [
        {
          path: 'poId',
          populate: {
            path: 'purchaseRequestId',
            populate: {
              path: 'item.itemId',
            },
          },
        },
      ],
    })
    .populate('vendorId');
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
  if (req.body.status == 'approve') {
    const account = await Account.findOne({ _id: req.body._id }).populate({
      path: 'mrId',
      populate: [
        {
          path: 'prId.id',
        },
      ],
    });

    await MaterialReceiving.updateOne(
      { _id: account.mrId._id },
      { $set: { status: 'complete' } }
    );
    await PurchaseOrder.updateOne(
      { _id: account.mrId.poId },
      { $set: { status: 'complete' } }
    );
    for (let i = 0; i < account.mrId.prId.length; i++) {
      if (
        account.mrId.prId[i].status == 'received' ||
        account.mrId.prId[i].status == 'partially_complete'
      ) {
        for (let j = 0; j < account.mrId.prId[i].id.item.length; j++) {
          if (account.mrId.prId[i].id.item[j].status == 'received') {
            var receive = await ReceiveItem.findOne({
              prId: account.mrId.prId[i].id._id,
              itemId: account.mrId.prId[i].id.item[j].itemId,
            }).populate('prId');

            console.log("receive",receive)
            // let obj = {
            //   batchNumber: receive.batchNumber,
            //   expiryDate: receive.expiryDate,
            //   quantity: receive.receivedQty,
            // };

            const beforeUpdateQty = await WhInventory.findOne({
              itemId: receive.itemId,
            });

            const afterUpdateQty = await WhInventory.findOneAndUpdate(
              { itemId: receive.itemId },
              { $set: { qty: beforeUpdateQty.qty + receive.receivedQty } },
              { new: true }
            );

            console.log(afterUpdateQty);

            let arr = afterUpdateQty.batchArray;

            for (let i = 0; i < receive.batchArray.length; i++) {
              let obj = receive.batchArray[i];
              let found = false;

              for (let j = 0; j < afterUpdateQty.batchArray.length; j++) {
                if (
                  afterUpdateQty.batchArray[j].batchNumber === obj.batchNumber
                ) {
                  found = true;
                  arr[j] = {
                    batchNumber: obj.batchNumber,
                    expiryDate: obj.expiryDate,
                    quantity:
                      parseInt(afterUpdateQty.batchArray[j].quantity) +
                      parseInt(obj.quantity),
                  };
                }
              }

              if (found === false) {
                arr.push(obj);
              }
            }

            console.log('arr', arr);

            let quantityUpdated;
            // if (found === false) {
            //   quantityUpdated = await WhInventory.findOneAndUpdate(
            //     { itemId: receive.itemId },
            //     { $push: { batchArray: obj } },
            //     { new: true }
            //   );
            // } else if (found === true) {
            //   quantityUpdated = await WhInventory.findOneAndUpdate(
            //     { itemId: receive.itemId },
            //     { $set: { batchArray: arr } },
            //     { new: true }
            //   );
            // }

            quantityUpdated = await WhInventory.findOneAndUpdate(
              { itemId: receive.itemId },
              { $set: { batchArray: arr } },
              { new: true }
            );

            quantityUpdated.batchArray.sort((a, b) =>
              a.expiryDate > b.expiryDate ? 1 : -1
            );

            const abc = await WhInventory.findOneAndUpdate(
              { itemId: receive.itemId },
              { $set: { batchArray: quantityUpdated.batchArray } },
              { new: true }
            );

            console.log('after updated warehouse with sorted', abc);

            await PurchaseRequest.updateOne(
              { _id: account.mrId.prId[i].id },
              { $set: { status: 'receive' } }
            );
            if (receive.prId.rr) {
              await ReplenishmentRequest.updateOne(
                { _id: receive.prId.rr },
                { $set: { secondStatus: 'Can be fulfilled' } }
              );
            }
          }
        }
      } else if (account.mrId.prId[i].status == 'rejected') {
        await PurchaseRequest.updateOne(
          { _id: account.mrId.prId[i].id },
          { $set: { status: 'partially_complete' } }
        );
      }
    }
  }
  account = await Account.updateOne({ _id: _id }, req.body);
  res.status(200).json({ success: true });
});
