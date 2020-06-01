/* eslint-disable prefer-const */
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const ReceiveItem = require('../models/receiveItem');

exports.getReceiveItems = asyncHandler(async (req, res) => {
    const receiveItems = await ReceiveItem.find().populate('vendorId');

    const data = {
        receiveItems
    }
    
    res.status(200).json({ success: true, data: data });
});

exports.addReceiveItem = asyncHandler(async (req, res) => {
    const { itemCode, itemName, currentQty, requiredQty, receivedQty, bonusQty, batchNumber,
        unit, discount, uniyDiscount, discountAmount, tax, taxAmount, finalUnitPrice, subTotal, 
        totalPrice, invoice, date, comments } = req.body;
    const receiveItem = await ReceiveItem.create({
        itemCode,
        itemName,
        currentQty,
        requiredQty,
        receivedQty,
        batchNumber,
        unit,
        discount,
        bonusQty,
        uniyDiscount,
        discountAmount,
        tax,
        taxAmount,
        finalUnitPrice,
        subTotal,
        totalPrice,
        invoice,
        date,
        comments
    });

    res.status(200).json({ success: true, data: receiveItem });
});

exports.deleteReceiveItem = asyncHandler(async (req, res, next) => {
    const { _id } = req.params;
    const receiveItem = await ReceiveItem.findById(_id);
    if(!receiveItem) {
        return next(
        new ErrorResponse(`Received Item not found with id of ${_id}`, 404)
        );
    }

    await ReceiveItem.deleteOne({_id: _id});

    res.status(200).json({ success: true, data: {} });
});

exports.updateReceiveItem = asyncHandler(async (req, res, next) => {
    const { _id } = req.body;

    let receiveItem = await ReceiveItem.findById(_id);

    if(!receiveItem) {
        return next(
        new ErrorResponse(`Received item not found with id of ${_id}`, 404)
        );
    }

    receiveItem = await ReceiveItem.updateOne({_id: _id}, req.body);
    res.status(200).json({ success: true, data: receiveItem });
});