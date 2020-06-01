/* eslint-disable prefer-const */
const { v4: uuidv4 } = require('uuid');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Vendor = require('../models/vendor');
const PurchaseOrder = require('../models/purchaseOrder');

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
    const { generated, date, vendorId, status, paymentTerm, shippingTerm, vendorEmail,
        vendorPhoneNo, vendorAddress, comments } = req.body;
    const purchaseOrder = await PurchaseOrder.create({
        purchaseOrderNo: uuidv4(),
        generated,
        date,
        paymentTerm,
        shippingTerm,
        vendorId,
        vendorEmail,
        vendorPhoneNo,
        vendorAddress,
        status,
        comments
    });

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
    res.status(200).json({ success: true, data: PurchaseOrder });
});