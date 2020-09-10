const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const notification = require('../components/notification');
const Patient = require('../models/patient');
const PatientFHIR = require('../models/patientFHIR/patientFHIR');
const IPR = require('../models/IPR');
const EDR = require('../models/EDR');
const moment = require('moment');
exports.getPatient = asyncHandler(async (req, res) => {
  const patient = await Patient.find().populate('receivedBy');
  res.status(200).json({ success: true, data: patient });
});
exports.getPatientEDR = asyncHandler(async (req, res) => {
  const patient = await Patient.find({ registeredIn: 'EDR' }).populate(
    'receivedBy'
  );
  res.status(200).json({ success: true, data: patient });
});
exports.getPatientIPR = asyncHandler(async (req, res) => {
  const patient = await Patient.find({ registeredIn: 'IPR' }).populate(
    'receivedBy'
  );
  res.status(200).json({ success: true, data: patient });
});
exports.getPatientById = asyncHandler(async (req, res) => {
  const patient = await Patient.find({ _id: req.params.id }).populate(
    'receivedBy'
  );
  res.status(200).json({ success: true, data: patient });
});
exports.getPatientBySIN = asyncHandler(async (req, res) => {
  const patient = await Patient.find({ SIN: req.params.SIN }).populate(
    'receivedBy'
  );
  res.status(200).json({ success: true, data: patient });
});
exports.getPatientByMRN = asyncHandler(async (req, res) => {
  const patient = await Patient.find({
    profileNo: req.params.profileNo,
  }).populate('receivedBy');
  res.status(200).json({ success: true, data: patient });
});
exports.addPatient = asyncHandler(async (req, res) => {
  const {
    profileNo,
    SIN,
    title,
    firstName,
    lastName,
    fullName,
    gender,
    nationality,
    dob,
    drugAllergy,
    phoneNumber,
    mobileNumber,
    email,
    country,
    city,
    address,
    otherDetails,
    paymentMethod,
    depositAmount,
    amountReceived,
    bankName,
    depositorName,
    age,
    height,
    weight,
    bloodGroup,
    // insuranceId,
    coverageDetails,
    coverageTerms,
    payment,
    registeredIn,
    receivedBy,
    insuranceNo,
    insuranceVendor,
    emergencyName,
    emergencyContactNo,
    emergencyRelation,
    coveredFamilyMembers,
    otherCoverageDetails,
  } = req.body.data;
  var parsed = JSON.parse(req.body.data);
  var patient;
  if (req.file) {
    patient = await Patient.create({
      profileNo: parsed.profileNo,
      SIN: parsed.SIN,
      title: parsed.title,
      firstName: parsed.firstName,
      lastName: parsed.lastName,
      fullName:parsed.firstName+" "+parsed.lastName,
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
    });
  } else {
    patient = await Patient.create({
      profileNo: parsed.profileNo,
      SIN: parsed.SIN,
      title: parsed.title,
      firstName: parsed.firstName,
      lastName: parsed.lastName,
      fullName:parsed.firstName+" "+parsed.lastName,
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
    });
  }
  notification(
    'Patient',
    'A new Patient with MRN ' + patient.profileNo + ' has been registered ',
    'Registered Nurse'
  );
  const pat = await Patient.find().populate('receivedBy');
  globalVariable.io.emit('get_data', pat);
  res.status(200).json({ success: true, data: patient });
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
  } else {
    patient = await Patient.findOneAndUpdate(
      { _id: _id },
      JSON.parse(req.body.data),
      { new: true }
    );
  }
  res.status(200).json({ success: true, data: patient });
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
  console.log('patientfhir', patientfhir);
  res.status(200).json({ success: true, data: patientfhir });
});
exports.searchPatient = asyncHandler(async (req, res) => {
  const a = await EDR.findOne({ patientId: req.params._id });
  if (a !== null) {
    var edr = await EDR.findOne({ patientId: req.params._id })
      .populate('patientId')
      .populate('consultationNote.requester')
      .populate('pharmacyRequest.requester')
      .populate('pharmacyRequest.medicine.itemId')
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
      });
  }
  const b = await IPR.findOne({ patientId: req.params._id });
  if (b !== null) {
    var ipr = await IPR.findOne({ patientId: req.params._id })
      .populate('patientId')
      .populate('consultationNote.requester')
      .populate('pharmacyRequest.requester')
      .populate('pharmacyRequest.medicine.itemId')
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
      });
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
    edr = await EDR.findOneAndUpdate({ _id: _id }, req.body,{ new: true });
    res.status(200).json({ success: true, data: edr });
  }
  if (requestType === 'IPR') {
    let ipr = await IPR.findById(_id);
    if (!ipr) {
      return next(new ErrorResponse(`IPR not found with id of ${_id}`, 404));
    }
    ipr = await IPR.findOneAndUpdate({ _id: _id }, req.body,{ new: true });
    res.status(200).json({ success: true, data: ipr });
  }
});

