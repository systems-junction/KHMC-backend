const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { v4: uuidv4 } = require('uuid');
const EDR = require('../models/EDR');
const requestNoFormat = require('dateformat');

exports.getEDR = asyncHandler(async (req, res) => {
  const edr = await EDR.find()
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
    .populate('triageAssessment.requester');
  res.status(200).json({ success: true, data: edr });
});

exports.getPHREDR = asyncHandler(async (req, res) => {
  const edr = await EDR.find({ pharmacyRequest: { $ne: [] } })
    .populate('patientId')
    .populate('pharmacyRequest.requester')
    .populate('pharmacyRequest.medicine.itemId')
    .select({ pharmacyRequest: 1, requestNo: 1 });
  var data = [];
  for (let i = 0; i < edr.length; i++) {
    let pr = edr[i].pharmacyRequest;
    for (let j = 0; j < pr.length; j++) {
      let temp = JSON.parse(JSON.stringify(pr[j]));
      var obj = {
        ...temp,
        edrId: edr[i],
        patientData: edr[i].patientId,
      };
      data.push(obj);
    }
  }
  res.status(200).json({ success: true, data: data });
});

exports.getDischargeEDR = asyncHandler(async (req, res) => {
  const edr = await EDR.find({
    'dischargeRequest.dischargeMedication.medicine': { $ne: [] },
  })
    .populate('patientId')
    .populate('dischargeRequest.dischargeMedication.medicine.itemId')
    .select({ dischargeRequest: 1, requestNo: 1 });
  res.status(200).json({ success: true, data: edr });
});

exports.getDischargeEDRById = asyncHandler(async (req, res) => {
  const edr = await EDR.findOne({ _id: req.params._id })
    .populate('patientId')
    .populate('dischargeRequest.dischargeMedication.medicine.itemId')
    .select({ dischargeRequest: 1, requestNo: 1 });
  res.status(200).json({ success: true, data: edr });
});
exports.putDischargeEDRById = asyncHandler(async (req, res) => {
  const edr = await EDR.findOneAndUpdate(
    { _id: req.body._id },
    { $set: { 'dischargeRequest.status': req.body.status } },
    { new: true }
  )
    .populate('dischargeRequest.dischargeMedication.medicine.itemId')
    .select({ dischargeRequest: 1 });
  res.status(200).json({ success: true, data: edr });
});
exports.getRREDR = asyncHandler(async (req, res) => {
  const edr = await EDR.find({ radiologyRequest: { $ne: [] } })
    .populate('patientId')
    .populate('radiologyRequest.requester')
    .populate('radiologyRequest.serviceId')
    .select({ radiologyRequest: 1, requestNo: 1 });
  var data = [];
  for (let i = 0; i < edr.length; i++) {
    let rr = edr[i].radiologyRequest;
    for (let j = 0; j < rr.length; j++) {
      let temp = JSON.parse(JSON.stringify(rr[j]));
      var obj = {
        ...temp,
        edrId: edr[i],
        patientData: edr[i].patientId,
      };
      data.push(obj);
    }
  }
  res.status(200).json({ success: true, data: data });
});

exports.getLREDR = asyncHandler(async (req, res) => {
  const edr = await EDR.find({ labRequest: { $ne: [] } })
    .populate('patientId')
    .populate('labRequest.requester')
    .populate('labRequest.serviceId')
    .select({ labRequest: 1, requestNo: 1 });
  var data = [];
  for (let i = 0; i < edr.length; i++) {
    let lr = edr[i].labRequest;
    for (let j = 0; j < lr.length; j++) {
      let temp = JSON.parse(JSON.stringify(lr[j]));
      var obj = {
        ...temp,
        edrId: edr[i],
        patientData: edr[i].patientId,
      };
      data.push(obj);
    }
  }
  res.status(200).json({ success: true, data: data });
});

