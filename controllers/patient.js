const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const notification = require('../components/notification');
const Patient = require('../models/patient');
const PatientFHIR = require('../models/patientFHIR/patientFHIR');
const IPR = require('../models/IPR');
const EDR = require('../models/EDR');
const OPR = require('../models/OPR');
const file = require('../models/file');
const moment = require('moment');
const requestNoFormat = require('dateformat');
var QRCode = require('qrcode');
var base64ToImage = require('base64-to-image');

exports.getPatient = asyncHandler(async (req, res) => {
  const patient = await Patient.find()
    .populate('receivedBy')
    .sort({ $natural: -1 })
    .limit(100);
  res.status(200).json({ success: true, data: patient });
});
exports.getPatientActive = asyncHandler(async (req, res) => {
  const arr = []
  const edr = await EDR.find({ status: "pending" }).populate("patientId").select({ patientId: 1, status: 1 })
  for (let i = 0; i < edr.length; i++) {
    arr.push(edr[i]);
  }
  const ipr = await IPR.find({ status: "pending" }).populate("patientId").select({ patientId: 1, status: 1 })
  for (let i = 0; i < ipr.length; i++) {
    arr.push(ipr[i]);
  }
  res.status(200).json({ success: true, data: arr });
});
exports.getPatientHistoryPre = asyncHandler(async (req, res) => {
  const patient = await Patient.findOne({ _id: req.params.id });
  const edr = await EDR.find({ patientId: patient._id })
    .populate('patientId')
    .select({
      requestNo: 1,
      createdAt: 1,
      status: 1,
      requestType: 1,
      patientId: 1,
    });
  const ipr = await IPR.find({ patientId: patient._id })
    .populate('patientId')
    .populate('functionalUnit')
    .select({
      requestNo: 1,
      createdAt: 1,
      functionalUnit: 1,
      status: 1,
      requestType: 1,
      patientId: 1,
    });

  const opr = await OPR.find({ patientId: patient._id })
    .populate('patientId')
    .populate({
      path: 'generatedBy',
      populate: [
        {
          path: 'functionalUnit',
        },
      ],
    })
    .select({
      requestNo: 1,
      createdAt: 1,
      generatedBy: 1,
      status: 1,
      requestType: 1,
      patientId: 1,
    });

  var dataConcatArrayEDRIPR = [edr.concat(ipr)];
  var dataConcatEDRIPR = dataConcatArrayEDRIPR[0];
  var dataConcatArrayOPR = [dataConcatEDRIPR.concat(opr)];
  var data = dataConcatArrayOPR[0];

  res.status(200).json({ success: true, data: data });
});

