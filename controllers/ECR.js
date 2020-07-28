const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { v4: uuidv4 } = require('uuid');
const ECR = require('../models/ecr');

exports.getECR = asyncHandler(async (req, res) => {
  const ecr = await ECR.find()
    .populate('patientId')
    .populate('consultation.requester')
    .populate('pharmacyRequest.requester')
    .populate('labRequest.requester')
    .populate('labRequest.serviceId')
    .populate('radiologyRequest.serviceId')
    .populate('radiologyRequest.requester');
  res.status(200).json({ success: true, data: ecr });
});

exports.getECRById = asyncHandler(async (req, res) => {
  const ecr = await ECR.find({ _id: req.params.id })
    .populate('patientId')
    .populate('consultation.requester')
    .populate('pharmacyRequest.requester')
    .populate('labRequest.requester')
    .populate('labRequest.serviceId')
    .populate('radiologyRequest.serviceId')
    .populate('radiologyRequest.requester');
  res.status(200).json({ success: true, data: ecr });
});

exports.addECR = asyncHandler(async (req, res) => {
  const {
    patientId,
    consultationNote,
    pharmacyRequest,
    labRequest,
    radiologyRequest,
    status,
    triageAssessment,
  } = req.body;
  const ecr = await ECR.create({
    requestNo: uuidv4(),
    patientId,
    consultationNote,
    pharmacyRequest,
    labRequest,
    radiologyRequest,
    status,
    triageAssessment,
  });
  res.status(200).json({ success: true, data: ecr });
});

exports.deleteECR = asyncHandler(async (req, res, next) => {
  const { _id } = req.params;
  const ecr = await ECR.findById(_id);
  if (!ecr) {
    return next(new ErrorResponse(`ECR not found with id of ${_id}`, 404));
  }
  await ECR.deleteOne({ _id: _id });
});

exports.updateECR = asyncHandler(async (req, res, next) => {
  const { _id } = req.body;
  let ecr = await ECR.findById(_id);
  if (!ecr) {
    return next(new ErrorResponse(`ECR not found with id of ${_id}`, 404));
  }
  ecr = await ECR.updateOne({ _id: _id }, req.body);
  res.status(200).json({ success: true, data: ecr });
});
