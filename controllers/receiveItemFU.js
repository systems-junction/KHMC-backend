/* eslint-disable prefer-const */
const notification = require('../components/notification');
const { v4: uuidv4 } = require('uuid');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const PurchaseRequest = require('../models/purchaseRequest');
const ReceiveItemFU = require('../models/receiveItemFU');
const FUInventory = require('../models/fuInventory');
const ReplenishmentRequest = require('../models/replenishmentRequest');
const ReplenishmentRequestBU = require('../models/replenishmentRequestBU');
const WHInventory = require('../models/warehouseInventory');
const Item = require('../models/item');
const requestNoFormat = require('dateformat');
const { rename } = require('fs');
const item = require('../models/item');

exports.getReceiveItemsFU = asyncHandler(async (req, res) => {
  const receiveItems = await ReceiveItemFU.find().populate('vendorId');
  const data = {
    receiveItems,
  };
  res.status(200).json({ success: true, data: data });
});

exports.addReceiveItemFU = asyncHandler(async (req, res) => {
  const {
    itemId,
    currentQty,
    requestedQty,
    receivedQty,
    bonusQty,
    batchNumber,
    lotNumber,
    expiryDate,
    unit,
    discount,
    unitDiscount,
    discountAmount,
    tax,
    taxAmount,
    finalUnitPrice,
    subTotal,
    discountAmount2,
    totalPrice,
    invoice,
    dateInvoice,
    dateReceived,
    notes,
    replenishmentRequestId,
    replenishmentRequestStatus,
    fuId,
  } = req.body;
  const pRequest = await WHInventory.findOne({ itemId: itemId }).populate(
    'itemId'
  );
  const fuTest = await FUInventory.findOne({
    itemId: itemId,
    fuId: req.body.fuId,
  });
  var now = new Date();
  var start = new Date(now.getFullYear(), 0, 0);
  var diff =
    now -
    start +
    (start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000;
  var oneDay = 1000 * 60 * 60 * 24;
  var day = Math.floor(diff / oneDay);

  const fu = await FUInventory.findOne({
    itemId: itemId,
    fuId: req.body.fuId,
  });

  // const wh = await WHInventory.findOne({ itemId: itemId });

  let wh = '';
  const repRequest = await ReplenishmentRequest.findOne({
    _id: replenishmentRequestId,
  });

  for (let i = 0; i < repRequest.items.length; i++) {
    if (repRequest.items[i].itemId == itemId) {
      wh = repRequest.items[i];
    }
  }

  //code for batch calculation and setting
  let updatedBatchArray = wh.tempBatchArray;
  var newBatch = [];
  let counterForBatchArray = 0;
  let remainingQty = receivedQty;

  for (let i = 0; i < wh.tempBatchArray.length; i++) {
    if (wh.tempBatchArray[i].quantity >= remainingQty) {
      updatedBatchArray[i] = {
        quantity: wh.tempBatchArray[i].quantity - remainingQty,
        batchNumber: wh.tempBatchArray[i].batchNumber,
        expiryDate: wh.tempBatchArray[i].expiryDate,
        _id: wh.tempBatchArray[i]._id,
      };
      newBatch[counterForBatchArray] = {
        quantity: remainingQty,
        batchNumber: wh.tempBatchArray[i].batchNumber,
        expiryDate: wh.tempBatchArray[i].expiryDate,
        _id: wh.tempBatchArray[i]._id,
      };
      counterForBatchArray++;
      break;
    } else if (
      wh.tempBatchArray[i].quantity < remainingQty &&
      wh.tempBatchArray[i].quantity !== '0'
    ) {
      remainingQty = remainingQty - wh.tempBatchArray[i].quantity;
      newBatch[counterForBatchArray] = {
        quantity: wh.tempBatchArray[i].quantity,
        batchNumber: wh.tempBatchArray[i].batchNumber,
        expiryDate: wh.tempBatchArray[i].expiryDate,
        _id: wh.tempBatchArray[i]._id,
      };
      counterForBatchArray++;

      updatedBatchArray[i] = {
        quantity: 0,
        batchNumber: wh.tempBatchArray[i].batchNumber,
        expiryDate: wh.tempBatchArray[i].expiryDate,
        _id: wh.tempBatchArray[i]._id,
      };
    }

    if (remainingQty === 0) {
      break;
    }
  }

  let removedWithZeroQty = [];
  for (let i = 0; i < updatedBatchArray.length; i++) {
    if (updatedBatchArray[i].quantity !== 0) {
      removedWithZeroQty.push(updatedBatchArray[i]);
    }
  }
  // console.log('removedWithZeroQty', removedWithZeroQty);
  //   console.log('updatedBatchArray', updatedBatchArray);
  // console.log('newBatch', newBatch);

  if (pRequest && fuTest) {
    await ReceiveItemFU.create({
      itemId,
      currentQty,
      requestedQty,
      receivedQty,
      bonusQty,
      batchNumber,
      lotNumber,
      expiryDate,
      unit,
      discount,
      unitDiscount,
      discountAmount,
      tax,
      taxAmount,
      finalUnitPrice,
      subTotal,
      discountAmount2,
      totalPrice,
      invoice,
      dateInvoice,
      dateReceived,
      notes,
      replenishmentRequestId,
      batchArray: newBatch,
    });
  }

  if (
    req.body.replenishmentRequestStatus == 'Received' ||
    req.body.replenishmentRequestStatus == 'Partially Received'
  ) {
    const fUnit = await FUInventory.findOneAndUpdate(
      { itemId: itemId, fuId: req.body.fuId },
      { $set: { qty: fu.qty + parseInt(receivedQty) } },
      { new: true }
    );

    // await WHInventory.findOneAndUpdate(
    //   { itemId: itemId },
    //   { $set: { qty: wh.qty - parseInt(receivedQty) } },
    //   { new: true }
    // ).populate('itemId');

    //updating the batch array in FU Inven
    let quantityUpdated;
    let alreadyFound = await FUInventory.findOne({
      itemId: itemId,
      fuId: req.body.fuId,
    });

    let arr = alreadyFound.batchArray;

    for (let i = 0; i < newBatch.length; i++) {
      let found = false;

      let obj = {
        batchNumber: newBatch[i].batchNumber,
        expiryDate: newBatch[i].expiryDate,
        quantity: newBatch[i].quantity,
      };

      for (let j = 0; j < arr.length; j++) {
        if (arr[j].batchNumber === newBatch[i].batchNumber) {
          found = true;
          arr[j] = {
            batchNumber: arr[j].batchNumber,
            expiryDate: arr[j].expiryDate,
            quantity:
              parseInt(arr[j].quantity) + parseInt(newBatch[i].quantity),
          };
          //   break;
        }
      }

      if (found === false) {
        arr.push(obj);
      }
    }

    quantityUpdated = await FUInventory.findOneAndUpdate(
      {
        itemId: itemId,
        fuId: req.body.fuId,
      },
      { $set: { batchArray: arr } },
      { new: true }
    );

    console.log('Batch array for FU Inv', quantityUpdated);

    quantityUpdated.batchArray.sort((a, b) =>
      a.expiryDate > b.expiryDate ? 1 : -1
    );

    const abc = await FUInventory.findOneAndUpdate(
      { itemId: itemId, fuId: req.body.fuId },
      { $set: { batchArray: quantityUpdated.batchArray } },
      { new: true }
    );

    // console.log('FU Inventory after update', abc);

    //updating the batch array in WH inventory
    // const pr = await WHInventory.findOneAndUpdate(
    //   { itemId: itemId },
    //   { $set: { batchArray: removedWithZeroQty } },
    //   { new: true }
    // ).populate('itemId');

    const pr = await WHInventory.findOneAndUpdate(
      { itemId: itemId }
      //   { $set: { batchArray: removedWithZeroQty } },
      //   { new: true }
    ).populate('itemId');

    if (fUnit) {
      const rReq = await ReplenishmentRequest.findOne({
        _id: replenishmentRequestId,
      });
      // Here cannot status update
      let it = await ReplenishmentRequestBU.findOneAndUpdate(
        { _id: rReq.rrB, 'item.itemId': req.body.itemId },
        { new: true }
      );

      if (
        it &&
        it.secondStatus !== 'Delivery in Progress' &&
        it.secondStatus !== 'in_progress'
      ) {
        await ReplenishmentRequestBU.findOneAndUpdate(
          { _id: rReq.rrB, 'item.itemId': req.body.itemId },
          { $set: { 'item.$.secondStatus': 'Can be fulfilled' } }
        );
      }

      notification(
        'Replenishment Request',
        'Replenishment Request ' +
          rReq.requestNo +
          ' has been completed at ' +
          req.body.updatedAt,
        'Warehouse Incharge'
      );
    }
    if (fu && pr) {
      await ReplenishmentRequest.findOneAndUpdate(
        { _id: replenishmentRequestId, 'items.itemId': req.body.itemId },
        {
          $set: {
            'items.$.secondStatus': req.body.replenishmentRequestStatus,
            'items.$.status': req.body.replenishmentRequestStatus,
          },
        },
        { new: true }
      );
      const stat = await ReplenishmentRequest.findOne({
        _id: replenishmentRequestId,
      });
      var count = 0;
      for (let i = 0; i < stat.items.length; i++) {
        if (
          stat.items[i].status == 'Received' ||
          stat.items[i].status == 'Partially Received'
        ) {
          count++;
        }
      }
      if (count == stat.items.length) {
        await ReplenishmentRequest.findOneAndUpdate(
          { _id: replenishmentRequestId },
          { $set: { status: 'Received', secondStatus: 'Received' } },
          { new: true }
        );
      } else {
        await ReplenishmentRequest.findOneAndUpdate(
          { _id: replenishmentRequestId },
          {
            $set: {
              status: 'Partially Received',
              secondStatus: 'Partially Received',
            },
          },
          { new: true }
        );
      }

      //   if (pr.qty <= pr.reorderLevel) {
      //     const j = await Item.findOne({ _id: req.body.itemId });
      //     const purchaseRequest = await PurchaseRequest.create({
      //       requestNo: 'PR' + day + requestNoFormat(new Date(), 'yyHHMM'),
      //       generated: 'System',
      //       generatedBy: 'System',
      //       committeeStatus: 'pending',
      //       status: 'pending',
      //       commentNotes: 'System',
      //       reason: 'reactivated_items',
      //       item: [
      //         {
      //           itemId: req.body.itemId,
      //           currQty: pr.qty,
      //           reqQty: pr.maximumLevel - pr.qty,
      //           comments: 'System',
      //           name: j.name,
      //           description: j.description,
      //           itemCode: j.itemCode,
      //           status: 'pending',
      //           secondStatus: 'pending',
      //         },
      //       ],
      //       vendorId: j.vendorId,
      //       requesterName: 'System',
      //       department: '',
      //       orderType: '',
      //       rr: replenishmentRequestId,
      //     });
      //     notification(
      //       'Purchase Request',
      //       'A new Purchase Request ' +
      //         purchaseRequest.requestNo +
      //         'has been generated at ' +
      //         purchaseRequest.createdAt,
      //       'Committe Member'
      //     );
      //   }
    }
  }
  res.status(200).json({ success: true });
});

exports.deleteReceiveItemFU = asyncHandler(async (req, res, next) => {
  const { _id } = req.params;
  const receiveItem = await ReceiveItemFU.findById(_id);
  if (!receiveItem) {
    return next(
      new ErrorResponse(`Received Item not found with id of ${_id}`, 404)
    );
  }
  await ReceiveItemFU.deleteOne({ _id: _id });
  res.status(200).json({ success: true, data: {} });
});

exports.updateReceiveItemFU = asyncHandler(async (req, res, next) => {
  const { _id } = req.body;
  let receiveItem = await ReceiveItemFU.findById(_id);
  if (!receiveItem) {
    return next(
      new ErrorResponse(`Received item not found with id of ${_id}`, 404)
    );
  }
  receiveItem = await ReceiveItemFU.updateOne({ _id: _id }, req.body);
  res.status(200).json({ success: true, data: receiveItem });
});