exports.getPatientHistory = asyncHandler(async (req, res) => {
  if (req.params.requestType == 'EDR') {
    const edr = await EDR.findOne({ _id: req.params.id })
      .populate('consultationNote.requester')
      .populate('consultationNote.specialist')
      .populate({
        path: 'pharmacyRequest',
        populate: [
          {
            path: 'item.itemId',
          },
        ],
      })
      .populate('pharmacyRequest.item.itemId')
      .populate('labRequest.requester')
      .populate('labRequest.serviceId')
      .populate('radiologyRequest.serviceId')
      .populate('radiologyRequest.requester')
      .populate('residentNotes.doctor')
      .populate('residentNotes.doctorRef')
      .populate('dischargeRequest.dischargeMedication.requester')
      .populate('dischargeRequest.dischargeMedication.medicine.itemId')
      .populate('triageAssessment.requester');
    res.status(200).json({ success: true, data: edr });
  } else if (req.params.requestType == 'IPR') {
    const ipr = await IPR.findOne({ _id: req.params.id })
      .populate('consultationNote.requester')
      .populate({
        path: 'pharmacyRequest',
        populate: [
          {
            path: 'item.itemId',
          },
        ],
      })
      .populate('labRequest.requester')
      .populate('labRequest.serviceId')
      .populate('radiologyRequest.serviceId')
      .populate('radiologyRequest.requester')
      .populate('residentNotes.doctor')
      .populate('residentNotes.doctorRef')
      .populate('nurseService.serviceId')
      .populate('nurseService.requester')
      .populate('dischargeRequest.dischargeMedication.requester')
      .populate('dischargeRequest.dischargeMedication.medicine.itemId')
      .populate('followUp.approvalPerson')
      .populate('triageAssessment.requester');
    res.status(200).json({ success: true, data: ipr });
  } else if (req.params.requestType == 'OPR') {
    const opr = await OPR.find({ _id: req.params.id })
      .populate('pharmacyRequest.requester')
      .populate('pharmacyRequest.medicine.itemId')
      .populate('labRequest.requester')
      .populate('labRequest.serviceId')
      .populate('radiologyRequest.serviceId')
      .populate('radiologyRequest.requester');
    res.status(200).json({ success: true, data: opr });
  } else {
    res.status(200).json({ success: false, data: 'Request does not exist' });
  }
});
exports.getPatientEDR = asyncHandler(async (req, res) => {
  const patient = await Patient.find({ registeredIn: 'EDR' })
    .populate('receivedBy')
    .sort({ $natural: -1 })
    .limit(100);
  res.status(200).json({ success: true, data: patient });
});
exports.getPatientIPR = asyncHandler(async (req, res) => {
  const patient = await Patient.find({ registeredIn: 'IPR' })
    .populate('receivedBy')
    .sort({ $natural: -1 })
    .limit(100);
  res.status(200).json({ success: true, data: patient });
});
exports.getPatientById = asyncHandler(async (req, res) => {
  const patient = await Patient.findOne({ _id: req.params.id }).populate(
    'receivedBy'
  );
  res.status(200).json({ success: true, data: patient });
});
exports.getPatientBySIN = asyncHandler(async (req, res) => {
  const patient = await Patient.find({ SIN: req.params.SIN })
    .populate('receivedBy')
    .sort({ $natural: -1 })
    .limit(100);
  res.status(200).json({ success: true, data: patient });
});
exports.getPatientByMRN = asyncHandler(async (req, res) => {
  const patient = await Patient.find({
    profileNo: req.params.profileNo,
  })
    .populate('receivedBy')
    .sort({ $natural: -1 })
    .limit(100);
  res.status(200).json({ success: true, data: patient });
});
exports.getPaitentKeyword = asyncHandler(async (req, res) => {

  const patient = await Patient.aggregate([
    {
      $project: {
        name: { $concat: ['$firstName', ' ', '$lastName'] },
        profileNo: 1,
        SIN: 1,
        age: 1,
        gender: 1,
        phoneNumber: 1,
        mobileNumber: 1,
      },
    },
    {
      $match: {
        $or: [
          { name: { $regex: req.params.keyword, $options: 'i' } },
          { profileNo: { $regex: req.params.keyword, $options: 'i' } },
          { SIN: { $regex: req.params.keyword, $options: 'i' } },
          { phoneNumber: { $regex: req.params.keyword, $options: 'i' } },
          { mobileNumber: { $regex: req.params.keyword, $options: 'i' } },
        ],
      },
    }
  ]).limit(50)
  //     const patient = await Patient.find({
  //       $or: [
  //         { firstName: { $regex: req.params.keyword, $options: 'i' } },
  //         { lastName: { $regex: req.params.keyword, $options: 'i' } },
  //         { profileNo: { $regex: req.params.keyword, $options: 'i' } },
  //         { SIN: { $regex: req.params.keyword, $options: 'i' } },
  //         { phoneNumber: { $regex: req.params.keyword, $options: 'i' } },
  //         { mobileNumber: { $regex: req.params.keyword, $options: 'i' } },
  //       ],
  // }).limit(50).select({
  //       firstName:1,
  //       lastName:1,
  //       profileNo: 1,
  //       SIN: 1,
  //       age: 1,
  //       gender: 1,
  //       phoneNumber: 1,
  //       mobileNumber: 1,
  // })
  res.status(200).json({ success: true, data: patient });
});

