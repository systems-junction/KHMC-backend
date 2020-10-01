const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { v4: uuidv4 } = require('uuid');
const EDR = require('../models/EDR');
const IPR = require('../models/IPR');
const RC = require('../models/reimbursementClaim');
const IT = require('../models/insuranceItems');
// const Patient = require('../models/patient');
const requestNoFormat = require('dateformat');
const moment = require('moment');
exports.getClaims = asyncHandler(async (req, res) => {
  const rc = await RC.find()
    .populate('generatedBy')
    .populate('patient')
    .populate('insurer');
  res.status(200).json({ success: true, data: rc });
});

exports.getPatient = asyncHandler(async (req, res) => {
  var array=[]
  var secondArray=[]
  const ipr = await IPR.find({functionalUnit:req.params.id, status: { $ne: "Discharged" }}).populate('patientId')
    for(let i = 0; i<ipr.length; i++)
    {
        array.push(ipr[i].patientId) 
    }
  const edr = await EDR.find({ status: { $ne: "Discharged" }}).populate('patientId')
    for(let i = 0; i<edr.length; i++)
    {
        array.push(edr[i].patientId)
    }
    const unique = Array.from(new Set(array)) 
    for(let i = 0; i<unique.length; i++)
    {
       var fullName = unique[i].firstName+" "+unique[i].lastName
       if(
      (unique[i].profileNo && unique[i].profileNo.toLowerCase().match(req.params.keyword.toLowerCase()))||
      (unique[i].firstName && unique[i].firstName.toLowerCase().match(req.params.keyword.toLowerCase()))||
      (unique[i].lastName && unique[i].lastName.toLowerCase().match(req.params.keyword.toLowerCase()))||
      (unique[i].phoneNumber && unique[i].phoneNumber.match(req.params.keyword))||
      (unique[i].SIN && unique[i].SIN.toLowerCase().match(req.params.keyword.toLowerCase()))||
      (unique[i].mobileNumber && unique[i].mobileNumber.match(req.params.keyword))||
      (fullName.toLowerCase().match( req.params.keyword.toLowerCase()) )
      )
      {
        secondArray.push(unique[i])
      }
    }
    var uniqueArray = (function(secondArray){
      var m = {}, uniqueArray = []
      for (var i=0; i<secondArray.length; i++) {
        var v = secondArray[i];
        if (!m[v]) {
          uniqueArray.push(v);
          m[v]=true;
        }
      }
      return uniqueArray;
    })(secondArray);
    res.status(200).json({ success: true, data:uniqueArray });      

});

exports.getPatientDischarged = asyncHandler(async (req, res) => {
  var array=[]
  var secondArray=[]
  const ipr = await IPR.find({functionalUnit:req.params.id, status: "Discharged" }).populate('patientId')
    for(let i = 0; i<ipr.length; i++)
    {
        array.push(ipr[i].patientId) 
    }
  const edr = await EDR.find({ status: "Discharged" }).populate('patientId')
    for(let i = 0; i<edr.length; i++)
    {
        array.push(edr[i].patientId)
    }
    const unique = Array.from(new Set(array)) 
    for(let i = 0; i<unique.length; i++)
    {
       var fullName = unique[i].firstName+" "+unique[i].lastName
       if(
      (unique[i].profileNo && unique[i].profileNo.toLowerCase().match(req.params.keyword.toLowerCase()))||
      (unique[i].firstName && unique[i].firstName.toLowerCase().match(req.params.keyword.toLowerCase()))||
      (unique[i].lastName && unique[i].lastName.toLowerCase().match(req.params.keyword.toLowerCase()))||
      (unique[i].phoneNumber && unique[i].phoneNumber.match(req.params.keyword))||
      (unique[i].SIN && unique[i].SIN.toLowerCase().match(req.params.keyword.toLowerCase()))||
      (unique[i].mobileNumber && unique[i].mobileNumber.match(req.params.keyword))||
      (fullName.toLowerCase().match( req.params.keyword.toLowerCase()) )
      )
      {
        secondArray.push(unique[i])
      }
    }
    var uniqueArray = (function(secondArray){
      var m = {}, uniqueArray = []
      for (var i=0; i<secondArray.length; i++) {
        var v = secondArray[i];
        if (!m[v]) {
          uniqueArray.push(v);
          m[v]=true;
        }
      }
      return uniqueArray;
    })(secondArray);
    res.status(200).json({ success: true, data:uniqueArray });      

});

