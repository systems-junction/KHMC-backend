const notification = require('../components/notification');
const mongoose = require('mongoose');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const WarehouseInventory = require('../models/warehouseInventory');
const PurchaseRequest = require('../models/purchaseRequest');
const PurchaseRequestItems = require('../models/purchaseRequestItems');
const requestNoFormat = require('dateformat');

exports.getPurchaseRequests = asyncHandler(async (req, res) => {
  const purchaseRequest = await PurchaseRequest.find()
    .populate('item.itemId')
    .populate('vendorId')
    .populate('approvedBy')
    .populate({
      path: 'item.itemId',
      populate: [
        { path: 'vendorId' }
      ],
    })
  const status = [
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
    commentNotes,
    reason,
    vendorId,
    requesterName,
    department,
    orderType,
    generated,
    approvedBy
  } = req.body;
  var now = new Date();
  var start = new Date(now.getFullYear(), 0, 0);
  var diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
  var oneDay = 1000 * 60 * 60 * 24;
  var day = Math.floor(diff / oneDay);
  const purchaseRequest = await PurchaseRequest.create({
    requestNo: 'PR' + day + requestNoFormat(new Date(), 'yyHHMM'),
    generated,
    generatedBy,
    committeeStatus: 'pending',
    status,
    commentNotes,
    reason,
    item,
    vendorId,
    requesterName,
    department,
    orderType,
    approvedBy
  });
  notification(
    'Purchase Request',
    'A new Purchase Request ' +
      purchaseRequest.requestNo +
      ' has been generated at ' +
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
      'Purchase Request ' +
        req.body.requestNo +
        ' status has been updated ',
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
    { qty: 1 ,maximumLevel:1}
  );
  res.status(200).json({ success: true, data: warehouseInventory });
});
