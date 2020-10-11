const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { v4: uuidv4 } = require('uuid');
const PAR = require('../models/par');
const EDR = require('../models/EDR');
const IPR = require('../models/IPR');
const requestNoFormat = require('dateformat');

exports.getEDRandIPR = asyncHandler(async (req, res) => {
  const edr = await EDR.find({
    $or: [
      { 'labRequest': { $ne: [] }},
      { 'radiologyRequest': {$ne: [] }},
      { 'pharmacyRequest': {$ne: [] } }
    ],paymentMethod:"Insurance"
  })
    .populate('patientId')
    .populate('consultationNote.requester')
    .populate({
      path : 'pharmacyRequest',
      populate: [{
         path : 'item.itemId'}]
    })
    .populate('labRequest.requester')
    .populate('labRequest.serviceId')
    .populate('radiologyRequest.serviceId')
    .populate('radiologyRequest.requester')
    .populate('residentNotes.doctor')
    .populate('residentNotes.doctorRef')
    .populate('dischargeRequest.dischargeMedication.requester')
    .populate('dischargeRequest.dischargeMedication.medicine.itemId');
  const ipr = await IPR.find({
    $or: [
      { 'labRequest': { $ne: [] }},
      { 'radiologyRequest': {$ne: [] }},
      { 'pharmacyRequest': {$ne: [] } }
    ],paymentMethod:"Insurance"
  })
    .populate('patientId')
    .populate('consultationNote.requester')
    .populate({
      path : 'pharmacyRequest',
      populate: [{
         path : 'item.itemId'}]
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
    .populate('dischargeRequest.dischargeMedication.medicine.itemId');
    var dataF = [edr.concat(ipr)];
    var data = dataF[0]
    res.status(200).json({ success: true, data: data });
});
exports.getEDRandIPRKeyword = asyncHandler(async (req, res) => {
  const edr = await EDR.find({
    $or: [
      { 'labRequest': { $ne: [] }},
      { 'radiologyRequest': {$ne: [] }},
      { 'pharmacyRequest': {$ne: [] } }
    ],paymentMethod:"Insurance"
  })
    .populate('patientId')
    .populate('consultationNote.requester')
    .populate({
      path : 'pharmacyRequest',
      populate: [{
         path : 'item.itemId'}]
    })
    .populate('labRequest.requester')
    .populate('labRequest.serviceId')
    .populate('radiologyRequest.serviceId')
    .populate('radiologyRequest.requester')
    .populate('residentNotes.doctor')
    .populate('residentNotes.doctorRef')
    .populate('dischargeRequest.dischargeMedication.requester')
    .populate('dischargeRequest.dischargeMedication.medicine.itemId');
  const ipr = await IPR.find({
    $or: [
      { 'labRequest': { $ne: [] }},
      { 'radiologyRequest': {$ne: [] }},
      { 'pharmacyRequest': {$ne: [] } }
    ],paymentMethod:"Insurance"
  })
    .populate('patientId')
    .populate('consultationNote.requester')
    .populate({
      path : 'pharmacyRequest',
      populate: [{
         path : 'item.itemId'}]
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
    .populate('dischargeRequest.dischargeMedication.medicine.itemId');
    var dataF = [edr.concat(ipr)];
    var data = dataF[0]
    var arr=[];
    for(let i = 0; i<data.length; i++)
    {
       if(
      (data[i].patientId.profileNo && data[i].patientId.profileNo.toLowerCase().match(req.params.keyword.toLowerCase()))||
       data[i].requestNo && data[i].requestNo.toLowerCase().match(req.params.keyword.toLowerCase())
      )
      {
        arr.push(data[i])
      }
    }
    res.status(200).json({ success: true, data: arr });
});

exports.addPAR = asyncHandler(async (req, res) => {
  const {
    edrId,
    iprId,
    // oprId,
    generatedBy,
    patient,
    pharId,
    lrId,
    rrId,
    nsId,
    generatedFrom,
    generatedFromSub,
    approvalNo,
    approvalPerson,
    comments,
    coPayment,
    netPayment,
    status,
  } = req.body;
  const par = await PAR.create({
    requestNo: 'PA' + requestNoFormat(new Date(), 'mmddyyHHmm'),
    edrId,
    iprId,
    // oprId,
    generatedBy,
    patient,
    pharId,
    lrId,
    rrId,
    nsId,
    generatedFrom,
    generatedFromSub,
    approvalNo,
    approvalPerson,
    comments,
    coPayment,
    netPayment,
    status,
  });
  res.status(200).json({ success: true, data: par });
});

exports.updatePAR = asyncHandler(async (req, res, next) => {
  const { _id } = req.body;
  let par = await PAR.findById(_id);
  if (!par) {
    return next(new ErrorResponse(`PAR not found with id of ${_id}`, 404));
  }
  par = await PAR.updateOne({ _id: _id }, req.body);
  res.status(200).json({ success: true, data: par });
});
