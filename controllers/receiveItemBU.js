/* eslint-disable prefer-const */
const notification = require('../components/notification');
const { v4: uuidv4 } = require('uuid');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const ReceiveItemBU = require('../models/receiveItemBU');
const BUInventory = require('../models/buInventory');
const FUInventory = require('../models/fuInventory');
const PurchaseRequest = require('../models/purchaseRequest');
const ReplenishmentRequest = require('../models/replenishmentRequest');
const Item = require('../models/item');
const WHInventory = require('../models/warehouseInventory');
const ReplenishmentRequestBU = require('../models/replenishmentRequestBU');
const FunctionalUnit = require('../models/functionalUnit');
const requestNoFormat = require('dateformat');

exports.getReceiveItemsBU = asyncHandler(async (req, res) => {
  const receiveItems = await ReceiveItemBU.find().populate('vendorId');
  const data = {
    receiveItems,
  };
  res.status(200).json({ success: true, data: data });
});

exports.addReceiveItemBU = asyncHandler(async (req, res) => {
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
    replenishmentRequestItemId,
  } = req.body;
  var now = new Date();
  var start = new Date(now.getFullYear(), 0, 0);
  var diff =
    now -
    start +
    (start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000;
  var oneDay = 1000 * 60 * 60 * 24;
  var day = Math.floor(diff / oneDay);

  // const wh = await FUInventory.findOneAndUpdate(
  //   { itemId: req.body.itemId, fuId: fuId },
  //   { new: true }
  // ).populate('itemId');

  let wh = '';
  const repRequest = await ReplenishmentRequestBU.findOne({
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
  console.log('removedWithZeroQty', removedWithZeroQty);
  console.log('updatedBatchArray', updatedBatchArray);
  console.log('newBatch', newBatch);

  const rrId = await ReplenishmentRequestBU.findOne({
    _id: replenishmentRequestId,
  });

  await ReceiveItemBU.create({
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
    replenishmentRequestItemId,
    batchArray: newBatch,
  });
  if (
    req.body.replenishmentRequestStatus == 'Received' ||
    req.body.replenishmentRequestStatus == 'Partially Received'
  ) {
    for (let i = 0; i < rrId.item.length; i++) {
      var count = 0;
      var pror = await ReplenishmentRequestBU.findOneAndUpdate(
        { _id: replenishmentRequestId, 'item.itemId': req.body.itemId },
        {
          $set: {
            'item.$.status': req.body.replenishmentRequestStatus,
            'item.$.secondStatus': req.body.replenishmentRequestStatus,
          },
        },
        { new: true }
      );
      for (let i = 0; i < pror.item.length; i++) {
        if (
          pror.item[i].status == 'Received' ||
          pror.item[i].status == 'Partially Received'
        ) {
          count++;
          if (count == pror.item.length) {
            await ReplenishmentRequestBU.findOneAndUpdate(
              { _id: replenishmentRequestId },
              { $set: { status: 'Completed', secondStatus: 'Completed' } },
              { new: true }
            );
          } else {
            await ReplenishmentRequestBU.findOneAndUpdate(
              { _id: replenishmentRequestId },
              {
                $set: {
                  status: 'Partially Completed',
                  secondStatus: 'Partially Completed',
                },
              },
              { new: true }
            );
          }
        }
      }
    }
    notification(
      'Item Received',
      'Item Received against Professional Order ' + rrId.requestNo,
      'FU Member'
    );
    // const fUnit = await FunctionalUnit.findOne({_id:req.body.fuId})
    // const fu = await FUInventory.findOne({itemId: req.body.itemId,fuId:fUnit._id})
    // var less = fu.qty-parseInt(req.body.receivedQty)
    // if (less <= -1)
    // {
    //   less = 0;
    // }
    // const fui = await FUInventory.findOneAndUpdate({itemId: req.body.itemId,_id:fu._id }, { $set: { qty: less }},{new:true}).populate('itemId');
    // const wh = await WHInventory.findOne({itemId:req.body.itemId})
    // const item = await Item.findOne({_id:req.body.itemId})
    // var st;
    // var st2;
    // if(wh.qty<(fui.maximumLevel-fui.qty))
    // {
    //  st = "pending"
    //  st2 = "Cannot be fulfilled"
    // }
    // else
    // {
    //  st = "pending"
    //  st2 = "Can be fulfilled"
    // }
    // if(fui.qty<=fui.reorderLevel)
    // {
    // notification("Replenishment Request Generated", "New Replenishment Request Generated", "Warehouse Member")
    // notification("Replenishment Request Generated", "New Replenishment Request Generated", "FU Member")
    //    const rrS = await ReplenishmentRequest.create({
    //         requestNo: 'RR'+ day + requestNoFormat(new Date(), 'yyHHMM'),
    //         generated:'System',
    //         generatedBy:'System',
    //         reason:'reactivated_items',
    //         fuId:req.body.fuId,
    //         items:[
    //         {
    //             itemId:req.body.itemId,
    //             currentQty:fui.qty,
    //             requestedQty:fui.maximumLevel-fui.qty,
    //             recieptUnit:item.receiptUnit,
    //             issueUnit:item.issueUnit,
    //             fuItemCost:0,
    //             description:item.description,
    //             status: st,
    //             secondStatus:st2,
    //         }
    //         ],
    //         comments:'System generated Replenishment Request',
    //         status: "pending",
    //         secondStatus:"pending",
    //         requesterName:'System',
    //         orderType:'',
    //         to:'Warehouse',
    //         from:'FU',
    //         department:'',
    //         rrB:req.body.rrBUId
    //       });

    //     if(st2 == "Cannot be fulfilled")
    //     {
    //   const purchase = await PurchaseRequest.create({
    //       requestNo: 'PR'+ day + requestNoFormat(new Date(), 'yyHHMM'),
    //       generated:'System',
    //       generatedBy:'System',
    //       committeeStatus: 'pending',
    //       status:'pending',
    //       commentNotes:'System',
    //       reason:'reactivated_items',
    //       item:[
    //           {
    //             itemId:req.body.itemId,
    //             currQty:wh.qty,
    //             reqQty:wh.maximumLevel-wh.qty,
    //             comments:'System',
    //             name:item.name,
    //             description:item.description,
    //             itemCode:item.itemCode,
    //             status:"pending",
    //             secondStatus:"pending"
    //         },
    //       ],
    //       vendorId:item.vendorId,
    //       requesterName:'System',
    //       department:'',
    //       orderType:'',
    //       rr:rrS._id
    //     });
    //     notification("Purchase Request", "A new Purchase Request "+purchase.requestNo+" has been generated at "+purchase.createdAt, "admin")
    //     }
    //     }
  }
  res.status(200).json({ success: true });
});

exports.deleteReceiveItemBU = asyncHandler(async (req, res, next) => {
  const { _id } = req.params;
  const receiveItem = await ReceiveItemBU.findById(_id);
  if (!receiveItem) {
    return next(
      new ErrorResponse(`Received Item not found with id of ${_id}`, 404)
    );
  }
  await ReceiveItemBU.deleteOne({ _id: _id });
  res.status(200).json({ success: true, data: {} });
});

exports.updateReceiveItemBU = asyncHandler(async (req, res, next) => {
  const { _id } = req.body;

  let receiveItem = await ReceiveItemBU.findById(_id);

  if (!receiveItem) {
    return next(
      new ErrorResponse(`Received item not found with id of ${_id}`, 404)
    );
  }

  receiveItem = await ReceiveItemBU.updateOne({ _id: _id }, req.body);
  res.status(200).json({ success: true, data: receiveItem });
});

// const bu = await BUInventory.findOne({itemId: req.body.itemId,buId:req.body.buId})
// await BUInventory.findOneAndUpdate({itemId: req.body.itemId,buId:req.body.buId}, { $set: { qty: bu.qty+req.body.requestedQty }},{new:true})
