/* eslint-disable prefer-const */
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const ReceiveItem = require('../models/receiveItem');
const MaterialReceiving = require('../models/materialReceiving');
const WhInventory = require('../models/warehouseInventory');
const PurchaseRequest = require('../models/purchaseRequest');
const Account = require('../models/account');
exports.getReceiveItems = asyncHandler(async (req, res) => {
    const receiveItems = await ReceiveItem.find().populate('vendorId');

    const data = {
        receiveItems
    }
    
    res.status(200).json({ success: true, data: data });
});

exports.addReceiveItem = asyncHandler(async (req, res) => {
    const { itemId,currentQty, requestedQty, receivedQty, bonusQty, batchNumber,lotNumber,
        expiryDate,unit, discount, unitDiscount, discountAmount, tax, taxAmount, finalUnitPrice, subTotal, 
        discountAmount2,totalPrice, invoice, dateInvoice,dateReceived, notes,materialId,vendorId,prId } = req.body;
    await ReceiveItem.create({
        itemId,
        currentQty,
        requestedQty,
        receivedQty,
        bonusQty,
        batchNumber,
        lotNumber,
        expiryDate,
        unit,
        discount,
        unitDiscount,
        discountAmount,
        tax,
        taxAmount,
        finalUnitPrice,
        subTotal,
        discountAmount2,
        totalPrice,
        invoice,
        dateInvoice,
        dateReceived,
        notes
    });
    await PurchaseRequest.findOneAndUpdate({'_id': prId},{ $set: { status: 'pending_approval_from_accounts' }},{new: true});
    await WhInventory.updateOne({itemId: itemId}, { $set: { qty: currentQty+receivedQty }})
    const mat = await MaterialReceiving.findOneAndUpdate({'_id': materialId,'prId.id':prId},{ $set: { 'prId.$.status': 'received' }},{new: true});
   var count = 0;
    for(let i = 0; i<mat.prId.length; i++)
    {
        if(mat.prId[i].status="received"){
            count++;
        }
    }
    if(count == mat.prId.length)
    {
        await Account.create({
            mrId:materialId,
            status:"pending_approval_from_accounts",
            vendorId:vendorId
        })
    }
    res.status(200).json({ success: true});
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