const asyncHandler = require('../middleware/async');
const PurchaseOrder = require('../models/purchaseOrder')
const WHInventory = require('../models/warehouseInventory')
const FUInventory = require('../models/fuInventory')
var moment = require('moment');

exports.trackingPO = asyncHandler(async (req, res) => {
    var startDate = moment(req.body.startDate).startOf('day').utc().toDate();
    var endDate = moment(req.body.endDate).endOf('day').utc().toDate();
    const po = await PurchaseOrder.find({'committeeStatus':req.params.status,createdAt:{$gte: startDate, $lte: endDate}}).populate('vendorId').populate('approvedBy')
    res.status(200).json({ success: true, data: po });
});

exports.trackingPOCount = asyncHandler(async (req, res) => {
    var startDate = moment(req.body.startDate).startOf('day').utc().toDate();
    var endDate = moment(req.body.endDate).endOf('day').utc().toDate();
    const po = await PurchaseOrder.find({'committeeStatus':req.params.status,createdAt:{$gte: startDate, $lte: endDate}}).count();
    res.status(200).json({ success: true, data: po });
});

exports.stockLevelsWH = asyncHandler(async (req, res) => {
    var startDate = moment(req.body.startDate).startOf('day').utc().toDate();
    var endDate = moment(req.body.endDate).startOf('day').utc().toDate();
    const whi = await WHInventory.find({updatedAt:{$gte: startDate, $lte: endDate}}).populate('itemId', 'name itemCode')
    res.status(200).json({ success: true, data: whi });
});

exports.stockLevelsFU = asyncHandler(async (req, res) => {
    var startDate = moment(req.body.startDate).startOf('day').utc().toDate();
    var endDate = moment(req.body.endDate).startOf('day').utc().toDate();
    const fui = await FUInventory.find({fuId:req.params.id,updatedAt:{$gte: startDate, $lte: endDate}}).populate('itemId', 'name itemCode').populate('fuId','fuName')
    res.status(200).json({ success: true, data: fui });
});

exports.supplierFulfillmentPO = asyncHandler(async (req, res) => {
    var startDate = moment(req.body.startDate).startOf('day').utc().toDate();
    var endDate = moment(req.body.endDate).startOf('day').utc().toDate();
    const po = await PurchaseOrder.find({status:"complete",updatedAt:{$gte: startDate, $lte: endDate}}).populate('vendorId')
    res.status(200).json({ success: true, data: po });
});

exports.expiredItemsWH = asyncHandler(async (req, res) => {
    var todayDate = moment().utc().toDate();
    const whi = await WHInventory.aggregate([
        {$lookup:{from:'items',localField:'itemId',foreignField:'_id',as:'itemId'}},
        {$unwind:'$itemId'},
        {$unwind:'$batchArray'},
        {$match:{'batchArray.expiryDate':{$lte: todayDate}}},
        {$project:{_id:1, itemId: 1,batchArray:1}}
    ])
    res.status(200).json({ success: true, data: whi });
});

exports.expiredItemsFU = asyncHandler(async (req, res) => {
    var todayDate = moment().utc().toDate();
    const fui = await FUInventory.aggregate([
        {$match:{fuId:req.params.id}},
        {$lookup:{from:'items',localField:'itemId',foreignField:'_id',as:'itemId'}},
        {$unwind:'$itemId'},
        {$unwind:'$batchArray'},
        {$match:{'batchArray.expiryDate':{$lte: todayDate}}},
        {$project:{_id:1, itemId: 1,batchArray:1}}
    ])
    res.status(200).json({ success: true, data: fui });
});

exports.nearlyExpiredItemsWH = asyncHandler(async (req, res) => {
    var selectedDate = moment(req.body.selectedDate).utc().toDate();
    const whi = await WHInventory.aggregate([
        {$lookup:{from:'items',localField:'itemId',foreignField:'_id',as:'itemId'}},
        {$unwind:'$itemId'},
        {$unwind:'$batchArray'},
        {$match:{'batchArray.expiryDate':{$lte: selectedDate}}},
        {$project:{_id:1, itemId: 1,batchArray:1}}
    ])
    res.status(200).json({ success: true, data: whi });
});
exports.nearlyExpiredItemsFU = asyncHandler(async (req, res) => {
    var selectedDate = moment(req.body.selectedDate).utc().toDate();
    const fui = await FUInventory.aggregate([
        {$match:{fuId:req.params.id}},
        {$lookup:{from:'items',localField:'itemId',foreignField:'_id',as:'itemId'}},
        {$unwind:'$itemId'},
        {$unwind:'$batchArray'},
        {$match:{'batchArray.expiryDate':{$lte: selectedDate}}},
        {$project:{_id:1, itemId: 1,batchArray:1}}
    ])
    res.status(200).json({ success: true, data: fui });
});