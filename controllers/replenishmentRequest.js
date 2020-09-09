/* eslint-disable prefer-const */
const notification = require('../components/notification');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { v4: uuidv4 } = require('uuid');
const ReplenishmentRequest = require('../models/replenishmentRequest');
const WHInventory = require('../models/warehouseInventory');
const FUInventory = require('../models/fuInventory');
const PurchaseRequest = require('../models/purchaseRequest');
const Item = require('../models/item');
const requestNoFormat = require('dateformat');

exports.getReplenishmentRequestsFU = asyncHandler(async (req, res) => {
  const replenishmentRequest = await ReplenishmentRequest.find()
    .populate('fuId')
    .populate('items.itemId')
    .populate('approvedBy');
  res.status(200).json({ success: true, data: replenishmentRequest });
});
exports.getReplenishmentRequestsByIdFU = asyncHandler(async (req, res) => {
  const replenishmentRequest = await ReplenishmentRequest.findOne({ _id: _id })
    .populate('fuId')
    .populate('items.itemId');
  res.status(200).json({ success: true, data: replenishmentRequest });
});
exports.addReplenishmentRequest = asyncHandler(async (req, res) => {
  const {
    generated,
    generatedBy,
    dateGenerated,
    reason,
    fuId,
    to,
    from,
    comments,
    items,
    status,
    approvedBy,
    requesterName,
    orderType,
    department,
    secondStatus
  } = req.body;
  var now = new Date();
  var start = new Date(now.getFullYear(), 0, 0);
  var diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
  var oneDay = 1000 * 60 * 60 * 24;
  var day = Math.floor(diff / oneDay);
  for(let i=0; i<items.length; i++){
    var wahi = await WHInventory.findOne({ itemId: req.body.items[i].itemId });
    if (wahi.qty < req.body.items[i].requestedQty) {
      req.body.items[i].secondStatus = 'Cannot be fulfilled';
    } else {
      req.body.items[i].secondStatus = 'Can be fulfilled';
    }
  }
  // const wh = await WHInventory.findOne({ itemId: req.body.itemId });
  // if (wh.qty < req.body.requestedQty) {
  //   req.body.secondStatus = 'Cannot be fulfilled';
  // } else {
  //   req.body.secondStatus = 'Can be fulfilled';
  // }
  const rrS = await ReplenishmentRequest.create({
    requestNo: 'RR' + day + requestNoFormat(new Date(), 'yyHHMM'),
    generated,
    generatedBy,
    dateGenerated,
    reason,
    fuId,
    to,
    from,
    comments,
    items,
    status,
    secondStatus:"pending",
    approvedBy,
    requesterName,
    orderType,
    department,
  });
  notification(
    'Replenishment Request',
    'A new Manual replenishment request has been generated at ' + rrS.createdAt,
    'Warehouse Member'
  );
  notification(
    'Replenishment Request',
    'A new Manual replenishment request has been generated at ' + rrS.createdAt,
    'FU Member'
  );
  if (req.body.secondStatus == 'Cannot be fulfilled') {
    const i = await Item.findOne({ _id: req.body.itemId });
    const purchase = await PurchaseRequest.create({
      requestNo: 'PR'+ day + requestNoFormat(new Date(), 'yyHHMM'),
      generated: 'System',
      generatedBy: 'System',
      committeeStatus: 'to_do',
      status: 'to_do',
      comments: 'System',
      reason: 'System',
      item:[
        {
          itemId: req.body.itemId,
          currQty: wh.qty,
          reqQty: wh.maximumLevel - wh.qty,
          comments: 'System',
          name: i.name,
          description: i.description,
          itemCode: i.itemCode,
          status:"pending",
          secondStatus:"pending"
        }
      ],
      vendorId: i.vendorId,
      requesterName: 'System',
      department: 'System',
      orderType: 'System',
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
  res.status(200).json({ success: true });
});

exports.deleteReplenishmentRequest = asyncHandler(async (req, res, next) => {
  const { _id } = req.params;
  const replenishmentRequest = await ReplenishmentRequest.findById(_id);
  if (!replenishmentRequest) {
    return next(
      new ErrorResponse(
        `Replenishment Request not found with id of ${_id}`,
        404
      )
    );
  }
  await ReplenishmentRequest.deleteOne({ _id: _id });
  res.status(200).json({ success: true, data: {} });
});

exports.updateReplenishmentRequest = asyncHandler(async (req, res, next) => {
  const { _id } = req.body;
  let replenishmentRequest = await ReplenishmentRequest.findById(_id);
  if (!replenishmentRequest) {
    return next(
      new ErrorResponse(
        `Replenishment Request not found with id of ${_id}`,
        404
      )
    );
  }
  for(let i=0; i<req.body.items.length; i++){
    var wahi = await WHInventory.findOne({ itemId: req.body.items[i].itemId });
    if (wahi.qty < req.body.items[i].requestedQty) {
      req.body.items[i].secondStatus = 'Cannot be fulfilled';
    } else {
      req.body.items[i].secondStatus = 'Can be fulfilled';
    }
  }
  replenishmentRequest = await ReplenishmentRequest.findOneAndUpdate(
    { _id: _id },
    req.body,
    { new: true }
  );

  if (req.body.status == 'Fulfillment Initiated') {
    notification(
      'Replenishment Request',
      'Replenishment Request ' +
        replenishmentRequest.requestNo +
        ' has been updated to Fulfillment Initiated by the Inventory Keeper at ' +
        replenishmentRequest.updatedAt,
      'FU Member'
    );
  }
  if (req.body.status == 'Delivery in Progress') {
    notification(
      'Replenishment Request',
      'Replenishment Request ' +
        replenishmentRequest.requestNo +
        ' has been updated to Delivery in Progress by the Inventory Keeper at ' +
        replenishmentRequest.updatedAt,
      'FU Member'
    );
  }
  res.status(200).json({ success: true, data: replenishmentRequest });
});

exports.getCurrentItemQuantityFU = asyncHandler(async (req, res) => {
  const fuInventory = await FUInventory.findOne(
    { itemId: req.body.itemId, fuId: req.body.fuId },
    { qty: 1 }
  );
  res.status(200).json({ success: true, data: fuInventory });
});
