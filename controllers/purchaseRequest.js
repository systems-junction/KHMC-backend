const notification = require('../components/notification');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const WarehouseInventory = require('../models/warehouseInventory');
const PurchaseRequest = require('../models/purchaseRequest');
const PurchaseRequestItems = require('../models/purchaseRequestItems');
const requestNoFormat = require('dateformat');

exports.getPurchaseRequests = asyncHandler(async (req, res) => {
  const purchaseRequest = await PurchaseRequest.find()
    .populate('item.itemId')
    .populate('vendorId');
  const status = [
    { key: 'to_do', value: 'To do' },
    { key: 'in_progress', value: 'In Progress' },
    { key: 'on_hold', value: 'On hold' },
    { key: 'modified', value: 'Modified' },
    { key: 'done', value: 'Done' },
  ];
  const data = {
    purchaseRequest,
    status,
  };
  res.status(200).json({ success: true, data: data });
});
exports.addPurchaseRequest = asyncHandler(async (req, res) => {
  const {
    generatedBy,
    status,
    item,
    comments,
    reason,
    vendorId,
    requesterName,
    department,
    orderType,
    generated,
  } = req.body;
  const purchaseRequest = await PurchaseRequest.create({
    requestNo: 'PR' + requestNoFormat(new Date(), 'mmddyyHHmm'),
    generated,
    generatedBy,
    committeeStatus: 'to_do',
    status,
    comments,
    reason,
    item,
    vendorId,
    requesterName,
    department,
    orderType,
  });
  console.log(purchaseRequest)
  notification(
    'Purchase Request',
    'A new Purchase Request ' +
      purchaseRequest.requestNo +
      'has been generated at ' +
      purchaseRequest.createdAt,
    'Committe Member'
  );
  const pr = await PurchaseRequest.find()
    .populate('itemId')
    .populate('vendorId');
  globalVariable.io.emit('get_data', pr);
  res.status(200).json({ success: true, data: purchaseRequest });
});

exports.deletePurchaseRequest = asyncHandler(async (req, res, next) => {
  const { _id } = req.params;
  const purchaseRequest = await PurchaseRequest.findById(_id);
  if (!purchaseRequest) {
    return next(
      new ErrorResponse(`Purchase Request not found with id of ${_id}`, 404)
    );
  }

  await PurchaseRequest.deleteOne({ _id: _id });
  await PurchaseRequestItems.deleteMany({ purchaseRequestId: _id });

  res.status(200).json({ success: true, data: {} });
});

exports.updatePurchaseRequest = asyncHandler(async (req, res, next) => {
  const { _id } = req.body;

  let purchaseRequest = await PurchaseRequest.findById(_id);

  if (!purchaseRequest) {
    return next(
      new ErrorResponse(`Purchase Request not found with id of ${_id}`, 404)
    );
  }

  if (req.body.committeeStatus === 'approved') {
    req.body.status = 'in_progress';
    notification(
      'Purchase Request',
      'A new Purchase Request ' +
        req.body.requestNo +
        'has been generated at ' +
        req.body.updatedAt,
      'admin'
    );
    const pr = await PurchaseRequest.find()
      .populate('itemId')
      .populate('vendorId');
    globalVariable.io.emit('get_data', pr);
  }

  purchaseRequest = await PurchaseRequest.findOneAndUpdate(
    { _id: _id },
    req.body
  );

  // if (req.body.status == 'pending_recieving') {
  //   let purchaseOrder = await PurchaseOrder.findOne({
  //     status: 'pending_recieving',
  //     vendorId: req.body.vendorId,
  //   });
  //   if (purchaseOrder) {
  //     await PurchaseOrder.updateOne(
  //       { _id: purchaseOrder._id },
  //       { $push: { purchaseRequestId: purchaseRequest._id } }
  //     );
  //   } else {
  //     const { generatedBy, date, vendorId, status } = req.body;
  //     await PurchaseOrder.create({
  //       purchaseOrderNo: uuidv4(),
  //       purchaseRequestId: purchaseRequest._id,
  //       date,
  //       generatedBy,
  //       vendorId,
  //       status,
  //     });
  //   }
  // }
  res.status(200).json({ success: true, data: PurchaseRequest });
});

exports.getPurchaseRequestVendors = asyncHandler(async (req, res) => {
  const purchaseRequestVendors = await PurchaseRequest.aggregate([
    { $match: { status: 'Done' } },
    {
      $lookup: {
        from: 'items',
        localField: 'item.itemId',
        foreignField: '_id',
        as: 'itemId',
      },
    },
    { $unwind: '$itemId' },
    {
      $match: {
        'itemId.vendorId': new mongoose.Types.ObjectId(req.params._id),
      },
    },
    { $project: { requestNo: 1, 'item.reqQty': 1, itemId: 1 } },
  ]);
  res.status(200).json({ success: true, data: purchaseRequestVendors });
});

exports.getCurrentItemQuantity = asyncHandler(async (req, res) => {
  const warehouseInventory = await WarehouseInventory.findOne(
    { itemId: req.params._id },
    { qty: 1 }
  );
  res.status(200).json({ success: true, data: warehouseInventory });
});