exports.updateEdrIprItem = asyncHandler(async (req, res) => {
  var { id, itemID, requestType, status } = req.body;
  var not;
  if (requestType === 'EDR') {
    not = await EDR.findOneAndUpdate(
      { 'consultationNote._id': itemID, _id: id },
      { $set: { 'consultationNote.$.status': status } },
      { new: true }
    );
    notification(
      'Consultation Request',
      'Consultation Request number ' +
        itemID +
        ' has been by the consultant for Patient MRN ' +
        not.patientId.profileNo,
      'Doctor/Physician'
    );
    const pat = await EDR.findOne({ patientId: not.patientId });
    globalVariable.io.emit('get_data', pat);
  }
  if (requestType === 'IPR') {
    not = await IPR.findOneAndUpdate(
      { 'consultationNote._id': itemID, _id: id },
      { $set: { 'consultationNote.$.status': status } },
      { new: true }
    );
    notification(
      'Consultation Request',
      'Consultation Request number ' +
        itemID +
        ' has been by the consultant for Patient MRN ' +
        not.patientId.profileNo,
      'Doctor/Physician'
    );
    const pat = await IPR.findOne({ patientId: not.patientId });
    globalVariable.io.emit('get_data', pat);
  }
  res.status(200).json({ success: true });
});

exports.triage = asyncHandler(async (req, res) => {
  const patient = await Patient.findOne({ _id: req.params.id });
  notification(
    'Patient',
    'A Patient with MRN ' +
      patient.profileNo +
      ' has been registered with Triage Level',
    'Doctor/Physician'
  );
  const pat = await Patient.find().populate('receivedBy');
  globalVariable.io.emit('get_data', pat);
});

