const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { v4: uuidv4 } = require('uuid');
const OPR = require('../models/OPR');
const requestNoFormat = require('dateformat');

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
    requestNo: 'OPR' + requestNoFormat(new Date(), 'mmddyyHHmm'),
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

exports.getLROPRById = asyncHandler(async (req, res) => {
  const edr = await OPR.findOne({ 'labRequest._id': req.params._id })
    .populate('labRequest.requester')
    .populate('labRequest.serviceId')
    .select({ labRequest: 1 });
  for (let i = 0; i < edr.labRequest.length; i++) {
    if (edr.labRequest[i]._id == req.params._id) {
      var lab = edr.labRequest[i];
    }
  }
  res.status(200).json({ success: true, data: lab });
});

exports.getRROPRById = asyncHandler(async (req, res) => {
  const edr = await OPR.findOne({ 'radiologyRequest._id': req.params._id })
    .populate('radiologyRequest.requester')
    .populate('radiologyRequest.serviceId')
    .select({ radiologyRequest: 1 });
  for (let i = 0; i < edr.radiologyRequest.length; i++) {
    if (edr.radiologyRequest[i]._id == req.params._id) {
      var lab = edr.radiologyRequest[i];
    }
  }
  res.status(200).json({ success: true, data: lab });
});

exports.putLROPRById = asyncHandler(async (req, res) => {
  var data = JSON.parse(req.body.data);
  if (req.file) {
    await OPR.findOneAndUpdate(
      { 'labRequest._id': data.labRequestId, _id: data.OPRId },
      data
    );
    await OPR.findOneAndUpdate(
      { 'labRequest._id': data.labRequestId, _id: data.OPRId },
      { $set: { 'labRequest.$.results': req.file.path,'labRequest.$.sampleId':req.body.sampleId   } },
      { new: true }
    );
  } else {
    await OPR.findOneAndUpdate(
      { 'labRequest._id': data.labRequestId, _id: data.OPRId },
      { $set: { 'labRequest.$.status': data.status, 'labRequest.$.sampleId':req.body.sampleId   } },
      { new: true }
    );
  }
  res.status(200).json({ success: true });
});

exports.putRROPRById = asyncHandler(async (req, res) => {
  var data = JSON.parse(req.body.data);
  console.log('data', data);
  if (req.file) {
    await OPR.findOneAndUpdate(
      { 'radiologyRequest._id': data.radiologyRequestId, _id: data.OPRId },
      data
    );
    await OPR.findOneAndUpdate(
      { 'radiologyRequest._id': data.radiologyRequestId, _id: data.OPRId },
      { $set: { 'radiologyRequest.$.results': req.file.path } },
      { new: true }
    );
  } else {
    // await OPR.findOneAndUpdate(
    //   { 'radiologyRequest._id': data.radiologyRequestId, _id: data.OPRId },
    //   data
    // );
    await OPR.findOneAndUpdate(
      { 'radiologyRequest._id': data.radiologyRequestId, _id: data.OPRId },
      { $set: { 'radiologyRequest.$.status': data.status } },
      { new: true }
    );
  }
  res.status(200).json({ success: true });
});
