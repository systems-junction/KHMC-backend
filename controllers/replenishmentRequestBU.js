/* eslint-disable prefer-const */
const notification = require('../components/notification');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const ReplenishmentRequestBU = require('../models/replenishmentRequestBU');
const FunctionalUnit = require('../models/functionalUnit');
const FUInventory = require('../models/fuInventory');
const BUInventory = require('../models/buInventory');
const WHInventory = require('../models/warehouseInventory');
const ReplenishmentRequest = require('../models/replenishmentRequest');
const PurchaseRequest = require('../models/purchaseRequest');

const Item = require('../models/item');
const IPR = require('../models/IPR');
const EDR = require('../models/EDR');
const moment = require('moment');
const requestNoFormat = require('dateformat');
var st;
var st2;

exports.getReplenishmentRequestsBU = asyncHandler(async (req, res) => {
  const replenishmentRequest = await ReplenishmentRequestBU.find()
    .populate('buId')
    .populate('fuId')
    .populate('item.itemId');
  res.status(200).json({ success: true, data: replenishmentRequest });
});

exports.getReplenishmentRequestsBUM = asyncHandler(async (req, res) => {
  const replenishmentRequest = await ReplenishmentRequestBU.find({
    orderFor: 'Medical',
  })
    .populate('buId')
    .populate('fuId')
    .populate('item.itemId');
  res.status(200).json({ success: true, data: replenishmentRequest });
});
exports.getReplenishmentRequestsBUMKeyword = asyncHandler(async (req, res) => {
  const replenishmentRequest = await ReplenishmentRequestBU.find({
    orderFor: 'Medical',
  })
    .populate('buId')
    .populate('fuId')
    .populate('item.itemId');
  var arr = [];
  for (let i = 0; i < replenishmentRequest.length; i++) {
    if (
      (replenishmentRequest[i].requestNo &&
        replenishmentRequest[i].requestNo
          .toLowerCase()
          .match(req.params.keyword.toLowerCase())) ||
      (replenishmentRequest[i].patientReferenceNo &&
        replenishmentRequest[i].patientReferenceNo
          .toLowerCase()
          .match(req.params.keyword.toLowerCase()))
    ) {
      arr.push(replenishmentRequest[i]);
    }
  }
  res.status(200).json({ success: true, data: arr });
});

exports.getReplenishmentRequestsBUNM = asyncHandler(async (req, res) => {
  const replenishmentRequest = await ReplenishmentRequestBU.find({
    orderFor: 'Non Medical',
  })
    .populate('buId')
    .populate('fuId')
    .populate('item.itemId');
  res.status(200).json({ success: true, data: replenishmentRequest });
});
exports.getReplenishmentRequestsBUNMKeyword = asyncHandler(async (req, res) => {
  const replenishmentRequest = await ReplenishmentRequestBU.find({
    orderFor: 'Non Medical',
  })
    .populate('buId')
    .populate('fuId')
    .populate('item.itemId');
  var arr = [];
  for (let i = 0; i < replenishmentRequest.length; i++) {
    if (
      replenishmentRequest[i].requestNo &&
      replenishmentRequest[i].requestNo
        .toLowerCase()
        .match(req.params.keyword.toLowerCase())
    ) {
      arr.push(replenishmentRequest[i]);
    }
  }

  res.status(200).json({ success: true, data: arr });
});

exports.getReplenishmentRequestsByIdBU = asyncHandler(async (req, res) => {
  const replenishmentRequest = await ReplenishmentRequestBU.findOne({
    _id: req.body._id,
  })
    .populate('buId')
    .populate('fuId')
    .populate('itemId');
  res.status(200).json({ success: true, data: replenishmentRequest });
});

