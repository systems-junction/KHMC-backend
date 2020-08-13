/* eslint-disable prefer-const */
const notification = require ('../components/notification')
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { v4: uuidv4 } = require('uuid');
const ReplenishmentRequestBU = require('../models/replenishmentRequestBU');
const FunctionalUnit = require('../models/functionalUnit');
const FUInventory = require('../models/fuInventory');
const BUInventory = require('../models/buInventory');
const WHInventory = require('../models/warehouseInventory');
const ReplenishmentRequest = require('../models/replenishmentRequest');
const PurchaseRequest = require('../models/purchaseRequest');
const Item = require('../models/item');
var st;
var st2;    

exports.getReplenishmentRequestsBU = asyncHandler(async (req, res) => {
    const replenishmentRequest = await ReplenishmentRequestBU.find().populate('buId').populate('fuId').populate('item.itemId');    
    res.status(200).json({ success: true, data: replenishmentRequest });
});

exports.getReplenishmentRequestsBUM = asyncHandler(async (req, res) => {
  const replenishmentRequest = await ReplenishmentRequestBU.find({orderFor:"Medical"}).populate('buId').populate('fuId').populate('item.itemId');    
  res.status(200).json({ success: true, data: replenishmentRequest });
});

exports.getReplenishmentRequestsBUNM = asyncHandler(async (req, res) => {
  const replenishmentRequest = await ReplenishmentRequestBU.find({orderFor:"Non Medical"}).populate('buId').populate('fuId').populate('item.itemId');    
  res.status(200).json({ success: true, data: replenishmentRequest });
});

exports.getReplenishmentRequestsByIdBU = asyncHandler(async (req, res) => {
    const replenishmentRequest = await ReplenishmentRequestBU.findOne({_id:req.body._id}).populate('buId').populate('fuId').populate('itemId');
    res.status(200).json({ success: true, data: replenishmentRequest });
});

exports.addReplenishmentRequestBU = asyncHandler(async (req, res) => {
    const { generated,generatedBy,dateGenerated,buId,comments,item,currentQty,requestedQty,orderFor,
           description,patientReferenceNo, requesterName, department, orderType,orderBy, reason} = req.body;
          //  status,secondStatus
           const func = await FunctionalUnit.findOne({_id:req.body.fuId})
           for(let i=0; i<req.body.item.length; i++)
           {
           const fui = await FUInventory.findOne({itemId: req.body.item[i].itemId,fuId:func._id}).populate('itemId')
           if(fui.qty<parseInt(req.body.item[i].requestedQty))
            {
            req.body.item[i].secondStatus = "Cannot be fulfilled"
            }
            else
            {
                req.body.item[i].secondStatus = "Can be fulfilled"
            }
          }
    const rrBU = await ReplenishmentRequestBU.create({
        requestNo: uuidv4(),
        generated,
        generatedBy,
        dateGenerated,        
        fuId:func._id,
        buId,
        comments,
        orderType,
        item,
        currentQty,
        requestedQty,
        description,
        // status,
        requesterName,
        orderFor,
        orderBy,
        department,
        reason,
        patientReferenceNo,
        // secondStatus,
        // secondStatus:req.body.secondStatus,
    });
    notification("Professional Order", "A new Professional Order has been generated at "+rrBU.createdAt, "Committe Member")
    const send = await ReplenishmentRequestBU.find().populate('buId').populate('fuId').populate('item.itemId');
    globalVariable.io.emit("get_data", send)
    for(let i=0; i<req.body.item.length; i++)
    {
    if(req.body.item[i].secondStatus == "Cannot be fulfilled")
    {
      const fu2 = await FUInventory.findOne({itemId: req.body.item[i].itemId,fuId:func._id}).populate('itemId')
      const wh = await WHInventory.findOne({itemId:req.body.item[i].itemId}).populate('itemId')
      const item = await Item.findOne({_id:req.body.item[i].itemId})
      if(wh.qty<(parseInt(req.body.item[i].requestedQty) + (fu2.qty-fu2.maximumLevel)))
      {
      st = "pending"
      st2 = "Cannot be fulfilled"
      }
      else
      {
      st = "pending"
      st2 = "Can be fulfilled"
      }
      notification("Replenishment Request", "A new replenishment request has been generated by System at "+rrBU.createdAt, "Warehouse Member")
      notification("Replenishment Request", "A new replenishment request has been generated by System at "+rrBU.createdAt, "FU Member")
      const rrS = await ReplenishmentRequest.create({
        requestNo: uuidv4(),
        generated:'System',
        generatedBy:'System',
        reason:'reactivated_items',
        fuId:req.body.fuId,
        itemId:req.body.item[i].itemId,
        comments:'System generated Replenishment Request',
        currentQty:fu2.qty,
        requestedQty:fu2.maximumLevel-fu2.qty,
        description:item.description,
        status: st,
        secondStatus:st2,
        requesterName:'System',
        orderType:'',
        to:'Warehouse',
        from:'FU',
        recieptUnit:item.receiptUnit,
        issueUnit:item.issueUnit,
        fuItemCost:0,
        department:'',
        rrB:rrBU._id
      });
//here   
const send = await ReplenishmentRequest.find().populate('fuId').populate('itemId').populate('approvedBy');
globalVariable.io.emit("get_data", send)   
    }}
    res.status(200).json({ success: true });
});

