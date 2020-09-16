const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { v4: uuidv4 } = require('uuid');
const EDR = require('../models/EDR');
const IPR = require('../models/IPR');
const RC = require('../models/reimbursementClaim');
const Patient = require('../models/patient');
const requestNoFormat = require('dateformat');

exports.getClaims = asyncHandler(async (req, res) => {
  const rc = await RC.find()
    .populate('generatedBy')
    .populate('patient')
    .populate('insurer');
  res.status(200).json({ success: true, data: rc });
});

exports.getPatient = asyncHandler(async (req, res) => {
  var array=[]
  var array2=[]
  const ipr = await IPR.find({}).populate('patientId')
    for(let i = 0; i<ipr.length; i++)
    {
        array.push(ipr[i].patientId) 
    }
  const edr = await EDR.find({}).populate('patientId')
    for(let i = 0; i<edr.length; i++)
    {
        array.push(edr[i].patientId)
    }
    const unique = Array.from(new Set(array)) 
    for(let i = 0; i<unique.length; i++)
    {

      if((unique[i].profileNo && unique[i].profileNo.startsWith(req.params.keyword))||(unique[i].firstName && unique[i].firstName.startsWith(req.params.keyword))||(unique[i].lastName && unique[i].lastName.startsWith(req.params.keyword))||(unique[i].phoneNumber && unique[i].phoneNumber.startsWith(req.params.keyword))||(unique[i].SIN && unique[i].SIN.startsWith(req.params.keyword))||(unique[i].mobileNumber && unique[i].mobileNumber.startsWith(req.params.keyword)))
      {
        array2.push(unique[i])
      }
    }
    res.status(200).json({ success: true, data:array2 });      

});
exports.getEDRorIPR = asyncHandler(async (req, res) => {
  var prEdr;
  var lrEdr;
  var rrEdr;
  var dischargeEdr;
  var prIpr;
  var lrIpr;
  var rrIpr;
  var nsIpr;
  var dischargeIpr;
  var dateEdr;
  var dateIpr;
  const rc = await RC.findOne({patient:req.params._id},
    {},
    { sort: { createdAt: -1 } })
  const edr = await EDR.findOne(
    { patientId: req.params._id },
    {},
    { sort: { createdAt: -1 } }
  )
    .populate('pharmacyRequest.medicine.itemId')
    .populate('labRequest.serviceId')
    .populate('radiologyRequest.serviceId')
    .populate('dischargeRequest.dischargeMedication.medicine.itemId');
  if (edr) {
    dateEdr = edr.createdAt;
    if (edr.pharmacyRequest) {
      prEdr = edr.pharmacyRequest;
    }
    if (edr.labRequest) {
      lrEdr = edr.labRequest;
    }
    if (edr.radiologyRequest) {
      rrEdr = edr.radiologyRequest;
    }
    if (edr.dischargeRequest.dischargeMedication.medicine) {
      dischargeEdr = edr.dischargeRequest.dischargeMedication.medicine;
    }
  }
  const ipr = await IPR.findOne(
    { patientId: req.params._id },
    {},
    { sort: { createdAt: -1 } }
  )
    .populate('pharmacyRequest.medicine.itemId')
    .populate('labRequest.serviceId')
    .populate('radiologyRequest.serviceId')
    .populate('nurseService.serviceId')
    .populate('dischargeRequest.dischargeMedication.medicine.itemId');
  if (ipr) {
    dateIpr = ipr.createdAt;
    if (ipr.pharmacyRequest) {
      prIpr = ipr.pharmacyRequest;
    }
    if (ipr.labRequest) {
      lrIpr = ipr.labRequest;
    }
    if (ipr.radiologyRequest) {
      rrIpr = ipr.radiologyRequest;
    }
    if (ipr.nurseService) {
      nsIpr = ipr.nurseService;
    }
    if (ipr.dischargeRequest.dischargeMedication.medicine) {
      dischargeIpr = ipr.dischargeRequest.dischargeMedication.medicine;
    }
  }
  const data = {
    prEdr,
    lrEdr,
    rrEdr,
    dischargeEdr,
    dateEdr,
    prIpr,
    lrIpr,
    rrIpr,
    nsIpr,
    dischargeIpr,
    dateIpr,
    rc
  };
  res.status(200).json({ success: true, data: data });
});

exports.addClaims = asyncHandler(async (req, res) => {
  const {
    generatedBy,
    patient,
    insurer,
    treatmentDetail,
    responseCode,
    document,
    status,
  } = req.body.data;
  var parsed = JSON.parse(req.body.data);
  var rc;
  if (req.file) {
    rc = await RC.create({
      requestNo: 'IRI' + requestNoFormat(new Date(), 'mmddyyHHmm'),
      generatedBy: parsed.generatedBy,
      patient: parsed.patient,
      insurer: parsed.insurer,
      treatmentDetail: parsed.treatmentDetail,
      responseCode: parsed.responseCode,
      document: req.file.path,
      status: parsed.status,
    });
  } else {
    rc = await RC.create({
      requestNo: 'IRI' + requestNoFormat(new Date(), 'mmddyyHHmm'),
      generatedBy: parsed.generatedBy,
      patient: parsed.patient,
      insurer: parsed.insurer,
      treatmentDetail: parsed.treatmentDetail,
      responseCode: parsed.responseCode,
      document: '',
      status: parsed.status,
    });
  }

  res.status(200).json({ success: true, data: rc });
});

exports.updateClaims = asyncHandler(async (req, res, next) => {
  var { _id } = JSON.parse(req.body.data);

  var rc = await RC.findById(_id);
  if (!rc) {
    return next(
      new ErrorResponse(`Reimbursement Claim not found with id of ${_id}`, 404)
    );
  }
  if (req.file) {
    rc = await RC.updateOne(
      { _id: _id },
      { $set: { document: req.file.path } },
      JSON.parse(req.body.data)
    );
  } else {
    rc = await RC.updateOne({ _id: _id }, JSON.parse(req.body.data));
  }
  res.status(200).json({ success: true, data: rc });
});
