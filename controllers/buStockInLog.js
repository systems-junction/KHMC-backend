const { v4: uuidv4 } = require('uuid');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const BuStockInLog = require('../models/buStockInLog');
const Items = require('../models/item');
const BuRepRequest = require('../models/buRepRequest');
const Staff = require('../models/staff');

exports.getBuStockInLog = asyncHandler(async (req, res) => {
    const buStockInLog = await BuStockInLog.find().populate('buRepRequestId').populate('itemId').populate('staffId');
    const items = await Items.find();
    const buRepRequest = await BuRepRequest.find();
    const staff = await Staff.find();
    const data = {
      buStockInLog,
      items,
      buRepRequest,
      staff
    }
    res.status(200).json({ success: true, data: data });
});

exports.addBuStockInLog = asyncHandler(async (req, res) => {
    const { buRepRequestId, itemId, qty, buPrice, salePrice, batchNo, expiryDate, timeStamp, staffId } = req.body;
    const buStockInLog = await BuStockInLog.create({
        uuid: uuidv4(),
        buRepRequestId,
        itemId,
        qty,
        buPrice,
        salePrice,
        batchNo,
        expiryDate,
        timeStamp,
        staffId
    });

    res.status(200).json({ success: true, data: buStockInLog });
});

exports.deleteBuStockInLog = asyncHandler(async (req, res, next) => {
    const { _id } = req.params;
    const buStockInLog = await BuStockInLog.findById(_id);

    if(!buStockInLog) {
      return next(
        new ErrorResponse(`Bu stock in log not found with id of ${_id}`, 404)
      );
    }

    await BuStockInLog.deleteOne({_id: _id});

    res.status(200).json({ success: true, data: {} });

});

exports.updateBuStockInLog = asyncHandler(async (req, res, next) => {
    const { _id } = req.body;

    let buStockInLog = await BuStockInLog.findById(_id);

    if(!buStockInLog) {
      return next(
        new ErrorResponse(`Bu stock in log not found with id of ${_id}`, 404)
      );
    }

    buStockInLog = await BuStockInLog.updateOne({_id: _id}, req.body);

    res.status(200).json({ success: true, data: buStockInLog });
});