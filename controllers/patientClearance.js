const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const PatientClearance = require('../models/patientClearance');
const requestNoFormat = require('dateformat');

exports.getPatientClearance = asyncHandler(async (req, res) => {
  const patient = await PatientClearance.find()
    .populate('patientId')
    .populate('edrId')
    .populate('iprId')
    .populate('generatedBy')
  res.status(200).json({ success: true, data: patient });
});

exports.getPatientClearanceById = asyncHandler(async (req, res) => {
  const patient = await PatientClearance.find({ _id: req.params.id })
    .populate('patientId')
    .populate('edrId')
    .populate('iprId')
    .populate('generatedBy')
  res.status(200).json({ success: true, data: patient });
});

exports.addPatientClearance = asyncHandler(async (req, res) => {
  const {patientId,edrId,iprId,generatedBy,consultantFee,residentFee,subTotal,total,returnedAmount} = req.body;
  var now = new Date();
  var start = new Date(now.getFullYear(), 0, 0);
  var diff = now - start + (start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000;
  var oneDay = 1000 * 60 * 60 * 24;
  var day = Math.floor(diff / oneDay);
   const patient = await PatientClearance.create({
      clearanceNo: 'PC' + day + requestNoFormat(new Date(), 'yyHHMMss'),
      patientId,edrId,iprId,generatedBy,consultantFee,residentFee,subTotal,total,returnedAmount
    });
  res.status(200).json({ success: true, data: patient });
});

exports.updatePatientClearance = asyncHandler(async (req, res, next) => {
    const { _id } = req.body;
    let patient = await PatientClearance.findById(_id);
    if (!patient) {
      return next(
        new ErrorResponse(`Patient Clearance not found with id of ${_id}`, 404)
      );
    }
    patient = await PatientClearance.findOneAndUpdate({ _id: _id }, req.body, {
      new: true,
    });
    res.status(200).json({ success: true, data: patient });
  });
