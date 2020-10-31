const { v4: uuidv4 } = require('uuid');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const BuStockOutLog = require('../models/buStockOutLog');
const Items = require('../models/item');
const BusinessUnit = require('../models/businessUnit');
const Staff = require('../models/staff');

exports.getBuStockOutLog = asyncHandler(async (req, res) => {
    const buStockOutLog = await BuStockOutLog.find().populate('buId').populate('itemId').populate('staffId');
    const items = await Items.find();
    const businessUnit = await BusinessUnit.find();
    const staff = await Staff.find();
    const data = {
      buStockOutLog,
      items,
      businessUnit,
      staff
    }
    res.status(200).json({ success: true, data: data });
});

exports.addBuStockOutLog = asyncHandler(async (req, res) => {
    const { itemId, qty, buId, timeStamp, visitId, staffId, salePrice } = req.body;
    const buStockOutLog = await BuStockOutLog.create({
        uuid: uuidv4(),
        itemId,
        qty,
        buId,
        timeStamp,
        visitId,
        staffId,
        salePrice
    });

    res.status(200).json({ success: true, data: buStockOutLog });
});

exports.deleteBuStockOutLog = asyncHandler(async (req, res, next) => {
    const { _id } = req.params;
    const buStockOutLog = await BuStockOutLog.findById(_id);

    if(!buStockOutLog) {
      return next(
        new ErrorResponse(`Bu stock out log not found with id of ${_id}`, 404)
      );
    }

    await BuStockOutLog.deleteOne({_id: _id});

    res.status(200).json({ success: true, data: {} });

});

exports.updateBuStockOutLog = asyncHandler(async (req, res, next) => {
    const { _id } = req.body;

    let buStockOutLog = await BuStockOutLog.findById(_id);

    if(!buStockOutLog) {
      return next(
        new ErrorResponse(`Bu stock out log not found with id of ${_id}`, 404)
      );
    }

    buStockOutLog = await BuStockOutLog.updateOne({_id: _id}, req.body);

    res.status(200).json({ success: true, data: buStockOutLog });
});