exports.addReplenishmentRequestBU = asyncHandler(async (req, res) => {
  var now = new Date();
  var start = new Date(now.getFullYear(), 0, 0);
  var diff =
    now -
    start +
    (start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000;
  var oneDay = 1000 * 60 * 60 * 24;
  var day = Math.floor(diff / oneDay);
  var code;
  const {
    generated,
    generatedBy,
    dateGenerated,
    buId,
    comments,
    item,
    commentNote,
    orderFor,
    description,
    patientReferenceNo,
    requesterName,
    department,
    orderType,
    orderBy,
    reason,
    pId,
  } = req.body;
  const func = await FunctionalUnit.findOne({ _id: req.body.fuId });
  for (let i = 0; i < req.body.item.length; i++) {
    const fui = await FUInventory.findOne({
      itemId: req.body.item[i].itemId,
      fuId: func._id,
    }).populate('itemId');

    if (fui.qty < parseInt(req.body.item[i].requestedQty)) {
      req.body.item[i].secondStatus = 'Cannot be fulfilled';
    } else {
      req.body.item[i].secondStatus = 'Can be fulfilled';

      // newBatch.sort((a, b) => (a.expiryDate > b.expiryDate ? 1 : -1));
      // req.body.item[i].batchArray = newBatch;
    }
  }
  if (orderFor == 'Medical') {
    code = 'MO';
  } else {
    code = 'PO';
  }
  const rrBU = await ReplenishmentRequestBU.create({
    requestNo: code + day + requestNoFormat(new Date(), 'yyHHMM'),
    generated,
    generatedBy,
    dateGenerated,
    fuId: func._id,
    buId,
    comments,
    orderType,
    item,
    // currentQty,
    // requestedQty,
    description,
    status: 'pending',
    requesterName,
    orderFor,
    orderBy,
    department,
    reason,
    commentNote,
    patientReferenceNo,
    pId,
    secondStatus: 'pending',
  });
  //Merge with RCM
  const a = await EDR.findOne({ patientId: pId });
  if (a !== null) {
    var edr = await EDR.findOne({ patientId: pId })
      .sort({
        createdAt: 'desc',
      })
      .limit(100);
  }
  const b = await IPR.findOne({ patientId: pId });
  if (b !== null) {
    var ipr = await IPR.findOne({ patientId: pId })
      .sort({
        createdAt: 'desc',
      })
      .limit(100);
  }
  if (a && b) {
    var isafter = moment(edr.createdAt).isAfter(ipr.createdAt);
    if (isafter) {
      const test = await EDR.findOneAndUpdate(
        { _id: edr._id },
        { $push: { pharmacyRequest: rrBU._id } },
        { new: true }
      );
    } else {
      const test = await IPR.findOneAndUpdate(
        { _id: ipr._id },
        { $push: { pharmacyRequest: rrBU._id } },
        { new: true }
      );
    }
  } else if (a) {
    const test = await EDR.findOneAndUpdate(
      { _id: edr._id },
      { $push: { pharmacyRequest: rrBU._id } },
      { new: true }
    );
  } else if (b) {
    const test = await IPR.findOneAndUpdate(
      { _id: ipr._id },
      { $push: { pharmacyRequest: rrBU._id } },
      { new: true }
    );
  }
  if (orderFor == 'Medical') {
    notification(
      'Medication Order',
      'A new Medication Order has been generated at ' + rrBU.createdAt,
      'Committe Member'
    );
  } else {
    notification(
      'Professional Order',
      'A new Professional Order has been generated at ' + rrBU.createdAt,
      'Committe Member'
    );
  }
  const send = await ReplenishmentRequestBU.find()
    .populate('buId')
    .populate('fuId')
    .populate('item.itemId');
  globalVariable.io.emit('get_data', send);
  var items = [];
  for (let i = 0; i < req.body.item.length; i++) {
    if (req.body.item[i].secondStatus == 'Cannot be fulfilled') {
      const fu2 = await FUInventory.findOne({
        itemId: req.body.item[i].itemId,
        fuId: func._id,
      }).populate('itemId');
      const wh = await WHInventory.findOne({
        itemId: req.body.item[i].itemId,
      }).populate('itemId');
      const item = await Item.findOne({ _id: req.body.item[i].itemId });
      if (
        wh.qty <
        parseInt(req.body.item[i].requestedQty) + (fu2.qty - fu2.maximumLevel)
      ) {
        st = 'pending';
        st2 = 'Cannot be fulfilled';
      } else {
        st = 'pending';
        st2 = 'Can be fulfilled';
      }
      items.push({
        itemId: req.body.item[i].itemId,
        currentQty: fu2.qty,
        requestedQty:
          fu2.qty - req.body.item[i].requestedQty + fu2.maximumLevel,
        recieptUnit: item.receiptUnit,
        issueUnit: item.issueUnit,
        fuItemCost: 0,
        description: item.description,
        status: st,
        secondStatus: st2,
      });
      const rrS = await ReplenishmentRequest.create({
        requestNo: 'RR' + day + requestNoFormat(new Date(), 'yyHHMM'),
        generated: 'System',
        generatedBy: 'System',
        reason: 'reactivated_items',
        fuId: req.body.fuId,
        items: items,
        comments: 'System generated Replenishment Request',
        status: 'pending',
        secondStatus: 'pending',
        requesterName: 'System',
        orderType: '',
        to: 'Warehouse',
        from: 'FU',
        department: '',
        rrB: rrBU._id,
      });
      notification(
        'Replenishment Request',
        'A new replenishment request has been generated by System at ' +
          rrBU.createdAt,
        'Warehouse Member'
      );
      notification(
        'Replenishment Request',
        'A new replenishment request has been generated by System at ' +
          rrBU.createdAt,
        'FU Member'
      );

      const send = await ReplenishmentRequest.find()
        .populate('fuId')
        .populate('itemId')
        .populate('approvedBy');
      globalVariable.io.emit('get_data', send);
    }
  }

  res.status(200).json({ success: true, data: rrBU });
});

exports.deleteReplenishmentRequestBU = asyncHandler(async (req, res, next) => {
  const { _id } = req.params;
  const replenishmentRequest = await ReplenishmentRequestBU.findById(_id);
  if (!replenishmentRequest) {
    return next(
      new ErrorResponse(
        `Replenishment Request not found with id of ${_id}`,
        404
      )
    );
  }
  await ReplenishmentRequestBU.deleteOne({ _id: _id });
  res.status(200).json({ success: true, data: {} });
});

exports.updateReplenishmentRequestBU = asyncHandler(async (req, res, next) => {
  var now = new Date();
  var start = new Date(now.getFullYear(), 0, 0);
  var diff =
    now -
    start +
    (start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000;
  var oneDay = 1000 * 60 * 60 * 24;
  var day = Math.floor(diff / oneDay);

  const { _id } = req.body;
  let replenishmentRequest = await ReplenishmentRequestBU.findById(_id);
  if (!replenishmentRequest) {
    return next(
      new ErrorResponse(
        `Replenishment Request not found with id of ${_id}`,
        404
      )
    );
  }

  replenishmentRequest = await ReplenishmentRequestBU.findOneAndUpdate(
    { _id: _id },
    req.body,
    { new: true }
  );
  for (let i = 0; i < req.body.item.length; i++) {
    if (req.body.item[i].status == 'in_progress') {
      notification(
        'Professional Order',
        'Professional Order ' +
          replenishmentRequest.requestNo +
          ' item has been updated to In Progress by the Inventory Keeper at ' +
          replenishmentRequest.updatedAt,
        'BU Member'
      );
    } else if (req.body.item[i].status == 'Delivery in Progress') {
      const func = await FunctionalUnit.findOne({ _id: req.body.fuId });

      const wh = await FUInventory.findOne({
        itemId: req.body.item[i].itemId,
        fuId: func._id,
      }).populate('itemId');

      req.body.item[i].tempBatchArray = JSON.parse(
        JSON.stringify(wh.batchArray)
      );
      // await FUInventory.findOneAndUpdate(
      //   {
      //     itemId: req.body.item[i].itemId,
      //     fuId: func._id,
      //   },
      //   { $set: { tempBatchArray: wh.batchArray } }
      // );

      let updatedBatchArray = wh.batchArray;
      var newBatch = [];
      let counterForBatchArray = 0;
      let remainingQty = req.body.item[i].requestedQty;

      for (let i = 0; i < wh.batchArray.length; i++) {
        if (wh.batchArray[i].quantity >= remainingQty) {
          updatedBatchArray[i] = {
            quantity: wh.batchArray[i].quantity - remainingQty,
            batchNumber: wh.batchArray[i].batchNumber,
            expiryDate: wh.batchArray[i].expiryDate,
            price:wh.batchArray[i].price,
            _id: wh.batchArray[i]._id,
          };
          newBatch[counterForBatchArray] = {
            quantity: remainingQty,
            batchNumber: wh.batchArray[i].batchNumber,
            expiryDate: wh.batchArray[i].expiryDate,
            price:wh.batchArray[i].price,
            _id: wh.batchArray[i]._id,
          };
          counterForBatchArray++;
          break;
        } else if (
          wh.batchArray[i].quantity < remainingQty &&
          wh.batchArray[i].quantity !== '0'
        ) {
          remainingQty = remainingQty - wh.batchArray[i].quantity;
          newBatch[counterForBatchArray] = {
            quantity: wh.batchArray[i].quantity,
            batchNumber: wh.batchArray[i].batchNumber,
            expiryDate: wh.batchArray[i].expiryDate,
            price:wh.batchArray[i].price,
            _id: wh.batchArray[i]._id,
          };
          counterForBatchArray++;

          updatedBatchArray[i] = {
            quantity: 0,
            batchNumber: wh.batchArray[i].batchNumber,
            expiryDate: wh.batchArray[i].expiryDate,
            price:wh.batchArray[i].price,
            _id: wh.batchArray[i]._id,
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

      // const pr = await WHInventory.findOneAndUpdate(
      //   { itemId: req.body.items[i].itemId },
      //   { $set: { qty: wh.qty - parseInt(req.body.items[i].requestedQty) } },
      //   { new: true }
      // ).populate('itemId');

      const fUnit = await FunctionalUnit.findOne({ _id: req.body.fuId });

      const fu = await FUInventory.findOne({
        itemId: req.body.item[i].itemId,
        fuId: fUnit._id,
      });

      var less = fu.qty - parseInt(req.body.item[i].requestedQty);
      if (less <= -1) {
        less = 0;
      }

      var todayDate = moment().utc().toDate();

      const fui = await FUInventory.findOneAndUpdate(
        { itemId: req.body.item[i].itemId, _id: fu._id },
        { $set: { qty: less, updatedAt: todayDate } },
        { new: true }
      ).populate('itemId');

      // const wh = await WHInventory.findOne({ itemId: req.body.itemId });
      // const item = await Item.findOne({ _id: req.body.item[i].itemId });

      //updating the batch array in WH inventory
      await FUInventory.findOneAndUpdate(
        { itemId: req.body.item[i].itemId, fuId: fUnit._id },
        { $set: { batchArray: removedWithZeroQty } },
        { new: true }
      ).populate('itemId');

      req.body.item[i].batchArray = newBatch;

      replenishmentRequestAfterUpdatedBatchArray = await ReplenishmentRequestBU.findOneAndUpdate(
        { _id: _id },
        req.body,
        { new: true }
      );

      notification(
        'Professional Order',
        'Professional Order ' +
          replenishmentRequest.requestNo +
          ' item has been updated to Delivery In Progress by the Inventory Keeper at ' +
          replenishmentRequest.updatedAt,
        'BU Member'
      );

      // const fUnit = await FunctionalUnit.findOne({_id:req.body.fuId})
      // const fu = await FUInventory.findOne({itemId: req.body.item[i].itemId,fuId:fUnit._id})
      // var less = fu.qty-parseInt(req.body.item[i].requestedQty)
      // if (less <= -1)
      // {
      //   less = 0;
      // }
      // const fui = await FUInventory.findOneAndUpdate(
      //   { itemId: req.body.itemId, _id: fu._id },
      //   { new: true }
      // ).populate('itemId');

      const whInv = await WHInventory.findOne({
        itemId: req.body.item[i].itemId,
      });

      const item = await Item.findOne({ _id: req.body.item[i].itemId });
      var st;
      var st2;
      if (whInv.qty < fui.maximumLevel - fui.qty) {
        st = 'pending';
        st2 = 'Cannot be fulfilled';
      } else {
        st = 'pending';
        st2 = 'Can be fulfilled';
      }
      if (fui.qty <= fui.reorderLevel) {
        notification(
          'Replenishment Request Generated',
          'New Replenishment Request Generated',
          'Warehouse Member'
        );
        notification(
          'Replenishment Request Generated',
          'New Replenishment Request Generated',
          'FU Member'
        );
        const rrS = await ReplenishmentRequest.create({
          requestNo: 'RR' + day + requestNoFormat(new Date(), 'yyHHMM'),
          generated: 'System',
          generatedBy: 'System',
          reason: 'reactivated_items',
          fuId: req.body.fuId,
          items: [
            {
              itemId: req.body.item[i].itemId,
              currentQty: fui.qty,
              requestedQty: fui.maximumLevel - fui.qty,
              recieptUnit: item.receiptUnit,
              issueUnit: item.issueUnit,
              fuItemCost: 0,
              description: item.description,
              status: st,
              secondStatus: st2,
              batchArray: [],
            },
          ],
          comments: 'System generated Replenishment Request',
          status: 'pending',
          secondStatus: 'pending',
          requesterName: 'System',
          orderType: '',
          to: 'Warehouse',
          from: 'FU',
          department: '',
          rrB: req.body._id,
        });

        if (st2 == 'Cannot be fulfilled') {
          const purchase = await PurchaseRequest.create({
            requestNo: 'PR' + day + requestNoFormat(new Date(), 'yyHHMM'),
            generated: 'System',
            generatedBy: 'System',
            committeeStatus: 'pending',
            status: 'pending',
            commentNotes: 'System',
            reason: 'reactivated_items',
            item: [
              {
                itemId: req.body.item[i].itemId,
                currQty: whInv.qty,
                reqQty: whInv.maximumLevel - whInv.qty,
                comments: 'System',
                name: item.name,
                description: item.description,
                itemCode: item.itemCode,
                status: 'pending',
                secondStatus: 'pending',
              },
            ],
            vendorId: item.vendorId,
            requesterName: 'System',
            department: '',
            orderType: '',
            rr: rrS._id,
          });
          notification(
            'Purchase Request',
            'A new Purchase Request ' +
              purchase.requestNo +
              ' has been generated at ' +
              purchase.createdAt,
            'admin'
          );
        }
      }
    }
  }

  res.status(200).json({ success: true, data: replenishmentRequest });
});
exports.getCurrentItemQuantityBU = asyncHandler(async (req, res) => {
  const buInventory = await BUInventory.findOne(
    { itemId: req.body.itemId, buId: req.body.buId },
    { qty: 1 }
  );
  res.status(200).json({ success: true, data: buInventory });
});
