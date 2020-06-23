/* eslint-disable prefer-const */
const { v4: uuidv4 } = require('uuid');
var nodemailer = require('nodemailer');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Vendor = require('../models/vendor');
const PurchaseOrder = require('../models/purchaseOrder');
const MaterialRecieving = require('../models/materialReceiving');
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'abdulhannan.itsolution@gmail.com',
    pass: 'Abc123##',
  },
});
exports.getPurchaseOrders = asyncHandler(async (req, res) => {
  const purchaseOrder = await PurchaseOrder.find()
    .populate('vendorId')
    .populate('purchaseRequestId');
  const vendor = await Vendor.find();
  const status = [
    { key: 'po_created', value: 'PO Created' },
    { key: 'po_sent', value: 'PO Sent(to Vendor)' },
    { key: 'items_in_transit', value: 'Items In Transit from Vendor' },
    {
      key: 'items_received_from_vendor',
      value: 'Items Received from Vendor(at Warehouse)',
    },
  ];
  const generated = [
    { key: 'system', value: 'System' },
    { key: 'manual', value: 'Manual' },
  ];
  const paymentTerms = [
    { key: 'term1', value: 'Term 1' },
    { key: 'term2', value: 'Term 2' },
  ];

  const data = {
    purchaseOrder,
    vendor,
    status,
    generated,
    paymentTerms,
  };

  res.status(200).json({ success: true, data: data });
});

exports.addPurchaseOrder = asyncHandler(async (req, res) => {
  const {
    generated,
    generatedBy,
    purchaseRequestId,
    date,
    vendorId,
    status,
  } = req.body;
  const purchaseOrder = await PurchaseOrder.create({
    purchaseOrderNo: uuidv4(),
    purchaseRequestId,
    generated,
    generatedBy,
    date,
    vendorId,
    status,
    committeeStatus: 'to_do',
  });
  res.status(200).json({ success: true, data: purchaseOrder });
});

exports.deletePurchaseOrder = asyncHandler(async (req, res, next) => {
  const { _id } = req.params;
  const purchaseOrder = await PurchaseOrder.findById(_id);
  if (!purchaseOrder) {
    return next(
      new ErrorResponse(`Purchase Order not found with id of ${_id}`, 404)
    );
  }

  await PurchaseOrder.deleteOne({ _id: _id });

  res.status(200).json({ success: true, data: {} });
});

exports.updatePurchaseOrder = asyncHandler(async (req, res, next) => {
  const { _id } = req.body;

  let purchaseOrder = await PurchaseOrder.findById(_id);
  if (!purchaseOrder) {
    return next(
      new ErrorResponse(`Purchase Order not found with id of ${_id}`, 404)
    );
  }

  if (req.body.committeeStatus === 'approved') {
    req.body.status = 'items_in_transit';
    req.body.sentAt = Date.now();
    // Sending Email to Vendor

    const purchaseRequest =await PurchaseOrder.findOne({_id:_id}).populate({
      path : 'purchaseRequestId',
      populate: [{
          path : 'item.itemId',
          }]
  }).populate('vendorId');
  const vendorEmail = purchaseRequest.vendorId.contactEmail
  var content = purchaseRequest.purchaseRequestId.reduce(function(a, b) {
    return a + '<tr><td>' + b.item.itemId.itemCode + '</a></td><td>' + b.item.itemId.name + '</td><td>' + b.item.reqQty + '</td></tr>';
     }, '');
       var mailOptions = {
           from: 'abdulhannan.itsolution@gmail.com',
           to: vendorEmail,
           subject: 'Request for items',
           html: '<div><table><thead><tr><th>Item Code</th><th>Item Name</th><th>Quantity</th></tr></thead><tbody>' + 
           content + '</tbody></table></div>'

         };
         transporter.sendMail(mailOptions, function(error, info){
           if (error) {
             console.log(error);
           } else {
             console.log('Email sent: ' + info.response);
           }
         });
  }
  purchaseOrder = await PurchaseOrder.findOneAndUpdate({ _id: _id }, req.body,{new: true});
  if(purchaseOrder.status === "items_in_transit")
  {
    const { prId} = req.body;
    await MaterialRecieving.create({
      prId,
      poId : purchaseOrder._id,
      vendorId : purchaseOrder.vendorId,
      status : "items_in_transit"
  });
  }
  res.status(200).json({ success: true, data: purchaseOrder });
});
