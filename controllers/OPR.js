const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { v4: uuidv4 } = require('uuid');
const OPR = require('../models/OPR');

exports.getOPRAll = asyncHandler(async (req, res) => {
  const opr = await OPR.find()
    .populate('patientId')
    .populate('pharmacyRequest.requester')
    .populate('pharmacyRequest.medicine.itemId')
    .populate('labRequest.requester')
    .populate('labRequest.serviceId')
    .populate('radiologyRequest.serviceId')
    .populate('radiologyRequest.requester');
  res.status(200).json({ success: true, data: opr });
});

exports.getOPRFromLab = asyncHandler(async (req, res) => {
  const opr = await OPR.find({ generatedFrom: 'labRequest' })
    .populate('patientId')
    .populate('labRequest.requester')
    .populate('labRequest.serviceId')
    .select({ labRequest: 1, requestNo: 1, status: 1 });
  res.status(200).json({ success: true, data: opr });
});

exports.getOPRFromPharmacy = asyncHandler(async (req, res) => {
  const opr = await OPR.find({ generatedFrom: 'pharmacyRequest' })
    .populate('patientId')
    .populate('pharmacyRequest.requester')
    .populate('pharmacyRequest.medicine.itemId')
    .select({ pharmacyRequest: 1, requestNo: 1, status: 1 });
  res.status(200).json({ success: true, data: opr });
});

exports.getOPRFromRadiology = asyncHandler(async (req, res) => {
  const opr = await OPR.find({ generatedFrom: 'radiologyRequest' })
    .populate('patientId')
    .populate('radiologyRequest.serviceId')
    .populate('radiologyRequest.requester')
    .select({ radiologyRequest: 1, requestNo: 1, status: 1 });
  res.status(200).json({ success: true, data: opr });
});

exports.getOPRById = asyncHandler(async (req, res) => {
  const opr = await OPR.find({ _id: req.params._id })
    .populate('patientId')
    .populate('pharmacyRequest.requester')
    .populate('pharmacyRequest.medicine.itemId')
    .populate('labRequest.requester')
    .populate('labRequest.serviceId')
    .populate('radiologyRequest.serviceId')
    .populate('radiologyRequest.requester');
  res.status(200).json({ success: true, data: opr });
});

exports.addOPR = asyncHandler(async (req, res) => {
  const {
    patientId,
    generatedBy,
    pharmacyRequest,
    labRequest,
    radiologyRequest,
    status,
    generatedFrom,
  } = req.body;
  const opr = await OPR.create({
    requestNo: uuidv4(),
    patientId,
    generatedBy,
    pharmacyRequest,
    labRequest,
    radiologyRequest,
    status,
    generatedFrom,
  });
  res.status(200).json({ success: true, data: opr });
});

exports.deleteOPR = asyncHandler(async (req, res, next) => {
  const { _id } = req.params;
  const opr = await OPR.findById(_id);
  if (!opr) {
    return next(new ErrorResponse(`OPR not found with id of ${_id}`, 404));
  }
  await OPR.deleteOne({ _id: _id });
});

exports.updateOPR = asyncHandler(async (req, res, next) => {
  const { _id } = req.body;
  let opr = await OPR.findById(_id);
  if (!opr) {
    return next(new ErrorResponse(`OPR not found with id of ${_id}`, 404));
  }
  opr = await OPR.updateOne({ _id: _id }, req.body);
  res.status(200).json({ success: true, data: opr });
});
