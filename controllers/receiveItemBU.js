/* eslint-disable prefer-const */
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const ReceiveItemBU = require('../models/receiveItemBU');
const BUInventory = require('../models/buInventory');
const FUInventory = require('../models/fuInventory');
const ReplenishmentRequestBU = require('../models/replenishmentRequestBU');
exports.getReceiveItemsBU = asyncHandler(async (req, res) => {
    const receiveItems = await ReceiveItemBU.find().populate('vendorId');
    const data = {
        receiveItems
    }   
    res.status(200).json({ success: true, data: data });
});

exports.addReceiveItemBU = asyncHandler(async (req, res) => {
    const { itemId,currentQty, requestedQty, receivedQty, bonusQty, batchNumber,lotNumber,
        expiryDate,unit, discount, unitDiscount, discountAmount, tax, taxAmount, finalUnitPrice, subTotal, 
        discountAmount2,totalPrice, invoice, dateInvoice,dateReceived, notes,replenishmentRequestId,replenishmentRequestStatus,fuId } = req.body;
    await ReceiveItemBU.create({
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
        notes,
        replenishmentRequestId
    });
    await ReplenishmentRequestBU.findOneAndUpdate({_id: replenishmentRequestId},{ $set: { status:req.body.replenishmentRequestStatus,secondStatus:req.body.replenishmentRequestStatus }},{new:true});
    if((req.body.replenishmentRequestStatus=="ReceivedTest")||(req.body.replenishmentRequestStatus=="Partially ReceivedTest"))
    {       
            const bu = await BUInventory.findOne({itemId: itemId})
            const fu = await FUInventory.findOne({itemId: itemId})
            await BUInventory.findOneAndUpdate({itemId: itemId}, { $set: { qty: bu.qty+receivedQty }},{new:true})
            const pr = await FUInventory.findOneAndUpdate({itemId: itemId}, { $set: { qty: fu.qty-receivedQty }},{new:true}).populate('itemId')
        //     if(pr.qty<=pr.itemId.reorderLevel)
        //     {
        //     const j =await Item.findOne({_id:req.body.itemId}) 
        //     var item={
        //         itemId:req.body.itemId,
        //         currQty:0,
        //         reqQty:100,
        //         comments:'System',
        //         name:j.name,
        //         description:j.description,
        //         itemCode:j.itemCode
        //     }
        //         await PurchaseRequest.create({
        //             requestNo: uuidv4(),
        //             generated:'System',
        //             generatedBy:'System',
        //             committeeStatus: 'to_do',
        //             status:'to_do',
        //             comments:'System',
        //             reason:'System',
        //             item,
        //             vendorId:j.vendorId,
        //             requesterName:'System',
        //             department:'System',
        //             orderType:'System',
        //           });
        // }
    }

    res.status(200).json({ success: true});
});

exports.deleteReceiveItemBU = asyncHandler(async (req, res, next) => {
    const { _id } = req.params;
    const receiveItem = await ReceiveItemBU.findById(_id);
    if(!receiveItem) {
        return next(
        new ErrorResponse(`Received Item not found with id of ${_id}`, 404)
        );
    }
    await ReceiveItemBU.deleteOne({_id: _id});
    res.status(200).json({ success: true, data: {} });
});

exports.updateReceiveItemBU = asyncHandler(async (req, res, next) => {
    const { _id } = req.body;

    let receiveItem = await ReceiveItemBU.findById(_id);

    if(!receiveItem) {
        return next(
        new ErrorResponse(`Received item not found with id of ${_id}`, 404)
        );
    }

    receiveItem = await ReceiveItemBU.updateOne({_id: _id}, req.body);
    res.status(200).json({ success: true, data: receiveItem });
});