exports.getLREDRById = asyncHandler(async (req, res) => {
  const edr = await EDR.findOne({ 'labRequest._id': req.params._id })
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

exports.getRREDRById = asyncHandler(async (req, res) => {
  const edr = await EDR.findOne({ 'radiologyRequest._id': req.params._id })
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

exports.putRREDRById = asyncHandler(async (req, res) => {
  // const edr = await EDR.findOneAndUpdate({'radiologyRequest._id': req.body._id},{ $set: { 'radiologyRequest.$.status': req.body.status }},{new: true})
  // .populate('radiologyRequest.requester')
  // .populate('radiologyRequest.serviceId').select({radiologyRequest:1})
  //  res.status(200).json({ success: true, data: edr });

  var data = JSON.parse(req.body.data);
  if (req.file) {
    await EDR.findOneAndUpdate(
      { 'radiologyRequest._id': data.radiologyRequestId, _id: data.EDRId },
      data
    );
    await EDR.findOneAndUpdate(
      { 'radiologyRequest._id': data.radiologyRequestId, _id: data.EDRId },
      { $set: { 'radiologyRequest.$.results': req.file.path } },
      { new: true }
    );
    await EDR.findOneAndUpdate(
      { 'radiologyRequest._id': data.radiologyRequestId, _id: data.EDRId },
      { $set: { 'radiologyRequest.$.status': data.status } },
      { new: true }
    );
  } else {
    await EDR.findOneAndUpdate(
      { 'radiologyRequest._id': data.radiologyRequestId, _id: data.EDRId },
      data
    );
    await EDR.findOneAndUpdate(
      { 'radiologyRequest._id': data.radiologyRequestId, _id: data.EDRId },
      { $set: { 'radiologyRequest.$.status': data.status } },
      { new: true }
    );
  }
  res.status(200).json({ success: true });
});

exports.getPHREDRById = asyncHandler(async (req, res) => {
  const edr = await EDR.findOne({ 'pharmacyRequest._id': req.params._id })
    .populate('pharmacyRequest.requester')
    .populate('pharmacyRequest.medicine.itemId')
    .select({ pharmacyRequest: 1 });
  for (let i = 0; i < edr.pharmacyRequest.length; i++) {
    if (edr.pharmacyRequest[i]._id == req.params._id) {
      var lab = edr.pharmacyRequest[i];
    }
  }
  res.status(200).json({ success: true, data: lab });
});

exports.putPHREDRById = asyncHandler(async (req, res) => {
  const edr = await EDR.findOneAndUpdate(
    { 'pharmacyRequest._id': req.body._id },
    { $set: { 'pharmacyRequest.$.status': req.body.status } },
    { new: true }
  )
    .populate('pharmacyRequest.requester')
    .populate('pharmacyRequest.medicine.itemId')
    .select({ pharmacyRequest: 1 });
  res.status(200).json({ success: true, data: edr });
});

exports.getEDRById = asyncHandler(async (req, res) => {
  const edr = await EDR.find({ _id: req.params._id })
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
    .populate('dischargeRequest.dischargeMedication.medicine.itemId');
  res.status(200).json({ success: true, data: edr });
});

exports.addEDR = asyncHandler(async (req, res) => {
  const {
    patientId,
    generatedBy,
    consultationNote,
    residentNotes,
    pharmacyRequest,
    labRequest,
    radiologyRequest,
    dischargeRequest,
    status,
    triageAssessment,
  } = req.body;
    var now = new Date();
    var start = new Date(now.getFullYear(), 0, 0);
    var diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
    var oneDay = 1000 * 60 * 60 * 24;
    var day = Math.floor(diff / oneDay);
  const edr = await EDR.create({
    requestNo: 'EDR' + day + requestNoFormat(new Date(), 'yyHHMM'),
    patientId,
    generatedBy,
    consultationNote,
    residentNotes,
    pharmacyRequest,
    labRequest,
    radiologyRequest,
    dischargeRequest,
    status,
    triageAssessment,
  });
  res.status(200).json({ success: true, data: edr });
});

exports.deleteEDR = asyncHandler(async (req, res, next) => {
  const { _id } = req.params;
  const edr = await EDR.findById(_id);
  if (!edr) {
    return next(new ErrorResponse(`EDR not found with id of ${_id}`, 404));
  }
  await EDR.deleteOne({ _id: _id });
});

exports.updateEDR = asyncHandler(async (req, res, next) => {
  const { _id } = req.body;
  let edr = await EDR.findById(_id);
  if (!edr) {
    return next(new ErrorResponse(`EDR not found with id of ${_id}`, 404));
  }
  edr = await EDR.updateOne({ _id: _id }, req.body);
  res.status(200).json({ success: true, data: edr });
});

exports.addLabRequest = asyncHandler(async (req, res) => {
  var data = JSON.parse(req.body.data);
  if (req.file) {
    await EDR.findOneAndUpdate(
      { 'labRequest._id': data.labRequestId, _id: data.EDRId },
      data
    );
    await EDR.findOneAndUpdate(
      { 'labRequest._id': data.labRequestId, _id: data.EDRId },
      { $set: { 'labRequest.$.results': req.file.path } },
      { new: true }
    );
    await EDR.findOneAndUpdate(
      { 'labRequest._id': data.labRequestId, _id: data.EDRId },
      { $set: { 'labRequest.$.status': data.status } },
      { new: true }
    );
  } else {
    await EDR.findOneAndUpdate(
      { 'labRequest._id': data.labRequestId, _id: data.EDRId },
      data
    );
    await EDR.findOneAndUpdate(
      { 'labRequest._id': data.labRequestId, _id: data.EDRId },
      { $set: { 'labRequest.$.status': data.status } },
      { new: true }
    );
  }
  res.status(200).json({ success: true });
});

exports.putLREDRById = asyncHandler(async (req, res) => {
  var data = JSON.parse(req.body.data);
  if (req.file) {
    await EDR.findOneAndUpdate(
      { 'labRequest._id': data.labRequestId, _id: data.EDRId },
      data
    );
    await EDR.findOneAndUpdate(
      { 'labRequest._id': data.labRequestId, _id: data.EDRId },
      { $set: { 'labRequest.$.results': req.file.path } },
      { new: true }
    );
    await EDR.findOneAndUpdate(
      { 'labRequest._id': data.labRequestId, _id: data.EDRId },
      { $set: { 'labRequest.$.status': data.status } },
      { new: true }
    );
  } else {
    await EDR.findOneAndUpdate(
      { 'labRequest._id': data.labRequestId, _id: data.EDRId },
      data
    );
    await EDR.findOneAndUpdate(
      { 'labRequest._id': data.labRequestId, _id: data.EDRId },
      { $set: { 'labRequest.$.status': data.status } },
      { new: true }
    );
  }
  res.status(200).json({ success: true });
  // const edr = await EDR.findOneAndUpdate({'labRequest._id': req.body._id},{ $set: { 'labRequest.$.status': req.body.status }},{new: true})
  // .populate('labRequest.requester')
  // .populate('labRequest.serviceId').select({labRequest:1})
  //  res.status(200).json({ success: true, data: edr });
});

exports.addRadiologyRequest = asyncHandler(async (req, res) => {
  var data = JSON.parse(req.body.data);
  if (req.file) {
    await EDR.findOneAndUpdate(
      { 'radiologyRequest._id': data.radiologyRequestId, _id: data.EDRId },
      data
    );
    await EDR.findOneAndUpdate(
      { 'radiologyRequest._id': data.radiologyRequestId, _id: data.EDRId },
      { $set: { 'radiologyRequest.$.results': req.file.path } },
      { new: true }
    );
  } else {
    await EDR.findOneAndUpdate(
      { 'radiologyRequest._id': data.radiologyRequestId, _id: data.EDRId },
      data
    );
  }
  res.status(200).json({ success: true });
});
