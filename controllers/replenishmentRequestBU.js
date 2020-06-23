/* eslint-disable prefer-const */
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { v4: uuidv4 } = require('uuid');
const ReplenishmentRequestBU = require('../models/replenishmentRequestBU');
const WHInventory = require('../models/warehouseInventory');
const FunctionalUnit = require('../models/functionalUnit');
const FUInventory = require('../models/fuInventory');
const BUInventory = require('../models/buInventory');
const PurchaseRequest = require('../models/purchaseRequest');
const Item = require('../models/item');
exports.getReplenishmentRequestsBU = asyncHandler(async (req, res) => {
    const replenishmentRequest = await ReplenishmentRequestBU.find().populate('buId').populate('fuId').populate('itemId');    
    res.status(200).json({ success: true, data: replenishmentRequest });
});
exports.getReplenishmentRequestsByIdBU = asyncHandler(async (req, res) => {
    const replenishmentRequest = await ReplenishmentRequestBU.findOne({_id:_id}).populate('buId').populate('fuId').populate('itemId');
    res.status(200).json({ success: true, data: replenishmentRequest });
});
exports.addReplenishmentRequestBU = asyncHandler(async (req, res) => {
    const { generated,generatedBy,dateGenerated,buId,comments,itemId,currentQty,requestedQty,
           description,status,secondStatus} = req.body;
            // const bu = await FunctionalUnit.findOne({buId:req.body.buId})//wrong logic change when more data
            // const fu = await FUInventory.findOne({itemId: req.body.itemId,fuId:bu._id})
            // if(fu.qty<req.body.requestedQty)
            // {
            //     req.body.secondStatus = "Cannot be fulfilled"
            //     const i =await Item.findOne({_id:req.body.itemId}) 
            //     var item={
            //         itemId:req.body.itemId,
            //         currQty:0,
            //         reqQty:100,
            //         comments:'System',
            //         name:i.name,
            //         description:i.description,
            //         itemCode:i.itemCode
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
            //             vendorId:i.vendorId,
            //             requesterName:'System',
            //             department:'System',
            //             orderType:'System',
            //           });                           
            // }
            // else
            // {
            //     req.body.secondStatus = "Can be fulfilled"
            // }
    await ReplenishmentRequestBU.create({
        requestNo: uuidv4(),
        generated,
        generatedBy,
        dateGenerated,        
        fuId:bu._id,
        buId,
        comments,
        itemId,
        currentQty,
        requestedQty,
        description,
        status,
        secondStatus,
        // secondStatus:req.body.secondStatus,
    });
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
    if(req.body.status=="Completed")
    {
        const bui = await FunctionalUnit.findOne({buId:req.body.buId})//wrong logic change when more data
        const fui = await FUInventory.findOne({itemId: req.body.itemId,fuId:bui._id})
        const bu = await BUInventory.findOne({itemId: req.body.itemId,buId:req.body.buId})
        const fu = await FUInventory.findOne({itemId: req.body.itemId,_id:fui._id})
        await BUInventory.findOneAndUpdate({itemId: req.body.itemId,buId:req.body.buId}, { $set: { qty: bu.qty+req.body.requestedQty }},{new:true})
        const pr = await FUInventory.findOneAndUpdate({itemId: itemId}, { $set: { qty: fu.qty-req.body.requestedQty }},{new:true}).populate('itemId')   
    }
    replenishmentRequest = await ReplenishmentRequestBU.findOneAndUpdate({_id: _id}, req.body,{new:true});
    res.status(200).json({ success: true, data: replenishmentRequest });
});
  exports.getCurrentItemQuantityBU = asyncHandler(async (req, res) => {
    const buInventory = await BUInventory.findOne(
      { itemId: req.body.itemId,buId:req.body.buId,fuId:req.body.fuId },
      { qty: 1 }
    );
    res.status(200).json({ success: true, data: buInventory });
  });