exports. getEDRorIPR = asyncHandler(async (req, res) => {
  const rc = await RC.findOne({patient:req.params._id},
    {},
    { sort: { createdAt: -1 } })
    const a = await EDR.findOne({ patientId: req.params._id});
    if (a !== null) {
      var edr = await EDR.findOne({ patientId: req.params._id})
        .populate('patientId')
        .populate('consultationNote.requester')
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
    }
    const b = await IPR.findOne({ patientId: req.params._id });
    if (b !== null) {
      var ipr = await IPR.findOne({ patientId: req.params._id})
        .populate('patientId')
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
        .populate('triageAssessment.requester')
        .sort({
          createdAt: 'desc',
        })
    }
    if (a && b) {
      var isafter = moment(edr.createdAt).isAfter(ipr.createdAt);
      if (isafter) {
        const insurance = await IT.find({providerId:edr.insurerId})
        var insured = [];
        for(let i=0; i<edr.pharmacyRequest.length;i++)
        {
          for(let j=0; j<edr.pharmacyRequest[i].item.length; j++)
          {
            for(let k=0; k<insurance.length; k++)
            {
              if(JSON.parse(JSON.stringify(edr.pharmacyRequest[i].item[j].itemId._id)) == JSON.parse(JSON.stringify(insurance[k].itemId)))
              {
                insured.push(insurance[k])
              }
            }
          }
        }
        for(let i=0; i<edr.labRequest.length;i++)
        {
            for(let j=0; j<insurance.length; j++)
            {
              if(JSON.parse(JSON.stringify(edr.labRequest[i].serviceId._id)) == JSON.parse(JSON.stringify(insurance[j].laboratoryServiceId)))
              {
                insured.push(insurance[j])
              }
            }
        }
        for(let i=0; i<edr.radiologyRequest.length;i++)
        {
            for(let j=0; j<insurance.length; j++)
            {
              if(JSON.parse(JSON.stringify(edr.radiologyRequest[i].serviceId._id)) == JSON.parse(JSON.stringify(insurance[j].radiologyServiceId)))
              {
                insured.push(insurance[j])
              }
            }
        }
        res.status(200).json({ success: true, data: edr, rc:rc, insured:insured });
      } else {
        const insurance = await IT.find({providerId:ipr.insurerId})
        var insured = [];
        for(let i=0; i<ipr.pharmacyRequest.length;i++)
        {
          for(let j=0; j<ipr.pharmacyRequest[i].item.length; j++)
          {
            for(let k=0; k<insurance.length; k++)
            {
              if(JSON.parse(JSON.stringify(ipr.pharmacyRequest[i].item[j].itemId._id)) == insurance[k].itemId)
              {
                insured.push(insurance[k])
              }
            }
          }
        }
        for(let i=0; i<ipr.labRequest.length;i++)
        {
            for(let j=0; j<insurance.length; j++)
            {
              if(JSON.parse(JSON.stringify(ipr.labRequest[i].serviceId._id)) == insurance[j].laboratoryServiceId)
              {
                insured.push(insurance[j])
              }
            }
        }
        for(let i=0; i<ipr.radiologyRequest.length;i++)
        {
            for(let j=0; j<insurance.length; j++)
            {
              if(JSON.parse(JSON.stringify(ipr.radiologyRequest[i].serviceId._id)) == insurance[j].radiologyServiceId)
              {
                insured.push(insurance[j])
              }
            }
        }
        res.status(200).json({ success: true, data: ipr, rc:rc,insured:insured });
      }
    } else if (a) {
      const insurance = await IT.find({providerId:edr.insurerId})
      var insured = [];
        for(let i=0; i<edr.pharmacyRequest.length;i++)
        {
          for(let j=0; j<edr.pharmacyRequest[i].item.length; j++)
          {
            for(let k=0; k<insurance.length; k++)
            {
              if(JSON.parse(JSON.stringify(edr.pharmacyRequest[i].item[j].itemId._id)) == insurance[k].itemId)
              {
                insured.push(insurance[k])
              }
            }
          }
        }
        for(let i=0; i<edr.labRequest.length;i++)
        {
            for(let j=0; j<insurance.length; j++)
            {
              if(JSON.parse(JSON.stringify(edr.labRequest[i].serviceId._id)) == nsurance[j].laboratoryServiceId)
              {
                insured.push(insurance[j])
              }
            }
        }
        for(let i=0; i<edr.radiologyRequest.length;i++)
        {
            for(let j=0; j<insurance.length; j++)
            {
              if(JSON.parse(JSON.stringify(edr.radiologyRequest[i].serviceId._id)) == insurance[j].radiologyServiceId)
              {
                insured.push(insurance[j])
              }
            }
        }
        res.status(200).json({ success: true, data: edr, rc:rc, insured:insured });
    } else if (b) {
      const insurance = await IT.find({providerId:ipr.insurerId})
      var insured = [];
      for(let i=0; i<ipr.pharmacyRequest.length;i++)
      {
        for(let j=0; j<ipr.pharmacyRequest[i].item.length; j++)
        {
          for(let k=0; k<insurance.length; k++)
          {
            if(JSON.parse(JSON.stringify(ipr.pharmacyRequest[i].item[j].itemId._id)) == insurance[k].itemId)
            {
              insured.push(insurance[k])
            }
          }
        }
      }
      for(let i=0; i<ipr.labRequest.length;i++)
      {
          for(let j=0; j<insurance.length; j++)
          {
            if(JSON.parse(JSON.stringify(ipr.labRequest[i].serviceId._id)) == insurance[j].laboratoryServiceId)
            {
              insured.push(insurance[j])
            }
          }
      }
      for(let i=0; i<ipr.radiologyRequest.length;i++)
      {
          for(let j=0; j<insurance.length; j++)
          {
            if(JSON.parse(JSON.stringify(ipr.radiologyRequest[i].serviceId._id)) == insurance[j].radiologyServiceId)
            {
              insured.push(insurance[j])
            }
          }
      }
      res.status(200).json({ success: true, data: ipr, rc:rc ,insured:insured });
    } else {
      res.status(200).json({ success: false, data: 'User not found' });
    }
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
  if (req.files) {
    var arr=[];
    for(let i=0; i<req.files.length;i++)
    {
      arr.push(req.files[i].path);
    }
    rc = await RC.create({
      requestNo: 'IRI' + requestNoFormat(new Date(), 'mmddyyHHmm'),
      generatedBy: parsed.generatedBy,
      patient: parsed.patient,
      insurer: parsed.insurer,
      treatmentDetail: parsed.treatmentDetail,
      responseCode: parsed.responseCode,
      document: arr,
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
