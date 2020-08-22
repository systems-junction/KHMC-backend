const { v4: uuidv4 } = require('uuid');
const notification = require('../components/notification')
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const SurgeryService = require('../models/surgeryService');

exports.getSurgeryService = asyncHandler(async (req, res) => {
  const surgeryService = await SurgeryService.find()
  res.status(200).json({ success: true, data: surgeryService });
});

exports.addSurgeryService = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    price,
    status,
  } = req.body;
  const surgeryService = await SurgeryService.create({
    serviceNo:uuidv4(),
    name,
    description,
    price,
    status,
  });
//   notification("Purchase Order", "A new Purchase Order "+purchaseOrder.purchaseOrderNo +" has been generated at "+purchaseOrder.createdAt, "admin")
//   const po = await PurchaseOrder.find()
//   .populate('vendorId')
//   .populate('purchaseRequestId');
//   globalVariable.io.emit("get_data", po)
  res.status(200).json({ success: true, data: surgeryService });
});

exports.deleteSurgeryService = asyncHandler(async (req, res, next) => {
  const { _id } = req.params;
  const surgeryService = await SurgeryService.findById(_id);
  if (!surgeryService) {
    return next(
      new ErrorResponse(`Surgery Service not found with id of ${_id}`, 404)
    );
  }
  await SurgeryService.deleteOne({ _id: _id });
  res.status(200).json({ success: true, data: {} });
});

exports.updateSurgeryService = asyncHandler(async (req, res, next) => {
  const { _id } = req.body;
  let surgeryService = await SurgeryService.findById(_id);
  if (!surgeryService) {
    return next(
      new ErrorResponse(`Surgery Service not found with id of ${_id}`, 404)
    );
  }
  surgeryService = await SurgeryService.findOneAndUpdate({ _id: _id }, req.body,{new: true});
  res.status(200).json({ success: true, data: surgeryService });
});

exports.getSearchedSurgery = asyncHandler(async (req, res) => {
  const surgeryService = await SurgeryService.find({
    $or: [{ name: {$regex: req.params.keyword, $options: 'i'} }, { serviceNo: {$regex: req.params.keyword, $options: 'i'} }],
  });
  res.status(200).json({ success: true, data: surgeryService });
});