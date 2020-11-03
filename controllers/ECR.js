const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { v4: uuidv4 } = require('uuid');
const ECR = require('../models/ecr');
const requestNoFormat = require('dateformat');

exports.getECRfromEDR = asyncHandler(async (req, res) => {
  const ecr = await ECR.find({
    generatedFor: req.params._id,
    generatedFrom: 'EDR',
  })
    .populate({
      path: 'edrId',
      populate: [
        { path: 'patientId' },
        { path: 'consultationNote.requester' },
        { path: 'residentNotes.doctor' },
        { path: 'pharmacyRequest.requester' },
        { path: 'labRequest.requester' },
        { path: 'labRequest.serviceId' },
        { path: 'radiologyRequest.requester' },
        { path: 'radiologyRequest.serviceId' },
      ],
    })
    .populate('generatedBy')
    .populate('generatedFor')
    .populate('patient');
  res.status(200).json({ success: true, data: ecr });
});
exports.getECRfromIPR = asyncHandler(async (req, res) => {
  const ecr = await ECR.find({
    generatedFor: req.params._id,
    generatedFrom: 'IPR',
  })
    .populate({
      path: 'iprId',
      populate: [
        { path: 'patientId' },
        { path: 'consultationNote.requester' },
        { path: 'residentNotes.doctor' },
        { path: 'pharmacyRequest.requester' },
        { path: 'labRequest.requester' },
        { path: 'labRequest.serviceId' },
        { path: 'radiologyRequest.requester' },
        { path: 'radiologyRequest.serviceId' },
        { path: 'nurseService.serviceId' },
        { path: 'nurseService.serviceId' },
      ],
    })
    .populate('generatedBy')
    .populate('generatedFor')
    .populate('patient');
  res.status(200).json({ success: true, data: ecr });
});

exports.getECRById = asyncHandler(async (req, res) => {
  const ecr = await ECR.find({ _id: req.params.id })
    .populate({
      path: 'edrId',
      populate: [
        { path: 'patientId' },
        { path: 'consultationNote.requester' },
        { path: 'residentNotes.doctor' },
        { path: 'pharmacyRequest.requester' },
        { path: 'labRequest.requester' },
        { path: 'labRequest.serviceId' },
        { path: 'radiologyRequest.requester' },
        { path: 'radiologyRequest.serviceId' },
      ],
    })
    .populate({
      path: 'iprId',
      populate: [
        { path: 'patientId' },
        { path: 'consultationNote.requester' },
        { path: 'residentNotes.doctor' },
        { path: 'pharmacyRequest.requester' },
        { path: 'labRequest.requester' },
        { path: 'labRequest.serviceId' },
        { path: 'radiologyRequest.requester' },
        { path: 'radiologyRequest.serviceId' },
        { path: 'nurseService.serviceId' },
        { path: 'nurseService.serviceId' },
      ],
    })
    .populate('generatedBy')
    .populate('generatedFor')
    .populate('patient');
  res.status(200).json({ success: true, data: ecr });
});

exports.addECR = asyncHandler(async (req, res) => {
  const {
    edrId,
    iprId,
    generatedBy,
    generatedFor,
    generatedFrom,
    patient,
  } = req.body;
  var now = new Date();
  var start = new Date(now.getFullYear(), 0, 0);
  var diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
  var oneDay = 1000 * 60 * 60 * 24;
  var day = Math.floor(diff / oneDay);
  const ecr = await ECR.create({
    requestNo: 'ECR' +day+ requestNoFormat(new Date(), 'yyHHMM'),
    edrId,
    iprId,
    generatedBy,
    generatedFor,
    generatedFrom,
    patient,
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
