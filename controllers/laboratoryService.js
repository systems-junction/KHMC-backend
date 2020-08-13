const { v4: uuidv4 } = require('uuid');
const notification = require('../components/notification')
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const LaboratoryService = require('../models/laboratoryService');

exports.getLaboratoryService = asyncHandler(async (req, res) => {
  const laboratoryService = await LaboratoryService.find()
  res.status(200).json({ success: true, data: laboratoryService });
});

exports.addLaboratoryService = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    price,
    status,
  } = req.body;
  const laboratoryService = await LaboratoryService.create({
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
  res.status(200).json({ success: true, data: laboratoryService });
});

exports.deleteLaboratoryService = asyncHandler(async (req, res, next) => {
  const { _id } = req.params;
  const laboratoryService = await LaboratoryService.findById(_id);
  if (!laboratoryService) {
    return next(
      new ErrorResponse(`Laboratory Service not found with id of ${_id}`, 404)
    );
  }
  await LaboratoryService.deleteOne({ _id: _id });
  res.status(200).json({ success: true, data: {} });
});

exports.updateLaboratoryService = asyncHandler(async (req, res, next) => {
  const { _id } = req.body;
  let laboratoryService = await LaboratoryService.findById(_id);
  if (!laboratoryService) {
    return next(
      new ErrorResponse(`Laboratory Service not found with id of ${_id}`, 404)
    );
  }
  laboratoryService = await LaboratoryService.findOneAndUpdate({ _id: _id }, req.body,{new: true});
  res.status(200).json({ success: true, data: laboratoryService });
});

exports.getSearchedLabs = asyncHandler(async (req, res) => {
  const laboratoryService = await LaboratoryService.find({
    $or: [{ name: {$regex: req.params.keyword, $options: 'i'} }, { serviceNo: {$regex: req.params.keyword, $options: 'i'} }],
  });
  res.status(200).json({ success: true, data: laboratoryService });
});