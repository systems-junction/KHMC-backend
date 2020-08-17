const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { v4: uuidv4 } = require('uuid');
const IPR = require('../models/IPR');

exports.getIPR = asyncHandler(async (req, res) => {
  const ipr = await IPR.find()
  .populate('patientId')
  .populate('consultationNote.requester')
  .populate('pharmacyRequest.requester').populate('pharmacyRequest.medicine.itemId')
  .populate('labRequest.requester').populate('labRequest.serviceId')
  .populate('radiologyRequest.serviceId').populate('radiologyRequest.requester')
  .populate('residentNotes.doctor').populate('residentNotes.doctorRef')
  .populate('nurseService.serviceId').populate('nurseService.requester')
  .populate('dischargeRequest.dischargeMedication.requester').populate('dischargeRequest.dischargeMedication.medicine.itemId')
  res.status(200).json({ success: true, data: ipr });
});
exports.getPHRIPR = asyncHandler(async (req, res) => {
  const ipr = await IPR.find({pharmacyRequest : {$ne:[]}}).populate('patientId').populate('pharmacyRequest.requester')
  .populate('pharmacyRequest.medicine.itemId').select({pharmacyRequest:1, requestNo:1})
  var data=[];
  for(let i=0; i<ipr.length; i++)
  {
    let pr = ipr[i].pharmacyRequest
    for(let j=0;j<pr.length; j++)
    {
      let temp = JSON.parse(JSON.stringify(pr[j]))
      var obj ={
        ...temp,
        iprId: ipr[i],
        patientData:ipr[i].patientId
      }
      data.push(obj)
    }
  }
  res.status(200).json({ success: true, data: data });
});
exports.getPHRIPRById = asyncHandler(async (req, res) => {
  const ipr = await IPR.findOne({'pharmacyRequest._id':req.params._id}).populate('pharmacyRequest.requester').populate('pharmacyRequest.medicine.itemId').select({pharmacyRequest:1})
  for(let i = 0 ; i < ipr.pharmacyRequest.length; i++)
  {
    if(ipr.pharmacyRequest[i]._id == req.params._id)
    {
      var lab = ipr.pharmacyRequest[i]
    }
  }
   res.status(200).json({ success: true, data: lab });
});

exports.putPHRIPRById = asyncHandler(async (req, res) => {
  const ipr = await IPR.findOneAndUpdate({'pharmacyRequest._id': req.body._id},{ $set: { 'pharmacyRequest.$.status': req.body.status }},{new: true})
  .populate('pharmacyRequest.requester').populate('pharmacyRequest.medicine.itemId')
  .select({pharmacyRequest:1})
   res.status(200).json({ success: true, data: ipr });
});

exports.getDischargeIPR = asyncHandler(async (req, res) => {
  const ipr = await IPR.find({'dischargeRequest.dischargeMedication.medicine' : {$ne:[]}}).populate('patientId')
  .populate('dischargeRequest.dischargeMedication.medicine.itemId').select({dischargeRequest:1, requestNo:1})
  res.status(200).json({ success: true, data: ipr });
});

exports.getDischargeIPRById = asyncHandler(async (req, res) => {
  const ipr = await IPR.findOne({_id:req.params._id}).populate('patientId')
  .populate('dischargeRequest.dischargeMedication.medicine.itemId').select({dischargeRequest:1, requestNo:1})
  res.status(200).json({ success: true, data: ipr });
});

exports.putDischargeIPRById = asyncHandler(async (req, res) => {
  const ipr = await IPR.findOneAndUpdate({_id: req.body._id},{ $set: { 'dischargeRequest.status': req.body.status }},{new: true})
  .populate('dischargeRequest.dischargeMedication.medicine.itemId')
  .select({dischargeRequest:1})
   res.status(200).json({ success: true, data: ipr });
});

exports.getRRIPR = asyncHandler(async (req, res) => {
  const ipr = await IPR.find({radiologyRequest : {$ne:[]}}).populate('patientId').populate('radiologyRequest.requester')
  .populate('radiologyRequest.serviceId').select({radiologyRequest:1, requestNo:1})
  var data=[];
  for(let i=0; i<ipr.length; i++)
  {
    let rr = ipr[i].radiologyRequest
    for(let j=0;j<rr.length; j++)
    {
      let temp = JSON.parse(JSON.stringify(rr[j]))
      var obj ={
        ...temp,
        iprId: ipr[i],
        patientData:ipr[i].patientId
      }
      data.push(obj)
    }
  }
  res.status(200).json({ success: true, data: data });
});
exports.getRRIPRById = asyncHandler(async (req, res) => {
  const ipr = await IPR.findOne({'radiologyRequest._id':req.params._id}).populate('radiologyRequest.requester')
  .populate('radiologyRequest.serviceId').select({radiologyRequest:1})
  for(let i = 0 ; i < ipr.radiologyRequest.length; i++)
  {
    if(ipr.radiologyRequest[i]._id == req.params._id)
    {
      var lab = ipr.radiologyRequest[i]
    }
  }
   res.status(200).json({ success: true, data: lab });
});