exports.addPatient = asyncHandler(async (req, res) => {

  var now = new Date();
  var start = new Date(now.getFullYear(), 0, 0);
  var diff =
    now -
    start +
    (start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000;
  var oneDay = 1000 * 60 * 60 * 24;
  var day = Math.floor(diff / oneDay);
  var parsed = JSON.parse(req.body.data);
  var patient;
  if (req.file) {
    patient = await Patient.create({
      profileNo: 'khmc' + day + requestNoFormat(new Date(), 'yyHHMMss'),
      SIN: parsed.SIN,
      title: parsed.title,
      firstName: parsed.firstName,
      lastName: parsed.lastName,
      fullName: parsed.firstName + ' ' + parsed.lastName,
      gender: parsed.gender,
      nationality: parsed.nationality,
      dob: parsed.dob,
      drugAllergy: parsed.drugAllergy,
      age: parsed.age,
      height: parsed.height,
      weight: parsed.weight,
      bloodGroup: parsed.bloodGroup,
      phoneNumber: parsed.phoneNumber,
      mobileNumber: parsed.mobileNumber,
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
      // insuranceId: parsed.insuranceId,
      insuranceNo: parsed.insuranceNo,
      insuranceVendor: parsed.insuranceVendor,
      coverageDetails: parsed.coverageDetails,
      coverageTerms: parsed.coverageTerms,
      payment: parsed.payment,
      registeredIn: parsed.registeredIn,
      receivedBy: parsed.receivedBy,
      emergencyName: parsed.emergencyName,
      emergencyContactNo: parsed.emergencyContactNo,
      emergencyRelation: parsed.emergencyRelation,
      coveredFamilyMembers: parsed.coveredFamilyMembers,
      otherCoverageDetails: parsed.otherCoverageDetails,
      otherCity: parsed.otherCity
    });
  } else {
    patient = await Patient.create({
      profileNo: 'khmc' + day + requestNoFormat(new Date(), 'yyHHMMss'),
      SIN: parsed.SIN,
      title: parsed.title,
      firstName: parsed.firstName,
      lastName: parsed.lastName,
      fullName: parsed.firstName + ' ' + parsed.lastName,
      gender: parsed.gender,
      nationality: parsed.nationality,
      dob: parsed.dob,
      drugAllergy: parsed.drugAllergy,
      age: parsed.age,
      height: parsed.height,
      weight: parsed.weight,
      bloodGroup: parsed.bloodGroup,
      phoneNumber: parsed.phoneNumber,
      mobileNumber: parsed.mobileNumber,
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
      // insuranceId: parsed.insuranceId,
      insuranceNo: parsed.insuranceNo,
      insuranceVendor: parsed.insuranceVendor,
      coverageDetails: parsed.coverageDetails,
      coverageTerms: parsed.coverageTerms,
      payment: parsed.payment,
      registeredIn: parsed.registeredIn,
      receivedBy: parsed.receivedBy,
      emergencyName: parsed.emergencyName,
      emergencyContactNo: parsed.emergencyContactNo,
      emergencyRelation: parsed.emergencyRelation,
      coveredFamilyMembers: parsed.coveredFamilyMembers,
      otherCoverageDetails: parsed.otherCoverageDetails,
      otherCity: parsed.otherCity
    });
  }
  notification(
    'Patient Registered',
    'A new Patient with MRN ' + patient.profileNo + ' has been registered ',
    'Registered Nurse',
    '/home/rcm/patientAssessment',
    patient._id
  );
  let obj = {}
  obj.profileNo = patient.profileNo
  obj.age = patient.age
  obj.paymentMethod = patient.paymentMethod
  obj.createdAt = patient.createdAt
  QRCode.toDataURL(JSON.stringify(obj), function (err, url) {
    var base64Str = url;
    var path = './uploads/';
    var pathFormed = base64ToImage(base64Str, path);
    Patient.findOneAndUpdate(
      { _id: patient._id },
      { $set: { QR: '/uploads/' + pathFormed.fileName } },
      { new: true }
    ).then((docs) => {
      res.status(200).json({ success: true, data: docs });
    });
  });
  const pat = await Patient.find()
    .populate('receivedBy')
    .sort({ $natural: -1 })
    .limit(100);
  globalVariable.io.emit('get_data', pat);

});
exports.qrGenerator = asyncHandler(async (req, res) => {
  const pat = await Patient.findOne({ _id: req.params.id });
  var returnValue = pat.QR;
  res.json({ success: true, data: returnValue });
});
exports.addPatientFHIR = asyncHandler(async (req, res) => {
  const {
    name,
    telecom,
    gender,
    birthDate,
    deceasedBoolean,
    deceasedDateTime,
    address,
    maritalStatus,
    multipleBirthBoolean,
    multipleBirthInteger,
    photo,
    contact,
    generalPractitioner,
    managingOrganization,
  } = req.body;
  var patient = await PatientFHIR.create({
    name,
    telecom,
    gender,
    birthDate,
    deceasedBoolean,
    deceasedDateTime,
    address,
    maritalStatus,
    multipleBirthBoolean,
    multipleBirthInteger,
    photo,
    contact,
    generalPractitioner,
    managingOrganization,
  });
  res.status(200).json({ success: true, data: patient });
});
exports.deletePatient = asyncHandler(async (req, res, next) => {
  const { _id } = req.params;
  const patient = await Patient.findById(_id);
  if (!patient) {
    return next(new ErrorResponse(`Patient not found with id of ${_id}`, 404));
  }
  await Patient.deleteOne({ _id: _id });
});
exports.updatePatient = asyncHandler(async (req, res, next) => {
  var { _id } = JSON.parse(req.body.data);
  var patient = await Patient.findById(_id);
  if (!patient) {
    return next(new ErrorResponse(`Patient not found with id of ${_id}`, 404));
  }
  if (req.file) {
    patientQR = await Patient.findOne({ _id: _id });
    patient = await Patient.findOneAndUpdate(
      { _id: _id },
      JSON.parse(req.body.data),
      { new: true }
    );
    await Patient.findOneAndUpdate(
      { _id: _id },
      { $set: { depositSlip: req.file.path } },
      { new: true }
    );
    if (!patientQR.QR) {
      let obj = {}
      obj.profileNo = patient.profileNo
      obj.age = patient.age
      obj.paymentMethod = patient.paymentMethod
      obj.createdAt = patient.createdAt
      QRCode.toDataURL(JSON.stringify(obj), function (
        err,
        url
      ) {
        var base64Str = url;
        var path = './uploads/';
        var pathFormed = base64ToImage(base64Str, path);
        Patient.findOneAndUpdate(
          { _id: patientQR._id },
          { $set: { QR: '/uploads/' + pathFormed.fileName } },
          { new: true }
        ).then((docs) => {
          res.status(200).json({ success: true, data: docs });
        });
      });
    }
    else {
      res.status(200).json({ success: true, data: patient });
    }
  } else {
    patientQR = await Patient.findOne({ _id: _id });
    patient = await Patient.findOneAndUpdate(
      { _id: _id },
      JSON.parse(req.body.data),
      { new: true }
    );
    if (!patientQR.QR) {
      let obj = {}
      obj.profileNo = patient.profileNo
      obj.age = patient.age
      obj.paymentMethod = patient.paymentMethod
      obj.createdAt = patient.createdAt
      QRCode.toDataURL(JSON.stringify(obj), function (
        err,
        url
      ) {
        var base64Str = url;
        var path = './uploads/';
        var pathFormed = base64ToImage(base64Str, path);
        Patient.findOneAndUpdate(
          { _id: patientQR._id },
          { $set: { QR: '/uploads/' + pathFormed.fileName } },
          { new: true }
        ).then((docs) => {
          res.status(200).json({ success: true, data: docs });
        });
      });
    }
    else {
      res.status(200).json({ success: true, data: patient });
    }
  }

});
exports.updatePatientFHIR = asyncHandler(async (req, res, next) => {
  var { _id } = req.body;
  var patientfhir = await PatientFHIR.findById(_id);
  if (!patientfhir) {
    return next(
      new ErrorResponse(`Patient FHIR not found with id of ${_id}`, 404)
    );
  }
  patientfhir = await PatientFHIR.findOneAndUpdate({ _id: _id }, req.body, {
    new: true,
  });
  res.status(200).json({ success: true, data: patientfhir });
});
exports.searchPatient = asyncHandler(async (req, res) => {
  const a = await EDR.findOne({ patientId: req.params._id });
  if (a !== null) {
    var edr = await EDR.findOne({ patientId: req.params._id })
      .populate('patientId')
      .populate('consultationNote.requester')
      .populate('consultationNote.specialist')
      .populate({
        path: 'pharmacyRequest',
        populate: [
          {
            path: 'item.itemId',
          },
        ],
      })
      .populate('pharmacyRequest.item.itemId')
      .populate('labRequest.requester')
      .populate('labRequest.serviceId')
      .populate('radiologyRequest.serviceId')
      .populate('radiologyRequest.requester')
      .populate('residentNotes.doctor')
      .populate('residentNotes.doctorRef')
      .populate('dischargeRequest.dischargeMedication.requester')
      .populate('dischargeRequest.dischargeMedication.medicine.itemId')
      .populate('triageAssessment.requester')
      .sort({
        createdAt: 'desc',
      })
      .limit(100);
  }
  const b = await IPR.findOne({ patientId: req.params._id });
  if (b !== null) {
    var ipr = await IPR.findOne({ patientId: req.params._id })
      .populate('patientId')
      .populate('consultationNote.requester')
      .populate('consultationNote.specialist')
      .populate({
        path: 'pharmacyRequest',
        populate: [
          {
            path: 'item.itemId',
          },
        ],
      })
      .populate('labRequest.requester')
      .populate('labRequest.serviceId')
      .populate('radiologyRequest.serviceId')
      .populate('radiologyRequest.requester')
      .populate('residentNotes.doctor')
      .populate('residentNotes.doctorRef')
      .populate('nurseService.serviceId')
      .populate('nurseService.requester')
      .populate('dischargeRequest.dischargeMedication.requester')
      .populate('dischargeRequest.dischargeMedication.medicine.itemId')
      .populate('followUp.approvalPerson')
      .populate('triageAssessment.requester')
      .sort({
        createdAt: 'desc',
      })
      .limit(100);
  }
  if (a && b) {
    var isafter = moment(edr.createdAt).isAfter(ipr.createdAt);
    if (isafter) {
      res.status(200).json({ success: true, data: edr });
    } else {
      res.status(200).json({ success: true, data: ipr });
    }
  } else if (a) {
    res.status(200).json({ success: true, data: edr });
  } else if (b) {
    res.status(200).json({ success: true, data: ipr });
  } else {
    res.status(200).json({ success: false, data: 'User not found' });
  }
});
exports.updateEdrIpr = asyncHandler(async (req, res, next) => {
  const { _id, requestType } = req.body;
  if (requestType === 'EDR') {
    let edr = await EDR.findById(_id);
    if (!edr) {
      return next(new ErrorResponse(`EDR not found with id of ${_id}`, 404));
    }
    edr = await EDR.findOneAndUpdate({ _id: _id }, req.body, {
      new: true,
    }).populate('patientId');
    res.status(200).json({ success: true, data: edr });
  }
  if (requestType === 'IPR') {
    let ipr = await IPR.findById(_id);
    if (!ipr) {
      return next(new ErrorResponse(`IPR not found with id of ${_id}`, 404));
    }
    ipr = await IPR.findOneAndUpdate({ _id: _id }, req.body, {
      new: true,
    }).populate('patientId');
    res.status(200).json({ success: true, data: ipr });
  }
});

exports.updateEdrIprItem = asyncHandler(async (req, res) => {
  var parsed = JSON.parse(req.body.data);
  var not;
  if (req.file) {
    if (parsed.requestType === 'EDR') {
      await EDR.findOneAndUpdate(
        { 'consultationNote._id': parsed.itemID, _id: parsed.id },
        {
          $set: {
            'consultationNote.$.consultationNotes': parsed.consultationNotes,
            'consultationNote.$.completedTime': parsed.completedTime
          },
        },
        { new: true }
      );

      await EDR.findOneAndUpdate(
        { 'consultationNote._id': parsed.itemID, _id: parsed.id },
        { $set: { 'consultationNote.$.audioNotes': req.file.path, 'consultationNote.$.completedTime': parsed.completedTime }, },
        { new: true }
      );

      not = await EDR.findOneAndUpdate(
        { 'consultationNote._id': parsed.itemID, _id: parsed.id },
        {
          $set: {
            'consultationNote.$.status': parsed.status,
            'consultationNote.$.completedTime': parsed.completedTime
          }
        },
        { new: true }
      ).populate('patientId');
      notification(
        'Consultation Request',
        'Consultation Request number ' +
        parsed.consultationNo +
        ' received for Patient MRN ' +
        not.patientId.profileNo,
        'Doctor/Physician',
        '/home/rcm/rd/consultationrequest',
        not.patientId._id
      );
      const pat = await EDR.findOne({ patientId: not.patientId });
      globalVariable.io.emit('get_data', pat);
    }
    if (parsed.requestType === 'IPR') {
      await IPR.findOneAndUpdate(
        { 'consultationNote._id': parsed.itemID, _id: parsed.id },
        {
          $set: {
            'consultationNote.$.consultationNotes': parsed.consultationNotes,
            'consultationNote.$.completedTime': parsed.completedTime
          },
        },
        { new: true }
      );

      await IPR.findOneAndUpdate(
        { 'consultationNote._id': parsed.itemID, _id: parsed.id },
        {
          $set: { 'consultationNote.$.audioNotes': req.file.path, 'consultationNote.$.completedTime': parsed.completedTime },
        },
        { new: true }
      );

      not = await IPR.findOneAndUpdate(
        { 'consultationNote._id': parsed.itemID, _id: parsed.id },
        {
          $set: {
            'consultationNote.$.status': parsed.status,
            'consultationNote.$.completedTime': parsed.completedTime,
          }
        },
        { new: true }
      ).populate('patientId');
      notification(
        'Consultation Request',
        'Consultation Request number ' +
        parsed.consultationNo +
        ' received for Patient MRN ' +
        not.patientId.profileNo,
        'Doctor/Physician',
        '/home/rcm/rd/consultationrequest',
        not.patientId._id
      );
      const pat = await IPR.findOne({ patientId: not.patientId });
      globalVariable.io.emit('get_data', pat);
    }
    res.status(200).json({ success: true, data: not });
  } else {
    if (parsed.requestType === 'EDR') {
      await EDR.findOneAndUpdate(
        { 'consultationNote._id': parsed.itemID, _id: parsed.id },
        {
          $set: {
            'consultationNote.$.consultationNotes': parsed.consultationNotes,
            'consultationNote.$.completedTime': parsed.completedTime
          },
        },
        { new: true }
      );
      not = await EDR.findOneAndUpdate(
        { 'consultationNote._id': parsed.itemID, _id: parsed.id },
        {
          $set: { 'consultationNote.$.status': parsed.status, 'consultationNote.$.completedTime': parsed.completedTime },
        },
        { new: true }
      ).populate('patientId');
      notification(
        'Consultation Request',
        'Consultation Request number ' +
        parsed.consultationNo +
        ' received for Patient MRN ' +
        not.patientId.profileNo,
        'Doctor/Physician',
        '/home/rcm/rd/consultationrequest',
        not.patientId._id
      );
      const pat = await EDR.findOne({ patientId: not.patientId });
      globalVariable.io.emit('get_data', pat);
    }
    if (parsed.requestType === 'IPR') {
      await IPR.findOneAndUpdate(
        { 'consultationNote._id': parsed.itemID, _id: parsed.id },
        {
          $set: {
            'consultationNote.$.consultationNotes': parsed.consultationNotes,
            'consultationNote.$.completedTime': parsed.completedTime
          },
        },
        { new: true }
      );
      not = await IPR.findOneAndUpdate(
        { 'consultationNote._id': parsed.itemID, _id: parsed.id },
        {
          $set: {
            'consultationNote.$.status': parsed.status,
            'consultationNote.$.completedTime': parsed.completedTime
          },
        },
        { new: true }
      ).populate('patientId');
      notification(
        'Consultation Request',
        'Consultation Request number ' +
        parsed.consultationNo +
        ' received for Patient MRN ' +
        not.patientId.profileNo,
        'Doctor/Physician',
        '/home/rcm/rd/consultationrequest',
        not.patientId._id
      );
      const pat = await IPR.findOne({ patientId: not.patientId });
      globalVariable.io.emit('get_data', pat);
    }
    res.status(200).json({ success: true, data: not });
  }
});

exports.triage = asyncHandler(async (req, res) => {
  const patient = await Patient.findOne({ _id: req.params.id });
  notification(
    'Patient Triage Added',
    'A Patient with MRN ' +
    patient.profileNo +
    ' has been registered with Triage Level',
    'Doctor/Physician',
    '/home/rcm/rd/assessmentdiagnosis',
    patient._id
  );
  const pat = await Patient.find().populate('receivedBy');
  globalVariable.io.emit('get_data', pat);
});

exports.pharmacy = asyncHandler(async (req, res) => {
  const patient = await Patient.findOne({ _id: req.params.id });
  const a = await EDR.findOne({ patientId: req.params.id });
  if (a !== null) {
    var edr = await EDR.findOne({ patientId: req.params.id }).populate('pharmacyRequest').sort({
      createdAt: 'desc',
    });
  }
  const b = await IPR.findOne({ patientId: req.params.id });
  if (b !== null) {
    var ipr = await IPR.findOne({ patientId: req.params.id }).populate('pharmacyRequest').sort({
      createdAt: 'desc',
    });
  }
  if (a && b) {
    var isafter = moment(edr.createdAt).isAfter(ipr.createdAt);
    if (isafter) {
      var test = edr.pharmacyRequest[edr.pharmacyRequest.length - 1];
      notification(
        'Pharmacy Request',
        'Pharmacy Request number ' +
        test.requestNo +
        ' received for Patient MRN ' +
        patient.profileNo,
        'Pharmacist',
        '/home/rcm/sr/phr/ipr',
        patient._id
      );
      const pat = await EDR.findOne({ patientId: req.params.id });
      globalVariable.io.emit('get_data', pat);
      res.status(200).json({ success: true });
    } else {
      var test = ipr.pharmacyRequest[ipr.pharmacyRequest.length - 1];
      notification(
        'Pharmacy Request',
        'Pharmacy Request number ' +
        test.requestNo +
        ' received for Patient MRN ' +
        patient.profileNo,
        'Pharmacist',
        '/home/rcm/sr/phr/ipr',
        patient._id
      );
      const pat = await IPR.findOne({ patientId: req.params.id });
      globalVariable.io.emit('get_data', pat);
      res.status(200).json({ success: true });
    }
  } else if (a) {
    var test = edr.pharmacyRequest[edr.pharmacyRequest.length - 1];
    notification(
      'Pharmacy Request',
      'Pharmacy Request number ' +
      test.requestNo +
      ' received for Patient MRN ' +
      patient.profileNo,
      'Pharmacist',
      '/home/rcm/sr/phr/ipr',
      patient._id
    );
    const pat = await EDR.findOne({ patientId: req.params.id });
    globalVariable.io.emit('get_data', pat);
    res.status(200).json({ success: true });
  } else if (b) {
    var test = ipr.pharmacyRequest[ipr.pharmacyRequest.length - 1];
    notification(
      'Pharmacy Request',
      'Pharmacy Request number ' +
      test.requestNo +
      ' received for Patient MRN ' +
      patient.profileNo,
      'Pharmacist',
      '/home/rcm/sr/phr/ipr',
      patient._id
    );
    const pat = await IPR.findOne({ patientId: req.params.id });
    globalVariable.io.emit('get_data', pat);
    res.status(200).json({ success: true });
  } else {
    res.status(200).json({ success: false, data: 'User not found' });
  }
});

exports.lab = asyncHandler(async (req, res) => {
  const patient = await Patient.findOne({ _id: req.params.id });
  const a = await EDR.findOne({ patientId: req.params.id });
  if (a !== null) {
    var edr = await EDR.findOne({ patientId: req.params.id }).sort({
      createdAt: 'desc',
    });
  }
  const b = await IPR.findOne({ patientId: req.params.id });
  if (b !== null) {
    var ipr = await IPR.findOne({ patientId: req.params.id }).sort({
      createdAt: 'desc',
    });
  }
  if (a && b) {
    var isafter = moment(edr.createdAt).isAfter(ipr.createdAt);
    if (isafter) {
      var test = edr.labRequest[edr.labRequest.length - 1];
      notification(
        'Laboratory Request',
        'Laboratory Request number ' +
        test.LRrequestNo +
        ' received for Patient MRN ' +
        patient.profileNo,
        'Lab Technician',
        '/home/rcm/sr/lr/ipr',
        patient._id
      );
      const pat = await EDR.findOne({ patientId: req.params.id });
      globalVariable.io.emit('get_data', pat);
      res.status(200).json({ success: true });
    } else {
      var test = ipr.labRequest[ipr.labRequest.length - 1];
      notification(
        'Laboratory Request',
        'Laboratory Request number ' +
        test.LRrequestNo +
        ' received for Patient MRN ' +
        patient.profileNo,
        'Lab Technician',
        '/home/rcm/sr/lr/ipr',
        patient._id
      );
      const pat = await IPR.findOne({ patientId: req.params.id });
      globalVariable.io.emit('get_data', pat);
      res.status(200).json({ success: true });
    }
  } else if (a) {
    var test = edr.labRequest[edr.labRequest.length - 1];
    notification(
      'Laboratory Request',
      'Laboratory Request number ' +
      test.LRrequestNo +
      ' received for Patient MRN ' +
      patient.profileNo,
      'Lab Technician',
      '/home/rcm/sr/lr/ipr',
      patient._id
    );
    const pat = await EDR.findOne({ patientId: req.params.id });
    globalVariable.io.emit('get_data', pat);
    res.status(200).json({ success: true });
  } else if (b) {
    var test = ipr.labRequest[ipr.labRequest.length - 1];
    notification(
      'Laboratory Request',
      'Laboratory Request number ' +
      test.LRrequestNo +
      ' received for Patient MRN ' +
      patient.profileNo,
      'Lab Technician',
      '/home/rcm/sr/lr/ipr',
      patient._id
    );
    const pat = await IPR.findOne({ patientId: req.params.id });
    globalVariable.io.emit('get_data', pat);
    res.status(200).json({ success: true });
  } else {
    res.status(200).json({ success: false, data: 'User not found' });
  }
});
exports.rad = asyncHandler(async (req, res) => {
  const patient = await Patient.findOne({ _id: req.params.id });
  const a = await EDR.findOne({ patientId: req.params.id });
  if (a !== null) {
    var edr = await EDR.findOne({ patientId: req.params.id }).sort({
      createdAt: 'desc',
    });
  }
  const b = await IPR.findOne({ patientId: req.params.id });
  if (b !== null) {
    var ipr = await IPR.findOne({ patientId: req.params.id }).sort({
      createdAt: 'desc',
    });
  }
  if (a && b) {
    var isafter = moment(edr.createdAt).isAfter(ipr.createdAt);
    if (isafter) {
      var test = edr.radiologyRequest[edr.radiologyRequest.length - 1];
      notification(
        'Radiology Request',
        'Radiology Request number ' +
        test.RRrequestNo +
        ' received for Patient MRN ' +
        patient.profileNo,
        'Radiology/Imaging',
        '/home/rcm/sr/rr/ipr',
        patient._id
      );
      const pat = await EDR.findOne({ patientId: req.params.id });
      globalVariable.io.emit('get_data', pat);
      res.status(200).json({ success: true });
    } else {
      var test = ipr.radiologyRequest[ipr.radiologyRequest.length - 1];
      notification(
        'Radiology Request',
        'Radiology Request number ' +
        test.RRrequestNo +
        ' received for Patient MRN ' +
        patient.profileNo,
        'Radiology/Imaging',
        '/home/rcm/sr/rr/ipr',
        patient._id
      );
      const pat = await IPR.findOne({ patientId: req.params.id });
      globalVariable.io.emit('get_data', pat);
      res.status(200).json({ success: true });
    }
  } else if (a) {
    var test = edr.radiologyRequest[edr.radiologyRequest.length - 1];
    notification(
      'Radiology Request',
      'Radiology Request number ' +
      test.RRrequestNo +
      ' received for Patient MRN ' +
      patient.profileNo,
      'Radiology/Imaging',
      '/home/rcm/sr/rr/ipr',
      patient._id
    );
    const pat = await EDR.findOne({ patientId: req.params.id });
    globalVariable.io.emit('get_data', pat);
    res.status(200).json({ success: true });
  } else if (b) {
    var test = ipr.radiologyRequest[ipr.radiologyRequest.length - 1];
    notification(
      'Radiology Request',
      'Radiology Request number ' +
      test.RRrequestNo +
      ' received for Patient MRN ' +
      patient.profileNo,
      'Radiology/Imaging',
      '/home/rcm/sr/rr/ipr',
      patient._id
    );
    const pat = await IPR.findOne({ patientId: req.params.id });
    globalVariable.io.emit('get_data', pat);
    res.status(200).json({ success: true });
  } else {
    res.status(200).json({ success: false, data: 'User not found' });
  }
});

exports.consultation = asyncHandler(async (req, res) => {
  const patient = await Patient.findOne({ _id: req.params.id });
  const a = await EDR.findOne({ patientId: req.params.id });
  if (a !== null) {
    var edr = await EDR.findOne({ patientId: req.params.id }).sort({
      createdAt: 'desc',
    });
  }
  const b = await IPR.findOne({ patientId: req.params.id });
  if (b !== null) {
    var ipr = await IPR.findOne({ patientId: req.params.id }).sort({
      createdAt: 'desc',
    });
  }
  if (a && b) {
    var isafter = moment(edr.createdAt).isAfter(ipr.createdAt);
    if (isafter) {
      var test = edr.consultationNote[edr.consultationNote.length - 1];
      notification(
        'Consultation Request',
        'Consultation Request number ' +
        test.consultationNo +
        ' received for Patient MRN ' +
        patient.profileNo,
        'Consultant/Specialist',
        '/home/rcm/ecr/cn',
        patient._id
      );
      const pat = await EDR.findOne({ patientId: req.params.id });
      globalVariable.io.emit('get_data', pat);
      res.status(200).json({ success: true });
    } else {
      var test = ipr.consultationNote[ipr.consultationNote.length - 1];
      notification(
        'Consultation Request',
        'Consultation Request number ' +
        test.consultationNo +
        ' received for Patient MRN ' +
        patient.profileNo,
        'Consultant/Specialist',
        '/home/rcm/ecr/cn',
        patient._id
      );
      const pat = await IPR.findOne({ patientId: req.params.id });
      globalVariable.io.emit('get_data', pat);
      res.status(200).json({ success: true });
    }
  } else if (a) {
    var test = edr.consultationNote[edr.consultationNote.length - 1];
    notification(
      'Consultation Request',
      'Consultation Request number ' +
      test.consultationNo +
      ' received for Patient MRN ' +
      patient.profileNo,
      'Consultant/Specialist',
      '/home/rcm/ecr/cn',
      patient._id
    );
    const pat = await EDR.findOne({ patientId: req.params.id });
    globalVariable.io.emit('get_data', pat);
    res.status(200).json({ success: true });
  } else if (b) {
    var test = ipr.consultationNote[ipr.consultationNote.length - 1];
    notification(
      'Consultation Request',
      'Consultation Request number ' +
      test.consultationNo +
      ' received for Patient MRN ' +
      patient.profileNo,
      'Consultant/Specialist',
      '/home/rcm/ecr/cn',
      patient._id
    );
    const pat = await IPR.findOne({ patientId: req.params.id });
    globalVariable.io.emit('get_data', pat);
    res.status(200).json({ success: true });
  } else {
    res.status(200).json({ success: false, data: 'User not found' });
  }
});
exports.discharge = asyncHandler(async (req, res) => {
  const patient = await Patient.findOne({ _id: req.params.id });
  notification(
    'Discharge Request',
    'Discharge Request received for Patient MRN ' + patient.profileNo,
    'Pharmacist',
    '/home/rcm/sr/phr/dischargemedication/ipr',
    patient._id
  );
  const a = await EDR.findOne({ patientId: req.params.id });
  if (a !== null) {
    var edr = await EDR.findOne({ patientId: req.params.id }).sort({
      createdAt: 'desc',
    });
  }
  const b = await IPR.findOne({ patientId: req.params.id });
  if (b !== null) {
    var ipr = await IPR.findOne({ patientId: req.params.id }).sort({
      createdAt: 'desc',
    });
  }
  if (a && b) {
    var isafter = moment(edr.createdAt).isAfter(ipr.createdAt);
    if (isafter) {
      const pat = await EDR.findOne({ patientId: req.params.id });
      globalVariable.io.emit('get_data', pat);
    } else {
      const pat = await IPR.findOne({ patientId: req.params.id });
      globalVariable.io.emit('get_data', pat);
    }
  } else if (a) {
    const pat = await EDR.findOne({ patientId: req.params.id });
    globalVariable.io.emit('get_data', pat);
  } else if (b) {
    const pat = await IPR.findOne({ patientId: req.params.id });
    globalVariable.io.emit('get_data', pat);
    res.status(200).json({ success: true });
  } else {
    res.status(200).json({ success: false, data: 'User not found' });
  }
});

exports.getNote = asyncHandler(async (req, res) => {
  const patient = await file.find();
  res.status(200).json({ success: true, data: patient });
});
exports.addNote = asyncHandler(async (req, res) => {
  // var parsed = JSON.parse(req.body.data);
  const patient = await file.create({
    abc: req.file.path,
  });
  res.status(200).json({ success: true, data: patient });
});

exports.triageStatus = asyncHandler(async (req, res) => {
if(req.body.requestType==="EDR")
{
  const edr = await EDR.findOneAndUpdate(
    {_id:req.params.id,'triageAssessment._id':req.body.triageId},
    {$set:{'triageAssessment.$.status':req.body.status,'triageAssessment.$.reason':req.body.reason}},
    {new:true}
    )
    res.status(200).json({success:true, data:edr})
  }
else if(req.body.requestType==="IPR")
{
  const ipr = await IPR.findOneAndUpdate(
    {_id:req.params.id,'triageAssessment._id':req.body.triageId},
    {$set:{'triageAssessment.$.status':req.body.status,'triageAssessment.$.reason':req.body.reason}},
    {new:true}
    )
    res.status(200).json({success:true, data:ipr})
}
});
// exports.createView = asyncHandler(async(req,res)=>{
//   const test = await EDR.createView("first",[
//     {$project:{"requestType":1}}
//   ])
//   console.log(test)
// })
exports.createView = async(req,res)=>{
  const abc =await EDR.find().limit(50)
  res.status(200).json({data:abc})
}