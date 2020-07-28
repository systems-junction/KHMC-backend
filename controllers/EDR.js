const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { v4: uuidv4 } = require('uuid');
const EDR = require('../models/EDR');

exports.getEDR = asyncHandler(async (req, res) => {
  const edr = await EDR.find().populate('patientId').populate('consultation.requester')
  .populate('pharmacyRequest.requester').populate('labRequest.requester').populate('labRequest.serviceId')
  .populate('radiologyRequest.serviceId').populate('radiologyRequest.requester')
  res.status(200).json({ success: true, data: edr });
});

exports.getEDRById = asyncHandler(async (req, res) => {
    const edr = await EDR.find({_id:req.params._id}).populate('patientId').populate('consultation.requester')
    .populate('pharmacyRequest.requester').populate('labRequest.requester').populate('labRequest.serviceId')
    .populate('radiologyRequest.serviceId').populate('radiologyRequest.requester')
    res.status(200).json({ success: true, data: edr });
  });

exports.addEDR = asyncHandler(async (req, res) => {
  const {  patientId, consultationNote, pharmacyRequest, labRequest, radiologyRequest, status, triageAssessment } = req.body;
  const edr = await EDR.create({
    requestNo:uuidv4(),
    patientId,
    consultationNote,
    pharmacyRequest,
    labRequest,
    radiologyRequest,
    status,
    triageAssessment
  });
  res.status(200).json({ success: true, data: edr });
});

exports.deleteEDR = asyncHandler(async (req, res, next) => {
  const { _id } = req.params;
  const edr = await EDR.findById(_id);
  if (!edr) {
    return next(
      new ErrorResponse(`EDR not found with id of ${_id}`, 404)
    );
  }
  await EDR.deleteOne({ _id: _id });
});

exports.updateEDR = asyncHandler(async (req, res, next) => {
  const { _id } = req.body;
  let edr = await EDR.findById(_id);
  if (!edr) {
    return next(
      new ErrorResponse(`EDR not found with id of ${_id}`, 404)
    );
  }
  edr = await EDR.updateOne({ _id: _id }, req.body);
  res.status(200).json({ success: true, data: edr });
});