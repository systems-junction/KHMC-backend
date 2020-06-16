/* eslint-disable prefer-const */
const { v4: uuidv4 } = require('uuid');
var nodemailer = require('nodemailer');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Vendor = require('../models/vendor');
const PurchaseOrder = require('../models/purchaseOrder');
const PurchaseRequest = require('../models/purchaseRequest');
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'abdulhannan.itsolution@gmail.com',
      pass: 'Abc123##'
    }
  });
exports.getPurchaseOrders = asyncHandler(async (req, res) => {
    const purchaseOrder = await PurchaseOrder.find().populate('vendorId');
    const vendor = await Vendor.find();
    const status = [{key:'po_created', value:'PO Created'},{key:'po_sent', value:'PO Sent(to Vendor)'},
    {key:'items_in_transit', value:'Items In Transit from Vendor'},{key:'items_received_from_vendor', value:'Items Received from Vendor(at Warehouse)'}];
    const generated = [{key:'system', value:'System'}, {key:'manual', value:'Manual'}];
    const paymentTerms = [{key:'term1', value:'Term 1'}, {key:'term2', value:'Term 2'}];

    const data = {
        purchaseOrder,
        vendor,
        status,
        generated,
        paymentTerms
    }
    
    res.status(200).json({ success: true, data: data });
});

exports.addPurchaseOrder = asyncHandler(async (req, res) => {
    const { generated,generatedBy,purchaseRequestId, date, vendorId, status,
         } = req.body;
    const purchaseOrder = await PurchaseOrder.create({
        purchaseOrderNo: uuidv4(),
        purchaseRequestId,
        generated,
        generatedBy,
        date,
        vendorId,
        status,
    });
    // const purchaseRequestVendors = await PurchaseRequest.aggregate([
    //     {$match:{"status":"Done"}},
    //     {$lookup:{from:'items',localField:'item.itemId',foreignField:'_id',as:'itemId'}},
    //     {$unwind:"$itemId"},
    //     {$match:{"itemId.vendorId":new mongoose.Types.ObjectId(req.body.vendorId)}},
    //     {$project:{"requestNo":1,"item.reqQty":1,"itemId":1}}
    // ]);
    // var content = purchaseRequestVendors.reduce(function(a, b) {
    //  return a + '<tr><td>' + b.itemId.itemCode + '</a></td><td>' + b.itemId.name + '</td><td>' + b.item.reqQty + '</td></tr>';
    //   }, '');
        // const itemMail = await Item.findOne({_id:req.body.item.itemId}).populate('vendorId');
        // var mailOptions = {
        //     from: 'abdulhannan.itsolution@gmail.com',
        //     to: itemMail.vendorId.contactEmail,
        //     subject: 'Request for items',
        //     html: '<div><table><thead><tr><th>Item Code</th><th>Item Name</th><th>Quantity</th></tr></thead><tbody>' + 
        //     content + '</tbody></table></div>'
    
        //   };
        //   transporter.sendMail(mailOptions, function(error, info){
        //     if (error) {
        //       console.log(error);
        //     } else {
        //       console.log('Email sent: ' + info.response);
        //     }
        //   });

    res.status(200).json({ success: true, data: purchaseOrder });
});

exports.deletePurchaseOrder = asyncHandler(async (req, res, next) => {
    const { _id } = req.params;
    const purchaseOrder = await PurchaseOrder.findById(_id);
    if(!purchaseOrder) {
        return next(
        new ErrorResponse(`Purchase Order not found with id of ${_id}`, 404)
        );
    }

    await PurchaseOrder.deleteOne({_id: _id});

    res.status(200).json({ success: true, data: {} });
});

exports.updatePurchaseOrder = asyncHandler(async (req, res, next) => {
    const { _id } = req.body;

    let purchaseOrder = await PurchaseOrder.findById(_id);

    if(!purchaseOrder) {
        return next(
        new ErrorResponse(`Purchase Order not found with id of ${_id}`, 404)
        );
    }

    purchaseOrder = await PurchaseOrder.updateOne({_id: _id}, req.body);
    if(req.body.status == "done")
    {
      const purchaseRequestVendors = await PurchaseRequest.aggregate([
        {$match:{"status":"Done"}},
        {$lookup:{from:'items',localField:'item.itemId',foreignField:'_id',as:'itemId'}},
        {$unwind:"$itemId"},
        {$match:{"itemId.vendorId":new mongoose.Types.ObjectId(req.body.vendorId)}},
        {$project:{"requestNo":1,"item.reqQty":1,"itemId":1}}
    ]);
    var content = purchaseRequestVendors.reduce(function(a, b) {
      return a + '<tr><td>' + b.itemId.itemCode + '</a></td><td>' + b.itemId.name + '</td><td>' + b.item.reqQty + '</td></tr>';
       }, '');
         const itemMail = await Item.findOne({_id:req.body.item.itemId}).populate('vendorId');
         var mailOptions = {
             from: 'abdulhannan.itsolution@gmail.com',
             to: itemMail.vendorId.contactEmail,
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
    res.status(200).json({ success: true, data: PurchaseOrder });
});