exports.deleteReplenishmentRequestBU = asyncHandler(async (req, res, next) => {
    const { _id } = req.params;
    const replenishmentRequest = await ReplenishmentRequestBU.findById(_id);
    if(!replenishmentRequest) {
        return next(
        new ErrorResponse(`Replenishment Request not found with id of ${_id}`, 404)
        );
    }
    await ReplenishmentRequest.deleteOne({_id: _id});
    res.status(200).json({ success: true, data: {} });
});
exports.updateReplenishmentRequestBU = asyncHandler(async (req, res, next) => {
    const { _id } = req.body;
    let replenishmentRequest = await ReplenishmentRequestBU.findById(_id);
    if(!replenishmentRequest) {
        return next(
        new ErrorResponse(`Replenishment Request not found with id of ${_id}`, 404)
        );
    }

    replenishmentRequest = await ReplenishmentRequestBU.findOneAndUpdate({_id: _id}, req.body,{new:true});
    for (let i = 0; i<req.body.item.length; i++)
    {
      if(req.body.item[i].status == "in_progress")     
      {
        notification("Professional Order", "Professional Order "+replenishmentRequest.requestNo+" item has been updated to In Progress by the Inventory Keeper at "+replenishmentRequest.updatedAt, "BU Member") 
      }
      else if (req.body.item[i].status == "Delivery in Progress")
      {
        notification("Professional Order", "Professional Order "+replenishmentRequest.requestNo+" item has been updated to Delivery In Progress by the Inventory Keeper at "+replenishmentRequest.updatedAt, "BU Member") 
      }
    }


    res.status(200).json({ success: true, data: replenishmentRequest });
});
  exports.getCurrentItemQuantityBU = asyncHandler(async (req, res) => {
    const buInventory = await BUInventory.findOne(
      { itemId: req.body.itemId,buId:req.body.buId },
      { qty: 1 }
    );
    res.status(200).json({ success: true, data: buInventory });
  });


//here2
//   if(st2 == "Cannot be fulfilled")
//   {
// var item2={
// itemId:req.body.itemId,
// currQty:wh.qty,
// reqQty:wh.maximumLevel - (fui.maximumLevel-fui.qty),
// comments:'System',
// name:item.name,
// description:item.description,
// itemCode:item.itemCode
// }
// await PurchaseRequest.create({
//     requestNo: uuidv4(),
//     generated:'System',
//     generatedBy:'System',
//     committeeStatus: 'to_do',
//     status:'to_do',
//     comments:'System',
//     reason:'reactivated_items',
//     item:item2,
//     vendorId:item.vendorId,
//     requesterName:'System',
//     department:'',
//     orderType:'',
//     rr:rrS._id
//   });
//   }
