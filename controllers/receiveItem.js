const notification = require('../components/notification')
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { v4: uuidv4 } = require('uuid');
const ExternalReturnRequest = require('../models/externalReturnRequest');
const ReceiveItem = require('../models/receiveItem');
const MaterialReceiving = require('../models/materialReceiving');
const PurchaseRequest = require('../models/purchaseRequest');
const PurchaseOrder = require('../models/purchaseOrder');
const Account = require('../models/account');
const moment = require('moment');
exports.getReceiveItems = asyncHandler(async (req, res) => {
    const receiveItems = await ReceiveItem.find().populate('itemId').populate('prId');

    const data = {
        receiveItems
    }
    
    res.status(200).json({ success: true, data: data });
});

exports.addReceiveItem = asyncHandler(async (req, res) => {
    const { itemId,currentQty, requestedQty, receivedQty, bonusQty, batchNumber,lotNumber,
        expiryDate,unit, discount, unitDiscount, discountAmount, tax, taxAmount, finalUnitPrice, subTotal, 
        discountAmount2,totalPrice, invoice, dateInvoice,dateReceived, notes,materialId,vendorId,prId,status } = req.body;
        var isafter = moment(req.body.dateReceived).isAfter(req.body.expiryDate);
            if (isafter)
            {
               const err =  await ExternalReturnRequest.create({
                    returnRequestNo: uuidv4(),
                    generatedBy:"System",
                    generated:"System",
                    dateGenerated:req.body.dateReceived,
                    expiryDate:req.body.expiryDate,
                    itemId:req.body.itemId,
                    currentQty:req.body.qty,
                    description:"Date Expired",
                    reason:"Expired",
                    reasonDetail:"Date Expired",
                    status:"approved",
                    prId:req.body.prId
                })
                notification("Item Date Expired ", "A new Return Request "+err.returnRequestNo+" has been generated at "+err.createdAt+" by System", "Warehouse Incharge")
                const send = await ExternalReturnRequest.find().populate('itemId');
                globalVariable.io.emit("get_data", send)
            }   
            if(!isafter){
                if(req.body.receivedQty>req.body.requestedQty)
                {
                var qty=req.body.receivedQty-req.body.requestedQty;    
                await ReceiveItem.create({
                    itemId,
                    currentQty,
                    requestedQty,
                    receivedQty:req.body.requestedQty,
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
                    notes,prId,status
                });
                await ExternalReturnRequest.create({
                    returnRequestNo: uuidv4(),
                    generatedBy:"System",
                    generated:"System",
                    dateGenerated:req.body.dateReceived,
                    expiryDate:req.body.expiryDate,
                    itemId:req.body.itemId,
                    currentQty:qty,
                    description:"Extra quantity",
                    reason:"Extra quantity",
                    reasonDetail:"Extra quantity arrived than requested",
                    status:"approved",
                    prId:req.body.prId
                })
                notification("Extra Quantity Returned", "A new Return Request "+err.returnRequestNo+" has been generated at "+err.createdAt+" by System", "Warehouse Incharge")
                const send = await ExternalReturnRequest.find().populate('itemId');
                globalVariable.io.emit("get_data", send)
                }
                else{
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
                        notes,prId,status
                    });
                }  
            }    
    const prapp =  await PurchaseRequest.findOneAndUpdate({'_id': prId, 'item.itemId': itemId},{ $set: { 'item.$.status': status }},{new: true});
    var count1 = 0;
    for(let i = 0 ; i<prapp.item.length; i++)
    {
        if(prapp.item[i].status=="received"||prapp.item[i].status=="rejected")
        {
            count1++;       
        }
    }
    if(count1 === prapp.item.length)
    {
    await PurchaseRequest.findOneAndUpdate({'_id': prId},{ $set: { status: "pending_approval_from_accounts" }},{new: true});   
    const mat = await MaterialReceiving.findOneAndUpdate({'_id': materialId,'prId.id':prId},{ $set: { 'prId.$.status': req.body.status }},{new: true});
    const poNum = await PurchaseOrder.findOne({_id:mat.poId});
    var count2 = 0;
    for(let i = 0; i<mat.prId.length; i++)
    {
        if(mat.prId[i].status=="received"||mat.prId[i].status=="rejected"){
            count2++;
        }
    }
    if(count2 == mat.prId.length)
    {
        const acc = await Account.create({
            mrId:materialId,
            status:"pending_approval_from_accounts",
            vendorId:vendorId
        })
        notification("Account Approval Needed", "Purchase Order "+poNum.purchaseOrderNo+" has been received by the Inventory Keeper at "+acc.createdAt+" pending approval", "Accounts Member")
        const ac = await Account.find().populate({
        path : 'mrId',
        populate: [{
            path : 'poId',
            populate : {
                path : 'purchaseRequestId',
                populate:{
                path : 'item.itemId'
                }
                }}]
        }).populate('vendorId');
        globalVariable.io.emit("get_data", ac)
    }    
}
    else if(count1 !== prapp.item.length)
    {
        await PurchaseRequest.findOneAndUpdate({'_id': prId},{ $set: { status: "partially_complete" }},{new: true});   
    }
        res.status(200).json({ success: true});
});


