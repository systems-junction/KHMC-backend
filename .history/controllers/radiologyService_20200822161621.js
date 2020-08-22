const { v4: uuidv4 } = require('uuid');
const notification = require('../components/notification');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const RadiologyService = require('../models/radiologyService');
const requestNoFormat = require('dateformat');

exports.getRadiologyService = asyncHandler(async (req, res) => {
  const radiologyService = await RadiologyService.find();
  res.status(200).json({ success: true, data: radiologyService });
});

exports.addRadiologyService = asyncHandler(async (req, res) => {
  const { name, description, price, status } = req.body;
  const radiologyService = await RadiologyService.create({
    serviceNo: 'RS' + requestNoFormat(new Date(), 'mmddyyHHmm'),
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
  res.status(200).json({ success: true, data: radiologyService });
});

exports.deleteRadiologyService = asyncHandler(async (req, res, next) => {
  const { _id } = req.params;
  const radiologyService = await RadiologyService.findById(_id);
  if (!radiologyService) {
    return next(
      new ErrorResponse(`Radiology Service not found with id of ${_id}`, 404)
    );
  }
  await RadiologyService.deleteOne({ _id: _id });
  res.status(200).json({ success: true, data: {} });
});

exports.updateRadiologyService = asyncHandler(async (req, res, next) => {
  const { _id } = req.body;
  let radiologyService = await RadiologyService.findById(_id);
  if (!radiologyService) {
    return next(
      new ErrorResponse(`Radiology Service not found with id of ${_id}`, 404)
    );
  }
  radiologyService = await RadiologyService.findOneAndUpdate(
    { _id: _id },
    req.body,
    { new: true }
  );
  res.status(200).json({ success: true, data: radiologyService });
});

exports.getSearchedRadiology = asyncHandler(async (req, res) => {
  const radiologyService = await RadiologyService.find({
    $or: [
      { name: { $regex: req.params.keyword, $options: 'i' } },
      { serviceNo: { $regex: req.params.keyword, $options: 'i' } },
    ],
  });
  res.status(200).json({ success: true, data: radiologyService });
});