exports.putRRIPRById = asyncHandler(async (req, res) => {
  const ipr = await IPR.findOneAndUpdate({'radiologyRequest._id': req.body._id},{ $set: { 'radiologyRequest.$.status': req.body.status }},{new: true})
  .populate('radiologyRequest.requester')
  .populate('radiologyRequest.serviceId').select({radiologyRequest:1})
   res.status(200).json({ success: true, data: ipr });
});
exports.getLRIPR = asyncHandler(async (req, res) => {
  const ipr = await IPR.find({labRequest : {$ne:[]}}).populate('patientId').populate('labRequest.requester')
  .populate('labRequest.serviceId').select({labRequest:1, requestNo:1})
  var data=[];
  for(let i=0; i<ipr.length; i++)
  {
    let lr = ipr[i].labRequest
    for(let j=0;j<lr.length; j++)
    {
      let temp = JSON.parse(JSON.stringify(lr[j]))
      var obj ={
        ...temp,
        iprId: ipr[i],
        patientData:ipr[i].patientId
      }
      data.push(obj)
    }
  }
  res.status(200).json({ success: true, data: data });
});

exports.getLRIPRById = asyncHandler(async (req, res) => {
  const ipr = await IPR.findOne({'labRequest._id':req.params._id}).populate('labRequest.requester')
  .populate('labRequest.serviceId').select({labRequest:1})
  for(let i = 0 ; i < ipr.labRequest.length; i++)
  {
    if(ipr.labRequest[i]._id == req.params._id)
    {
      var lab = ipr.labRequest[i]
    }
  }
   res.status(200).json({ success: true, data: lab });
});

exports.putLRIPRById = asyncHandler(async (req, res) => {
  const ipr = await IPR.findOneAndUpdate({'labRequest._id': req.body._id},{ $set: { 'labRequest.$.status': req.body.status }},{new: true})
  .populate('labRequest.requester')
  .populate('labRequest.serviceId').select({labRequest:1})
   res.status(200).json({ success: true, data: ipr });
});

exports.getIPRById = asyncHandler(async (req, res) => {
    const ipr = await IPR.find({_id:req.params._id}).populate('patientId').populate('consultationNote.requester')
    .populate('pharmacyRequest.requester').populate('pharmacyRequest.medicine.itemId').populate('labRequest.requester').populate('labRequest.serviceId')
    .populate('radiologyRequest.serviceId').populate('radiologyRequest.requester').populate('residentNotes.doctor')
    .populate('residentNotes.doctorRef').populate('nurseService.serviceId').populate('nurseService.requester')
    .populate('dischargeRequest.dischargeMedication.requester').populate('dischargeRequest.dischargeMedication.medicine.itemId')
    res.status(200).json({ success: true, data: ipr });
  });

exports.addIPR = asyncHandler(async (req, res) => {
  const {  patientId, generatedBy, consultationNote, residentNotes, pharmacyRequest, labRequest, radiologyRequest, nurseService,followUp,
    dischargeRequest, status, triageAssessment } = req.body;
  const ipr = await IPR.create({
    requestNo:uuidv4(),
    patientId,
    generatedBy,
    consultationNote,
    residentNotes,
    pharmacyRequest,   
    labRequest,
    radiologyRequest,
    dischargeRequest,
    nurseService,
    followUp,
    status,
    triageAssessment,
  });
  res.status(200).json({ success: true, data: ipr });
});

exports.deleteIPR = asyncHandler(async (req, res, next) => {
  const { _id } = req.params;
  const ipr = await IPR.findById(_id);
  if (!ipr) {
    return next(
      new ErrorResponse(`IPR not found with id of ${_id}`, 404)
    );
  }
  await IPR.deleteOne({ _id: _id });
});

exports.updateIPR = asyncHandler(async (req, res, next) => {
  const { _id } = req.body;
  let ipr = await IPR.findById(_id);
  if (!ipr) {
    return next(
      new ErrorResponse(`IPR not found with id of ${_id}`, 404)
    );
  }
  ipr = await IPR.updateOne({ _id: _id }, req.body);
  res.status(200).json({ success: true, data: ipr });
});
exports.addFollowUp = asyncHandler(async(req,res) =>{
  if (req.file) {
    await IPR.updateOne({'followUp._id': req.body._id }, JSON.parse(req.body.followUp));
    await IPR.updateOne({'followUp._id': req.body._id},{ $set: { 'followUp.$.file': req.file.path }},{new: true})
  } else {
    await IPR.updateOne({ 'followUp._id': req.body._id }, JSON.parse(req.body.followUp));
  }
  res.status(200).json({success:true})
  })