// exports.addReceiveItem = asyncHandler(async (req, res) => {
//     const { itemId,currentQty, requestedQty, receivedQty, bonusQty, batchNumber,lotNumber,
//         expiryDate,unit, discount, unitDiscount, discountAmount, tax, taxAmount, finalUnitPrice, subTotal, 
//         discountAmount2,totalPrice, invoice, dateInvoice,dateReceived, notes,materialId,vendorId,prId,status } = req.body;
//           var isafter = moment(req.body.dateReceived).isAfter(req.body.expiryDate);
//             if (isafter)
//             {
//                const err =  await ExternalReturnRequest.create({
//                     returnRequestNo: uuidv4(),
//                     generatedBy:"System",
//                     generated:"System",
//                     dateGenerated:req.body.dateReceived,
//                     expiryDate:req.body.expiryDate,
//                     itemId:req.body.itemId,
//                     currentQty:req.body.qty,
//                     description:"Date Expired",
//                     reason:"Expired",
//                     reasonDetail:"Date Expired",
//                     status:"approved",
//                     prId:req.body.prId
//                 })
//                 notification("Item Date Expired ", "A new Return Request "+err.returnRequestNo+" has been generated at "+err.createdAt+" by System", "Warehouse Incharge")
//                 const send = await ExternalReturnRequest.find().populate('itemId');
//                 globalVariable.io.emit("get_data", send)
//             }
          
    
//     await PurchaseRequest.findOneAndUpdate({'_id': prId},{ $set: { status: 'pending_approval_from_accounts' }},{new: true});
//     const mat = await MaterialReceiving.findOneAndUpdate({'_id': materialId,'prId.id':prId},{ $set: { 'prId.$.status': req.body.status }},{new: true});
//     const poNum = await PurchaseOrder.findOne({_id:mat.poId});
//     var count = 0;
//     for(let i = 0; i<mat.prId.length; i++)
//     {
//         if(mat.prId[i].status=="received"||mat.prId[i].status=="rejected"){
//             count++;
//         }
//     }
//     if(count == mat.prId.length)
//     {
//         const acc = await Account.create({
//             mrId:materialId,
//             status:"pending_approval_from_accounts",
//             vendorId:vendorId
//         })
//         notification("Account Approval Needed", "Purchase Order "+poNum.purchaseOrderNo+" has been received by the Inventory Keeper at "+acc.createdAt+" pending approval", "Accounts Member")
//     }
//     const ac = await Account.find().populate({
//       path : 'mrId',
//        populate: [{
//           path : 'poId',
//           populate : {
//             path : 'purchaseRequestId',
//             populate:{
//               path : 'item.itemId'
//             }
//             }}]
//     }).populate('vendorId');
//     globalVariable.io.emit("get_data", ac)
//         res.status(200).json({ success: true});
// });

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