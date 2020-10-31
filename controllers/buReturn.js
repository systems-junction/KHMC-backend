const { v4: uuidv4 } = require('uuid');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const BuReturn = require('../models/buReturn');
const Items = require('../models/item');
const Staff = require('../models/staff');
const BusinessUnit = require('../models/businessUnit');

exports.getBuReturn = asyncHandler(async (req, res) => {
    const buReturn = await BuReturn.find().populate("itemId").populate("staffId").populate("buId");
    const items = await Items.find();
    const staff = await Staff.find();
    const businessUnit = await BusinessUnit.find();
    const data = {
      buReturn,
      items,
      staff,
      businessUnit
    }
    res.status(200).json({ success: true, data: data });
});

exports.addBuReturn = asyncHandler(async (req, res) => {
    const { buId, itemId, qty, timeStamp, returnReason, batchNo, staffId } = req.body;
    const buReturn = await BuReturn.create({
        uuid: uuidv4(),
        buId,
        itemId,
        qty,
        timeStamp,
        returnReason,
        batchNo,
        staffId
    });

    res.status(200).json({ success: true, data: buReturn });
});

exports.deleteBuReturn = asyncHandler(async (req, res, next) => {
    const { _id } = req.params;
    const buReturn = await BuReturn.findById(_id);

    if(!buReturn) {
      return next(
        new ErrorResponse(`Bu return not found with id of ${_id}`, 404)
      );
    }

    await BuReturn.deleteOne({_id: _id});

    res.status(200).json({ success: true, data: {} });

});

exports.updateBuReturn = asyncHandler(async (req, res, next) => {
    const { _id } = req.body;

    let buReturn = await BuReturn.findById(_id);

    if(!buReturn) {
      return next(
        new ErrorResponse(`Bu return not found with id of ${_id}`, 404)
      );
    }

    buReturn = await BuReturn.updateOne({_id: _id}, req.body);

    res.status(200).json({ success: true, data: buReturn });
});