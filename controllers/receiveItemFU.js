/* eslint-disable prefer-const */
const notification = require('../components/notification')
const { v4: uuidv4 } = require('uuid');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const PurchaseRequest = require('../models/purchaseRequest');
const ReceiveItemFU = require('../models/receiveItemFU');
const FUInventory = require('../models/fuInventory');
const ReplenishmentRequest = require('../models/replenishmentRequest');
const ReplenishmentRequestBU = require('../models/replenishmentRequestBU');
const WHInventory = require('../models/warehouseInventory');
const Item = require('../models/item');

exports.getReceiveItemsFU = asyncHandler(async (req, res) => {
    const receiveItems = await ReceiveItemFU.find().populate('vendorId');
    const data = {
        receiveItems
    }   
    res.status(200).json({ success: true, data: data });
});
exports.addReceiveItemFU = asyncHandler(async (req, res) => {
  const { itemId,currentQty, requestedQty, receivedQty, bonusQty, batchNumber,lotNumber,
        expiryDate,unit, discount, unitDiscount, discountAmount, tax, taxAmount, finalUnitPrice, subTotal, 
        discountAmount2,totalPrice, invoice, dateInvoice,dateReceived, notes,replenishmentRequestId,replenishmentRequestStatus,fuId } = req.body;
        const pRequest = await WHInventory.findOne({itemId: itemId}).populate('itemId')
        const fuTest = await FUInventory.findOne({itemId: itemId,fuId:req.body.fuId})
        if(pRequest && fuTest)
        {
        await ReceiveItemFU.create({
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
    });}
    if((req.body.replenishmentRequestStatus=="Received")||(req.body.replenishmentRequestStatus=="Partially Received"))
    {
            const fu = await FUInventory.findOne({itemId: itemId, fuId:req.body.fuId})
            const wh = await WHInventory.findOne({itemId: itemId})
            const fUnit = await FUInventory.findOneAndUpdate({itemId: itemId, fuId:req.body.fuId}, { $set: { qty: fu.qty+parseInt(receivedQty) }},{new:true})
            const pr = await WHInventory.findOneAndUpdate({itemId: itemId}, { $set: { qty: wh.qty-parseInt(receivedQty) }},{new:true}).populate('itemId')
            if (fUnit)
            {
                const rReq = await ReplenishmentRequest.findOne({_id: replenishmentRequestId})
                // Here cannot status update
                await ReplenishmentRequestBU.findOneAndUpdate({_id: rReq.rrB, 'item.itemId':req.body.itemId}, { $set: {'item.$.secondStatus':"Can be fulfilled"}})
                notification("Replenishment Request", "Replenishment Request "+rReq.requestNo+" has been completed at "+req.body.updatedAt, "Warehouse Incharge")
            } 
            if(fu && pr)
            {
             await ReplenishmentRequest.findOneAndUpdate({_id: replenishmentRequestId},{ $set: { status:req.body.replenishmentRequestStatus,secondStatus:req.body.replenishmentRequestStatus }},{new:true});
            if(pr.qty<=pr.reorderLevel)
            {
            const j =await Item.findOne({_id:req.body.itemId}) 
            var item={
                itemId:req.body.itemId,
                currQty:pr.qty,
                reqQty:pr.maximumLevel-pr.qty,
                comments:'System',
                name:j.name,
                description:j.description,
                itemCode:j.itemCode
            }
              const purchaseRequest = await PurchaseRequest.create({
                    requestNo: uuidv4(),
                    generated:'System',
                    generatedBy:'System',
                    committeeStatus: 'to_do',
                    status:'to_do',
                    comments:'System',
                    reason:'reactivated_items',
                    item,
                    vendorId:j.vendorId,
                    requesterName:'System',
                    department:'',
                    orderType:'',
                    rr: replenishmentRequestId
                  });
                  notification("Purchase Request", "A new Purchase Request "+purchaseRequest.requestNo+"has been generated at "+purchaseRequest.createdAt, "Committe Member")         
        }}}
    res.status(200).json({ success: true});
});

exports.deleteReceiveItemFU = asyncHandler(async (req, res, next) => {
    const { _id } = req.params;
    const receiveItem = await ReceiveItemFU.findById(_id);
    if(!receiveItem) {
        return next(
        new ErrorResponse(`Received Item not found with id of ${_id}`, 404)
        );
    }
    await ReceiveItemFU.deleteOne({_id: _id});
    res.status(200).json({ success: true, data: {} });
});

exports.updateReceiveItemFU = asyncHandler(async (req, res, next) => {
    const { _id } = req.body;
    let receiveItem = await ReceiveItemFU.findById(_id);
    if(!receiveItem) {
        return next(
        new ErrorResponse(`Received item not found with id of ${_id}`, 404)
        );
    }
    receiveItem = await ReceiveItemFU.updateOne({_id: _id}, req.body);
    res.status(200).json({ success: true, data: receiveItem });
});