exports.pharmacy = asyncHandler(async (req, res) => {
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
      var test = edr.pharmacyRequest[edr.pharmacyRequest.length - 1];
      notification(
        'Pharmacy Request',
        'Pharmacy Request number ' +
          test._id +
          ' received for Patient MRN ' +
          patient.profileNo,
        'Pharmacist'
      );
      const pat = await EDR.findOne({ patientId: req.params.id });
      globalVariable.io.emit('get_data', pat);
      res.status(200).json({ success: true });
    } else {
      var test = ipr.pharmacyRequest[ipr.pharmacyRequest.length - 1];
      notification(
        'Pharmacy Request',
        'Pharmacy Request number ' +
          test._id +
          ' received for Patient MRN ' +
          patient.profileNo,
        'Pharmacist'
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
        test._id +
        ' received for Patient MRN ' +
        patient.profileNo,
      'Pharmacist'
    );
    const pat = await EDR.findOne({ patientId: req.params.id });
    globalVariable.io.emit('get_data', pat);
    res.status(200).json({ success: true });
  } else if (b) {
    var test = ipr.pharmacyRequest[ipr.pharmacyRequest.length - 1];
    notification(
      'Pharmacy Request',
      'Pharmacy Request number ' +
        test._id +
        ' received for Patient MRN ' +
        patient.profileNo,
      'Pharmacist'
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
          test._id +
          ' received for Patient MRN ' +
          patient.profileNo,
        'Lab Technician'
      );
      const pat = await EDR.findOne({ patientId: req.params.id });
      globalVariable.io.emit('get_data', pat);
      res.status(200).json({ success: true });
    } else {
      var test = ipr.labRequest[ipr.labRequest.length - 1];
      notification(
        'Laboratory Request',
        'Laboratory Request number ' +
          test._id +
          ' received for Patient MRN ' +
          patient.profileNo,
        'Lab Technician'
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
        test._id +
        ' received for Patient MRN ' +
        patient.profileNo,
      'Lab Technician'
    );
    const pat = await EDR.findOne({ patientId: req.params.id });
    globalVariable.io.emit('get_data', pat);
    res.status(200).json({ success: true });
  } else if (b) {
    var test = ipr.labRequest[ipr.labRequest.length - 1];
    notification(
      'Laboratory Request',
      'Laboratory Request number ' +
        test._id +
        ' received for Patient MRN ' +
        patient.profileNo,
      'Lab Technician'
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
          test._id +
          ' received for Patient MRN ' +
          patient.profileNo,
        'Radiology/Imaging'
      );
      const pat = await EDR.findOne({ patientId: req.params.id });
      globalVariable.io.emit('get_data', pat);
      res.status(200).json({ success: true });
    } else {
      var test = ipr.radiologyRequest[ipr.radiologyRequest.length - 1];
      notification(
        'Radiology Request',
        'Radiology Request number ' +
          test._id +
          ' received for Patient MRN ' +
          patient.profileNo,
        'Radiology/Imaging'
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
        test._id +
        ' received for Patient MRN ' +
        patient.profileNo,
      'Radiology/Imaging'
    );
    const pat = await EDR.findOne({ patientId: req.params.id });
    globalVariable.io.emit('get_data', pat);
    res.status(200).json({ success: true });
  } else if (b) {
    var test = ipr.radiologyRequest[ipr.radiologyRequest.length - 1];
    notification(
      'Radiology Request',
      'Radiology Request number ' +
        test._id +
        ' received for Patient MRN ' +
        patient.profileNo,
      'Radiology/Imaging'
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
          test._id +
          ' received for Patient MRN ' +
          patient.profileNo,
        'Consultant/Specialist'
      );
      const pat = await EDR.findOne({ patientId: req.params.id });
      globalVariable.io.emit('get_data', pat);
      res.status(200).json({ success: true });
    } else {
      var test = ipr.consultationNote[ipr.consultationNote.length - 1];
      notification(
        'Consultation Request',
        'Consultation Request number ' +
          test._id +
          ' received for Patient MRN ' +
          patient.profileNo,
        'Consultant/Specialist'
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
        test._id +
        ' received for Patient MRN ' +
        patient.profileNo,
      'Consultant/Specialist'
    );
    const pat = await EDR.findOne({ patientId: req.params.id });
    globalVariable.io.emit('get_data', pat);
    res.status(200).json({ success: true });
  } else if (b) {
    var test = ipr.consultationNote[ipr.consultationNote.length - 1];
    notification(
      'Consultation Request',
      'Consultation Request number ' +
        test._id +
        ' received for Patient MRN ' +
        patient.profileNo,
      'Consultant/Specialist'
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
          test._id +
          ' received for Patient MRN ' +
          patient.profileNo,
        'Consultant/Specialist'
      );
      const pat = await EDR.findOne({ patientId: req.params.id });
      globalVariable.io.emit('get_data', pat);
      res.status(200).json({ success: true });
    } else {
      var test = ipr.consultationNote[ipr.consultationNote.length - 1];
      notification(
        'Consultation Request',
        'Consultation Request number ' +
          test._id +
          ' received for Patient MRN ' +
          patient.profileNo,
        'Consultant/Specialist'
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
        test._id +
        ' received for Patient MRN ' +
        patient.profileNo,
      'Consultant/Specialist'
    );
    const pat = await EDR.findOne({ patientId: req.params.id });
    globalVariable.io.emit('get_data', pat);
    res.status(200).json({ success: true });
  } else if (b) {
    var test = ipr.consultationNote[ipr.consultationNote.length - 1];
    notification(
      'Consultation Request',
      'Consultation Request number ' +
        test._id +
        ' received for Patient MRN ' +
        patient.profileNo,
      'Consultant/Specialist'
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
    'Pharmacist'
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
