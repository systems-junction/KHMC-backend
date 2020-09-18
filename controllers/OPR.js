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
    .select({ labRequest: 1, requestNo: 1, status: 1, createdAt:1 });
  res.status(200).json({ success: true, data: opr });
});

exports.getOPRFromPharmacy = asyncHandler(async (req, res) => {
  const opr = await OPR.find({ generatedFrom: 'pharmacyRequest' })
    .populate('patientId')
    .populate('pharmacyRequest.requester')
    .populate('pharmacyRequest.medicine.itemId')
    .select({ pharmacyRequest: 1, requestNo: 1, status: 1, createdAt:1 });
  res.status(200).json({ success: true, data: opr });
});

exports.getOPRFromRadiology = asyncHandler(async (req, res) => {
  const opr = await OPR.find({ generatedFrom: 'radiologyRequest' })
    .populate('patientId')
    .populate('radiologyRequest.serviceId')
    .populate('radiologyRequest.requester')
    .select({ radiologyRequest: 1, requestNo: 1, status: 1, createdAt:1 });
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
  var now = new Date();
  var start = new Date(now.getFullYear(), 0, 0);
  var diff =
    now -
    start +
    (start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000;
  var oneDay = 1000 * 60 * 60 * 24;
  var day = Math.floor(diff / oneDay);
  const opr = await OPR.create({
    requestNo: 'OPR' + day + requestNoFormat(new Date(), 'yyHHMM'),
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
  opr = await OPR.findOneAndUpdate({ _id: _id }, req.body, { new: true }).populate('patientId');
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

exports.getPHROPRById = asyncHandler(async (req, res) => {
  const ipr = await OPR.findOne({ 'pharmacyRequest._id': req.params._id })
    .populate('pharmacyRequest.requester')
    .populate('pharmacyRequest.medicine.itemId')
    .select({ pharmacyRequest: 1 });
  for (let i = 0; i < ipr.pharmacyRequest.length; i++) {
    if (ipr.pharmacyRequest[i]._id == req.params._id) {
      var lab = ipr.pharmacyRequest[i];
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
  var opr
  if (req.file) {
  //  opr = await OPR.findOneAndUpdate(
  //     { 'labRequest._id': data.labRequestId, _id: data.OPRId },
  //     data
  //   ).populate('patientId');
    opr = await OPR.findOneAndUpdate(
      { 'labRequest._id': data.labRequestId, _id: data.OPRId },
      {
        $set: {
          'labRequest.$.status': data.status,
          'labRequest.$.results': req.file.path,
          'labRequest.$.sampleId': data.sampleId,
        },
      },
      { new: true }
    ).populate('patientId');
  } else {
   opr = await OPR.findOneAndUpdate(
      { 'labRequest._id': data.labRequestId, _id: data.OPRId },
      {
        $set: {
          'labRequest.$.status': data.status,
          'labRequest.$.sampleId': data.sampleId,
        },
      },
      { new: true }
    ).populate('patientId');
  }
  
  res.status(200).json({ success: true, data:opr });
});

exports.putRROPRById = asyncHandler(async (req, res) => {
  var data = JSON.parse(req.body.data);
  var opr
  if (req.file) {
    opr = await OPR.findOneAndUpdate(
      { 'radiologyRequest._id': data.radiologyRequestId, _id: data.OPRId },
      data
    ).populate('patientId');
    opr =  await OPR.findOneAndUpdate(
      { 'radiologyRequest._id': data.radiologyRequestId, _id: data.OPRId },
      { $set: { 'radiologyRequest.$.results': req.file.path,
      'radiologyRequest.$.status': data.status } },
      { new: true }
    ).populate('patientId');
  } else {
    opr = await OPR.findOneAndUpdate(
      { 'radiologyRequest._id': data.radiologyRequestId, _id: data.OPRId },
      { $set: { 'radiologyRequest.$.status': data.status } },
      { new: true }
    ).populate('patientId');
  }
  res.status(200).json({ success: true, data:opr });
});

exports.putPHROPRById = asyncHandler(async (req, res) => {
  const ipr = await OPR.findOneAndUpdate(
    { 'pharmacyRequest._id': req.body._id },
    { $set: { 'pharmacyRequest.$.status': req.body.status } },
    { new: true }
  )
    .populate('pharmacyRequest.requester')
    .populate('pharmacyRequest.medicine.itemId')
    .populate('patientId')
    .select({ pharmacyRequest: 1, patientId:1 });
  res.status(200).json({ success: true, data: ipr });
});
