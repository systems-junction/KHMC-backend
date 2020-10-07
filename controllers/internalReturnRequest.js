/* eslint-disable prefer-const */
const notification = require('../components/notification')
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const InternalReturnRequest = require('../models/internalReturnRequest');
const receiveItemFU = require('../models/receiveItemFU');
const ReplenishmentRequest = require('../models/replenishmentRequest');
const WHInventory = require('../models/warehouseInventory');
const FUInventory = require('../models/fuInventory');
const ReturnedQty = require('../models/returnedQty')
const requestNoFormat = require('dateformat');
exports.getInternalReturnRequestsFU = asyncHandler(async (req, res) => {
    const internalRequestFU = await InternalReturnRequest.find({to:"Warehouse",from:"FU"}).populate('fuId').populate('itemId').populate('replenishmentRequestFU');
    res.status(200).json({ success: true, data: internalRequestFU });
});
exports.getInternalReturnRequestsFUByKeyword = asyncHandler(async (req, res) => {
    const internalRequestFU = await InternalReturnRequest.find({to:"Warehouse",from:"FU"}).populate('fuId').populate('itemId').populate('replenishmentRequestFU');
    var arr=[];
    for(let i=0; i<internalRequestFU.length; i++)
    {
      if(
        (internalRequestFU[i].returnRequestNo && internalRequestFU[i].returnRequestNo.toLowerCase().match(req.params.keyword.toLowerCase()))
        )
        {
          arr.push(internalRequestFU[i])
        }
    }
    res.status(200).json({ success: true, data: arr });
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
           reasonDetail,description,status,damageReport,replenishmentRequestBU,replenishmentRequestFU, returnBatchArray} = req.body;
    var now = new Date();
    var start = new Date(now.getFullYear(), 0, 0);
    var diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
    var oneDay = 1000 * 60 * 60 * 24;
    var day = Math.floor(diff / oneDay);
    const irr = await InternalReturnRequest.create({
        returnRequestNo: 'IR'+ day + requestNoFormat(new Date(), 'yyHHMM'),
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
        replenishmentRequestBU,replenishmentRequestFU,
        returnBatchArray
    });
    notification("Return Request", "A new Return Request "+irr.returnRequestNo+" has been generated at "+irr.createdAt, "FU Internal Request Return Approval Member")
    const send = await InternalReturnRequest.find({to:"Warehouse",from:"FU"}).populate('fuId').populate('itemId').populate('replenishmentRequestFU');
    globalVariable.io.emit("get_data", send)
    res.status(200).json({ success: true, data:irr });
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
         await FUInventory.findOneAndUpdate({itemId: req.body.itemId,fuId:req.body.fuId}, { $set: { qty: fu.qty-req.body.returnedQty }},{new:true})
         await ReplenishmentRequest.findOneAndUpdate({_id:req.body.replenishmentRequestFU,'items.itemId':req.body.itemId},{ $set: { 'items.$.secondStatus': "Returned", 'items.$.status':"Returned"}})
         await ReturnedQty.create({
            fuiId:fu._id,
            whiId:wh._id,
            itemId:req.body.itemId,
            returnedQty:req.body.returnedQty,
         })
         }
    }
    internalReturn = await InternalReturnRequest.findOneAndUpdate({_id: _id}, req.body,{new:true});
    res.status(200).json({ success: true, data: internalReturn });
});