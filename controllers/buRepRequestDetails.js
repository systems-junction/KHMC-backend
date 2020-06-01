const { v4: uuidv4 } = require('uuid');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const BuRepRequestDetails = require('../models/buRepRequestDetails');
const Items = require('../models/item');
const BuRepRequest = require('../models/buRepRequest');

exports.getBuRepRequestDetails = asyncHandler(async (req, res) => {
    const buRepRequestDetails = await BuRepRequestDetails.find().populate('itemId').populate('buRepRequestId');
    const items = await Items.find();
    const buRepRequest = await BuRepRequest.find();
    const data ={
      buRepRequestDetails,
      items,
      buRepRequest
    }
    res.status(200).json({ success: true, data: data });
});

exports.addBuRepRequestDetails = asyncHandler(async (req, res) => {
    const { buRepRequestId, itemId, qty, status } = req.body;
    const buRepRequestDetails = await BuRepRequestDetails.create({
        uuid: uuidv4(),
        buRepRequestId,
        itemId,
        qty,
        status
    });

    res.status(200).json({ success: true, data: buRepRequestDetails });
});

exports.deleteBuRepRequestDetails = asyncHandler(async (req, res, next) => {
    const { _id } = req.params;
    const buRepRequestDetails = await BuRepRequestDetails.findById(_id);

    if(!buRepRequestDetails) {
      return next(
        new ErrorResponse(`Bu rep request details not found with id of ${_id}`, 404)
      );
    }

    await BuRepRequestDetails.deleteOne({_id: _id});

    res.status(200).json({ success: true, data: {} });

});

exports.updateBuRepRequestDetails = asyncHandler(async (req, res, next) => {
    const { _id } = req.body;

    let buRepRequestDetails = await BuRepRequestDetails.findById(_id);

    if(!buRepRequestDetails) {
      return next(
        new ErrorResponse(`Bu rep request details not found with id of ${_id}`, 404)
      );
    }

    buRepRequestDetails = await BuRepRequestDetails.updateOne({_id: _id}, req.body);

    res.status(200).json({ success: true, data: buRepRequestDetails });
});