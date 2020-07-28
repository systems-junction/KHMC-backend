const { v4: uuidv4 } = require('uuid');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const BuInventory = require('../models/buInventory');
const Items = require('../models/item');
const BusinessUnit = require('../models/businessUnit');

exports.getBuInventoryById = asyncHandler(async (req, res) => {
  const buInventory = await BuInventory.find({buId:req.params._id}).populate('itemId').populate('buId');
   res.status(200).json({ success: true, data: buInventory });
});
exports.getBuInventory = asyncHandler(async (req, res) => {
    const buInventory = await BuInventory.find().populate('itemId').populate('buId');
    const items = await Items.find();
    const businessUnit = await BusinessUnit.find();
    const data = {
      buInventory,
      items,
      businessUnit
    }
    res.status(200).json({ success: true, data: data });
});

exports.addBuInventory = asyncHandler(async (req, res) => {
    const { buId, itemId, qty } = req.body;
    const buInventory = await BuInventory.create({
        uuid: uuidv4(),
        buId,
        itemId,
        qty
    });

    res.status(200).json({ success: true, data: buInventory });
});

exports.deleteBuInventory = asyncHandler(async (req, res, next) => {
    const { _id } = req.params;
    const buInventory = await BuInventory.findById(_id);

    if(!buInventory) {
      return next(
        new ErrorResponse(`Bu inventory not found with id of ${_id}`, 404)
      );
    }

    await BuInventory.deleteOne({_id: _id});

    res.status(200).json({ success: true, data: {} });

});

exports.updateBuInventory = asyncHandler(async (req, res, next) => {
    const { _id } = req.body;

    let buInventory = await BuInventory.findById(_id);

    if(!buInventory) {
      return next(
        new ErrorResponse(`Bu inventory not found with id of ${_id}`, 404)
      );
    }

    buInventory = await BuInventory.updateOne({_id: _id}, req.body);

    res.status(200).json({ success: true, data: buInventory });
});