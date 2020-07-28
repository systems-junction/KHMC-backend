const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Patient = require('../models/patient');

exports.getPatient = asyncHandler(async (req, res) => {
  const patient = await Patient.find()
  res.status(200).json({ success: true, data: patient });
});
exports.getPatientById = asyncHandler(async (req, res) => {
  const patient = await Patient.find({ _id: req.params.id })
  res.status(200).json({ success: true, data: patient });
});
exports.getPatientBySIN = asyncHandler(async (req, res) => {
  const patient = await Patient.find({ SIN: req.params.SIN })
  res.status(200).json({ success: true, data: patient });
});
exports.getPatientByMRN = asyncHandler(async (req, res) => {
  const patient = await Patient.find({ profileNo: req.params.profileNo })
  res.status(200).json({ success: true, data: patient });
});
exports.addPatient = asyncHandler(async (req, res) => {

  const { profileNo, SIN, title, firstName, lastName, gender, dob, phoneNumber, email, country, city, address,
    otherDetails, paymentMethod, depositAmount, amountReceived, bankName, depositorName,age, height, weight,
    bloodGroup, insuranceId, coverageDetails, coverageTerms, payment } = req.body.data;
  var parsed = JSON.parse(req.body.data)
  var patient;
  if (req.file) {
    patient = await Patient.create({
      profileNo: parsed.profileNo,
      SIN: parsed.SIN,
      title: parsed.title,
      firstName: parsed.firstName,
      lastName: parsed.lastName,
      gender: parsed.gender,
      dob: parsed.dob,
      age:parsed.age,
      height:parsed.height,
      weight:parsed.weight,
      bloodGroup:parsed.bloodGroup,
      phoneNumber: parsed.phoneNumber,
      email: parsed.email,
      country: parsed.country,
      city: parsed.city,
      address: parsed.address,
      otherDetails: parsed.otherDetails,
      paymentMethod: parsed.paymentMethod,
      depositAmount: parsed.depositAmount,
      amountReceived: parsed.amountReceived,
      bankName: parsed.bankName,
      depositorName: parsed.depositorName,
      depositSlip: req.file.path,
      insuranceId: parsed.insuranceId,
      coverageDetails: parsed.coverageDetails,
      coverageTerms: parsed.coverageTerms,
      payment: parsed.payment
    });
  }
  else {
    patient = await Patient.create({
      profileNo: parsed.profileNo,
      SIN: parsed.SIN,
      title: parsed.title,
      firstName: parsed.firstName,
      lastName: parsed.lastName,
      gender: parsed.gender,
      dob: parsed.dob,
      age:parsed.age,
      height:parsed.height,
      weight:parsed.weight,
      bloodGroup:parsed.bloodGroup,
      phoneNumber: parsed.phoneNumber,
      email: parsed.email,
      country: parsed.country,
      city: parsed.city,
      address: parsed.address,
      otherDetails: parsed.otherDetails,
      paymentMethod: parsed.paymentMethod,
      depositAmount: parsed.depositAmount,
      amountReceived: parsed.amountReceived,
      bankName: parsed.bankName,
      depositorName: parsed.depositorName,
      insuranceId: parsed.insuranceId,
      coverageDetails: parsed.coverageDetails,
      coverageTerms: parsed.coverageTerms,
      payment: parsed.payment
    });
  }
  res.status(200).json({ success: true, data: patient });
});

exports.deletePatient = asyncHandler(async (req, res, next) => {
  const { _id } = req.params;
  const patient = await Patient.findById(_id);
  if (!patient) {
    return next(
      new ErrorResponse(`Patient not found with id of ${_id}`, 404)
    );
  }
  await Patient.deleteOne({ _id: _id });
});

exports.updatePatient = asyncHandler(async (req, res, next) => {

  var { _id } = JSON.parse(req.body.data);

  var patient = await Patient.findById(_id);
  if (!patient) {
    return next(
      new ErrorResponse(`Patient not found with id of ${_id}`, 404)
    );
  }
  if (req.file) {
    patient = await Patient.updateOne({ _id: _id }, { $set: { depositSlip: req.file.path } }, JSON.parse(req.body.data));
  }
  else {
    patient = await Patient.updateOne({ _id: _id }, JSON.parse(req.body.data));
  }
  res.status(200).json({ success: true, data: patient });
});