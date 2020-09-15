const requestNoFormat = require('dateformat');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const FuInventory = require('../models/fuInventory');
const Items = require('../models/item');
const FunctionalUnit = require('../models/functionalUnit');

exports.getFuInventory = asyncHandler(async (req, res) => {
    const fuInventory = await FuInventory.find().populate('itemId').populate('fuId');
    const items = await Items.find();
    const functionalUnit = await FunctionalUnit.find();
    const data = {
      fuInventory,
      items,
      functionalUnit
    }
    res.status(200).json({ success: true, data: data });
});
exports.getFuInventoryByFU = asyncHandler(async (req, res) => {
    const fuInventory = await FuInventory.find({fuId:req.params._id}).populate('itemId').populate('fuId');
    const items = await Items.find();
    const functionalUnit = await FunctionalUnit.find();
    const data = {
      fuInventory,
      items,
      functionalUnit
    }
    res.status(200).json({ success: true, data: data });
});
exports.addFuInventory = asyncHandler(async (req, res) => {
    const { fuId, itemId, qty, maximumLevel, reorderLevel, minimumLevel } = req.body;
    var now = new Date();
    var start = new Date(now.getFullYear(), 0, 0);
    var diff =
      now -
      start +
      (start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000;
    var oneDay = 1000 * 60 * 60 * 24;
    var day = Math.floor(diff / oneDay);
    const fuInventory = await FuInventory.create({
        uuid: "FUI" + day + requestNoFormat(new Date(), 'yyHHMM'),
        fuId,
        itemId,
        qty,
        maximumLevel,
        reorderLevel,
        minimumLevel
    });
    res.status(200).json({ success: true, data: fuInventory });
});

exports.deleteFuInventory = asyncHandler(async (req, res, next) => {
    const { _id } = req.params;
    const fuInventory = await FuInventory.findById(_id);

    if(!fuInventory) {
      return next(
        new ErrorResponse(`Fu inventory not found with id of ${_id}`, 404)
      );
    }

    await FuInventory.deleteOne({_id: _id});

    res.status(200).json({ success: true, data: {} });

});

exports.updateFuInventory = asyncHandler(async (req, res, next) => {
    const { _id } = req.body;

    let fuInventory = await FuInventory.findById(_id);

    if(!fuInventory) {
      return next(
        new ErrorResponse(`Fu inventory not found with id of ${_id}`, 404)
      );
    }

    fuInventory = await FuInventory.updateOne({_id: _id}, req.body);

    res.status(200).json({ success: true, data: fuInventory });
});