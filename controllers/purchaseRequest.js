/* eslint-disable prefer-const */
const mongoose = require('mongoose');
var nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const WarehouseInventory = require('../models/warehouseInventory');
const Item = require('../models/item');
const PurchaseRequest = require('../models/purchaseRequest');
const PurchaseOrder = require('../models/purchaseOrder');
const PurchaseRequestItems = require('../models/purchaseRequestItems');
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'abdulhannan.itsolution@gmail.com',
    pass: 'Abc123##',
  },
});
exports.getPurchaseRequests = asyncHandler(async (req, res) => {
  const purchaseRequest = await PurchaseRequest.find()
    .populate('itemId')
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
    requestNo: uuidv4(),
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
  // if(req.body.status == "Done")
  // {
  //     const itemMail = await Item.findOne({_id:req.body.item.itemId}).populate('vendorId');
  //     var mailOptions = {
  //         from: 'abdulhannan.itsolution@gmail.com',
  //         to: itemMail.vendorId.contactEmail,
  //         subject: 'Request for item '+itemMail.name+' with code '+itemMail.itemCode,
  //         text: 'Kindly send us item '+itemMail.name+' with code '+itemMail.itemCode+' in quantity '+req.body.item.reqQty
  //       };
  //       transporter.sendMail(mailOptions, function(error, info){
  //         if (error) {
  //           console.log(error);
  //         } else {
  //           console.log('Email sent: ' + info.response);
  //         }
  //       });
  // }
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
