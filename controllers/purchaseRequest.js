/* eslint-disable prefer-const */
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Vendor = require('../models/vendor');
const PurchaseRequest = require('../models/purchaseRequest');
const PurchaseRequestItems = require('../models/purchaseRequestItems');

exports.getPurchaseRequests = asyncHandler(async (req, res) => {
    const purchaseRequest = await PurchaseRequest.find().populate('vendorId');
    const vendor = await Vendor.find();
    const status = [{key:'to_do', value:'To do'},{key:'in_progress', value:'In Progress'},
        {key:'on_hold', value:'On hold'},{key:'modified', value:'Modified'},{key:'done', value:'Done'}];

    const data = {
        purchaseRequest,
        vendor,
        status,
    }
    
    res.status(200).json({ success: true, data: data });
});

exports.getPurchaseRequestItems = asyncHandler(async (req, res) => {
    const purchaseRequestItems = await PurchaseRequestItems.find({purchaseRequestId: req.params._id});

    res.status(200).json({ success: true, data: purchaseRequestItems });
});

exports.addPurchaseRequest = asyncHandler(async (req, res) => {
    const { _id, generatedBy, date, status, name, description,
        currentQty, reqQty, comments } = req.body;
    const purchaseRequest = await PurchaseRequest.create({
        _id,
        requestNo: uuidv4(),
        generatedBy,
        date,
        status,
        name,
        description,
        currentQty,
        reqQty,
        comments
    });

    res.status(200).json({ success: true, data: purchaseRequest });
});

exports.addPurchaseRequestItem = asyncHandler(async (req, res) => {
    let { itemCode, name, vendorId, description,
    currentQty, reqQty, comments, purchaseRequestId } = req.body;
    console.log("req body: ", req.body);
    if(!purchaseRequestId){  // if one item already added against this purchase request
        purchaseRequestId = new mongoose.mongo.ObjectID();
    }
    const purchaseRequestItem = await PurchaseRequestItems.create({
        itemCode,
        name,
        vendorId,
        description,
        currentQty,
        reqQty,
        comments,
        purchaseRequestId
    });

    const data = {
        purchaseRequestItem,
        purchaseRequestId
    }
    res.status(200).json({ success: true, data: data });
});

exports.deletePurchaseRequest = asyncHandler(async (req, res, next) => {
    const { _id } = req.params;
    const purchaseRequest = await PurchaseRequest.findById(_id);
    if(!purchaseRequest) {
        return next(
        new ErrorResponse(`Purchase Request not found with id of ${_id}`, 404)
        );
    }

    await PurchaseRequest.deleteOne({_id: _id});
    await PurchaseRequestItems.deleteMany({ purchaseRequestId: _id});

    res.status(200).json({ success: true, data: {} });
});

exports.updatePurchaseRequest = asyncHandler(async (req, res, next) => {
    const { _id } = req.body;

    let purchaseRequest = await PurchaseRequest.findById(_id);

    if(!purchaseRequest) {
        return next(
        new ErrorResponse(`Purchase Request not found with id of ${_id}`, 404)
        );
    }

    purchaseRequest = await PurchaseRequest.updateOne({_id: _id}, req.body);
    res.status(200).json({ success: true, data: PurchaseRequest });
});

exports.updatePurchaseRequestItem = asyncHandler(async (req, res, next) => {
    const { _id } = req.body;

    let purchaseRequestItem = await PurchaseRequestItems.findById(_id);

    if(!purchaseRequestItem) {
        return next(
            new ErrorResponse(`Purchase Request Item not found with id of ${_id}`, 404)
        );
    }

    purchaseRequestItem = await PurchaseRequestItems.updateOne({_id: _id}, req.body);
    res.status(200).json({ success: true, data: purchaseRequestItem });
});