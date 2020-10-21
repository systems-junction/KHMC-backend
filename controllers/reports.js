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
    const fui = await FUInventory.find({updatedAt:{$gte: startDate, $lte: endDate}}).populate('itemId', 'name itemCode').populate('fuId','fuName')
    res.status(200).json({ success: true, data: fui });
});

exports.supplierFulfillmentPO = asyncHandler(async (req, res) => {
    var startDate = moment(req.body.startDate).startOf('day').utc().toDate();
    var endDate = moment(req.body.endDate).startOf('day').utc().toDate();
    const po = await PurchaseOrder.find({status:"complete",updatedAt:{$gte: startDate, $lte: endDate}})
    res.status(200).json({ success: true, data: po });
});