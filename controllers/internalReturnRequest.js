/* eslint-disable prefer-const */
const notification = require('../components/notification')
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { v4: uuidv4 } = require('uuid');
const InternalReturnRequest = require('../models/internalReturnRequest');
const receiveItemFU = require('../models/receiveItemFU');
const receiveItemBU = require('../models/receiveItemBU');
const ReplenishmentRequest = require('../models/replenishmentRequest');
const ReplenishmentRequestBU = require('../models/replenishmentRequestBU');
const WHInventory = require('../models/warehouseInventory');
const FUInventory = require('../models/fuInventory');
const BUInventory = require('../models/buInventory');
const FunctionalUnit = require('../models/functionalUnit');
const PurchaseRequest = require('../models/purchaseRequest');
const Item = require('../models/item');
const ReturnedQty = require('../models/returnedQty')
exports.getInternalReturnRequestsFU = asyncHandler(async (req, res) => {
    const internalRequestFU = await InternalReturnRequest.find({to:"Warehouse",from:"FU"}).populate('fuId').populate('itemId').populate('replenishmentRequestFU');
    res.status(200).json({ success: true, data: internalRequestFU });
});
exports.getInternalReturnRequestsBU = asyncHandler(async (req, res) => {
    const internalRequestBU = await InternalReturnRequest.find({to:"FU",from:"BU"}).populate('buId').populate('fuId').populate('itemId').populate('replenishmentRequestBU');
    res.status(200).json({ success: true, data: internalRequestBU });
});
exports.getInternalReturnRequestsById = asyncHandler(async (req, res) => {
    const internalRequest = await (await InternalReturnRequest.findOne({_id:_id,}).populate('buId').populate('fuId').populate('itemId').populate('replenishmentRequestBU').populate('replenishmentRequestFU'));
    res.status(200).json({ success: true, data: internalRequest });
});
exports.deleteInternalReturnRequests = asyncHandler(async (req, res, next) => {
    const { _id } = req.params;
    const internalReturn = await InternalReturnRequest.findById(_id);
    if(!internalReturn) {
        return next(
        new ErrorResponse(`Internal Return not found with id of ${_id}`, 404)
        );
    }
    await InternalReturnRequest.deleteOne({_id: _id});
    res.status(200).json({ success: true, data: {} });
});

exports.addInternalReturnRequest = asyncHandler(async (req, res) => {
    const { generatedBy,dateGenerated,expiryDate,to,from,fuId,buId,itemId,currentQty,reason,returnedQty,
           reasonDetail,description,status,damageReport,replenishmentRequestBU,replenishmentRequestFU} = req.body;
   const irr = await InternalReturnRequest.create({
        returnRequestNo: uuidv4(),
        generatedBy,
        dateGenerated,
        expiryDate,
        to,
        from,
        fuId,
        buId,
        itemId,
        currentQty,
        returnedQty,
        description,
        reason,
        reasonDetail,
        damageReport,
        status,
        replenishmentRequestBU,replenishmentRequestFU
    });
    notification("Return Request", "A new Return Request "+irr.returnRequestNo+" has been generated at "+irr.createdAt, "FU Internal Request Return Approval Member")
    const send = await InternalReturnRequest.find({to:"Warehouse",from:"FU"}).populate('fuId').populate('itemId').populate('replenishmentRequestFU');
    globalVariable.io.emit("get_data", send)
    res.status(200).json({ success: true });
});


exports.updateInternalRequest = asyncHandler(async (req, res, next) => {
    const { _id } = req.body;
    let internalReturn = await InternalReturnRequest.findById(_id);
    if(!internalReturn) {
        return next(
        new ErrorResponse(`Internal Return not found with id of ${_id}`, 404)
        );
    }
    if(req.body.status=="approved")
    {
        notification("Return Request", "The Return Request "+ req.body.returnRequestNo+" has been approved at "+req.body.updatedAt, "FU Inventory Keeper")
        notification("Return Request", "The Return Request "+ req.body.returnRequestNo+" has been approved at "+req.body.updatedAt, "Warehouse Member")
        const send = await InternalReturnRequest.find({to:"Warehouse",from:"FU"}).populate('fuId').populate('itemId').populate('replenishmentRequestFU');
        globalVariable.io.emit("get_data", send)
        req.body.status="Item Returned to Warehouse";
        if((req.body.to=="Warehouse")&&(req.body.from=="FU"))
        {
         const receive = await receiveItemFU.findOne({replenishmentRequestId:req.body.replenishmentRequestFU})
         const fu = await FUInventory.findOne({itemId: req.body.itemId, fuId:req.body.fuId})
         const wh = await WHInventory.findOne({itemId: req.body.itemId})
         await FUInventory.findOneAndUpdate({itemId: req.body.itemId}, { $set: { qty: fu.qty-req.body.returnedQty }},{new:true})
        //  await WHInventory.findOneAndUpdate({itemId: req.body.itemId}, { $set: { qty: wh.qty+receive.receivedQty }},{new:true})
         await ReplenishmentRequest.findOneAndUpdate({_id:req.body.replenishmentRequestFU},{ $set: { status: "Returned", secondStatus:"Returned"}})
         await ReturnedQty.create({
            fuiId:fu._id,
            whiId:wh._id,
            itemId:req.body.itemId,
            returnedQty:req.body.returnedQty,
         })
         }
        // if((req.body.to=="FU")&&(req.body.from=="BU"))
        // {
        //  const receive = await receiveItemBU.findOne({replenishmentRequestId:req.body.replenishmentRequestFU})
        //  const bu = await BUInventory.findOne({itemId: req.body.itemId})
        //  const fu = await FUInventory.findOne({itemId: req.body.itemId})
        //  await BUInventory.findOneAndUpdate({itemId: req.body.itemId}, { $set: { qty: bu.qty-receive.receivedQty }},{new:true})
        //  await FUInventory.findOneAndUpdate({itemId: req.body.itemId}, { $set: { qty: fu.qty+receive.receivedQty }},{new:true})
        //  await ReplenishmentRequestBU.findOneAndUpdate({_id:req.body.replenishmentRequestBU},{ $set: { status: "Returned because of Issue", secondStatus:"Returned because of Issue"}})
        // }
    }
    internalReturn = await InternalReturnRequest.findOneAndUpdate({_id: _id}, req.body,{new:true});
    res.status(200).json({ success: true, data: internalReturn });
});