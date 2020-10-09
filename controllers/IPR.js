const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const notification = require('../components/notification');
const IPR = require('../models/IPR');
const EDR = require('../models/EDR');
const requestNoFormat = require('dateformat');
exports.getIPR = asyncHandler(async (req, res) => {
  const ipr = await IPR.find()
    .populate('patientId')
    .populate('consultationNote.requester')
    // .populate('pharmacyRequest.requester')
    // .populate('pharmacyRequest.medicine.itemId')
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
});

exports.getIPRPatient = asyncHandler(async (req, res) => {
  const ipr = await IPR.find()
    .populate('patientId')
    .select({ patientId:1, requestNo: 1 });
    res.status(200).json({ success: true, data: ipr });
});

exports.getIPRKeyword = asyncHandler(async (req, res) => {
  var arr=[]
  const ipr = await IPR.find().populate('patientId').select({ patientId:1, requestNo: 1 });
    for(let i = 0; i<ipr.length; i++)
    {
       var fullName = ipr[i].patientId.firstName+" "+ipr[i].patientId.lastName
       if(
      (ipr[i].patientId.profileNo && ipr[i].patientId.profileNo.toLowerCase().match(req.params.keyword.toLowerCase()))||
      (ipr[i].patientId.firstName && ipr[i].patientId.firstName.toLowerCase().match(req.params.keyword.toLowerCase()))||
      (ipr[i].patientId.lastName && ipr[i].patientId.lastName.toLowerCase().match(req.params.keyword.toLowerCase()))||
      (ipr[i].patientId.phoneNumber && ipr[i].patientId.phoneNumber.match(req.params.keyword))||
      (ipr[i].patientId.SIN && ipr[i].patientId.SIN.toLowerCase().match(req.params.keyword.toLowerCase()))||
      (ipr[i].patientId.mobileNumber && ipr[i].patientId.mobileNumber.match(req.params.keyword))||
      (fullName.toLowerCase().match( req.params.keyword.toLowerCase()) )
      )
      {
        arr.push(ipr[i])
      }
    }
  
    res.status(200).json({ success: true, data:arr });      

});

exports.getPHRIPR = asyncHandler(async (req, res) => {
  const ipr = await IPR.find({ pharmacyRequest: { $ne: [] } })
    .populate('patientId')
    // .populate('pharmacyRequest.requester')
    // .populate('pharmacyRequest.medicine.itemId')
    .select({ pharmacyRequest: 1, requestNo: 1 });
  var data = [];
  for (let i = 0; i < ipr.length; i++) {
    let pr = ipr[i].pharmacyRequest;
    for (let j = 0; j < pr.length; j++) {
      let temp = JSON.parse(JSON.stringify(pr[j]));
      var obj = {
        ...temp,
        iprId: ipr[i],
        patientData: ipr[i].patientId,
      };
      data.push(obj);
    }
  }
  res.status(200).json({ success: true, data: data });
});

exports.getPHRPatient = asyncHandler(async (req, res) => {
  const edr = await EDR.find()
    .populate('patientId')
    // .populate('pharmacyRequest.requester')
    // .populate('pharmacyRequest.serviceId')
    // .populate('pharmacyRequest.medicine.itemId')
    .select({ pharmacyRequest: 1, requestNo: 1 });
  var data1 = [];
  for (let i = 0; i < edr.length; i++) {
    let phr = edr[i].pharmacyRequest;
    for (let j = 0; j < phr.length; j++) {
      let temp = JSON.parse(JSON.stringify(phr[j]));
      var obj = {
        ...temp,
        edipId: edr[i],
        requestNo: edr[i].requestNo,
        patientData: edr[i].patientId,
      };
      data1.push(obj);
    }
  }
  const ipr = await IPR.find()
    .populate('patientId')
    // .populate('pharmacyRequest.requester')
    // .populate('pharmacyRequest.serviceId')
    // .populate('pharmacyRequest.medicine.itemId')
    .select({ pharmacyRequest: 1, requestNo: 1 });
  var data2 = [];
  for (let i = 0; i < ipr.length; i++) {
    let phr = ipr[i].pharmacyRequest;
    for (let j = 0; j < phr.length; j++) {
      let temp = JSON.parse(JSON.stringify(phr[j]));
      var obj = {
        ...temp,
        edipId: ipr[i],
        requestNo: ipr[i].requestNo,
        patientData: ipr[i].patientId,
      };
      data2.push(obj);
    }
  }
  var data = [data1.concat(data2)];
  res.status(200).json({ success: true, data: data });
});

exports.getPHRById = asyncHandler(async (req, res) => {
  if ((await IPR.findOne({ 'pharmacyRequest._id': req.params._id })) !== null) {
    const ipr = await IPR.findOne({ 'pharmacyRequest._id': req.params._id })
      // .populate('pharmacyRequest.requester')
      // .populate('pharmacyRequest.serviceId')
      // .populate('pharmacyRequest.medicine.itemId');
    // .select({ pharmacyRequest: 1 });
    for (let i = 0; i < ipr.pharmacyRequest.length; i++) {
      if (ipr.pharmacyRequest[i]._id == req.params._id) {
        var phr1 = ipr.pharmacyRequest[i];
      }
    }
    res.status(200).json({
      success: true,
      data: phr1,
      data2: ipr.dischargeRequest.dischargeMedication,
    });
  }

  if ((await EDR.findOne({ 'pharmacyRequest._id': req.params._id })) !== null) {
    const edr = await EDR.findOne({ 'pharmacyRequest._id': req.params._id })
      // .populate('pharmacyRequest.requester')
      // .populate('pharmacyRequest.serviceId')
      // .populate('pharmacyRequest.medicine.itemId');
    // .select({ pharmacyRequest: 1 });
    for (let i = 0; i < edr.pharmacyRequest.length; i++) {
      if (edr.pharmacyRequest[i]._id == req.params._id) {
        var phr2 = edr.pharmacyRequest[i];
      }
    }
    res.status(200).json({
      success: true,
      data: phr2,
      data2: edr.dischargeRequest.dischargeMedication,
    });
  }
});

exports.getPHRIPRById = asyncHandler(async (req, res) => {
  const ipr = await IPR.findOne({ 'pharmacyRequest._id': req.params._id })
    // .populate('pharmacyRequest.requester')
    // .populate('pharmacyRequest.medicine.itemId')
    .select({ pharmacyRequest: 1 });
  for (let i = 0; i < ipr.pharmacyRequest.length; i++) {
    if (ipr.pharmacyRequest[i]._id == req.params._id) {
      var lab = ipr.pharmacyRequest[i];
    }
  }
  res.status(200).json({ success: true, data: lab });
});

exports.putPHRIPRById = asyncHandler(async (req, res) => {
  const ipr = await IPR.findOneAndUpdate(
    { 'pharmacyRequest._id': req.body._id },
    { $set: { 'pharmacyRequest.$.status': req.body.status } },
    { new: true }
  )
    // .populate('pharmacyRequest.requester')
    // .populate('pharmacyRequest.medicine.itemId')
    .select({ pharmacyRequest: 1 });
  res.status(200).json({ success: true, data: ipr });
});

exports.putPHRById = asyncHandler(async (req, res) => {
  const a = await IPR.findOne({ 'pharmacyRequest._id': req.body._id });
  if (a !== null) {
    const ipr = await IPR.findOneAndUpdate(
      { 'pharmacyRequest._id': req.body._id },
      { $set: { 'pharmacyRequest.$.status': req.body.status } },
      { new: true }
    )
      // .populate('pharmacyRequest.requester')
      // .populate('pharmacyRequest.medicine.itemId')
      .populate('patientId')
      .select({ pharmacyRequest: 1, patientId:1 });
    res.status(200).json({ success: true, data: ipr });
  }
  const b = await EDR.findOne({ 'pharmacyRequest._id': req.body._id });
  if (b !== null) {
    const edr = await EDR.findOneAndUpdate(
      { 'pharmacyRequest._id': req.body._id },
      { $set: { 'pharmacyRequest.$.status': req.body.status } },
      { new: true }
    )
      // .populate('pharmacyRequest.requester')
      // .populate('pharmacyRequest.medicine.itemId')
      .populate('patientId')
      .select({ pharmacyRequest: 1, patientId:1 });
    res.status(200).json({ success: true, data: edr });
  }
});

exports.getDischargeIPR = asyncHandler(async (req, res) => {
  const ipr = await IPR.find({
    'dischargeRequest.dischargeMedication.medicine': { $ne: [] },
  })
    .populate('patientId')
    .populate('dischargeRequest.dischargeMedication.medicine.itemId')
    .select({ dischargeRequest: 1, requestNo: 1 });
  res.status(200).json({ success: true, data: ipr });
});

exports.getDischarge = asyncHandler(async (req, res) => {
  const ipr = await IPR.find({
    'dischargeRequest.dischargeMedication.medicine': { $ne: [] },
  })
    .populate('patientId')
    .populate('dischargeRequest.dischargeMedication.medicine.itemId')
    .select({ dischargeRequest: 1, requestNo: 1 , patientId:1 });

  const edr = await EDR.find({
    'dischargeRequest.dischargeMedication.medicine': { $ne: [] },
  })
    .populate('patientId')
    .populate('dischargeRequest.dischargeMedication.medicine.itemId')
    .select({ dischargeRequest: 1, requestNo: 1 , patientId:1 });
  var dataF = [ipr.concat(edr)];
  var data = dataF[0]
  res.status(200).json({ success: true, data: data });
});
exports.getDischargeKeyword = asyncHandler(async (req, res) => {
  const ipr = await IPR.find({
    'dischargeRequest.dischargeMedication.medicine': { $ne: [] },
  })
    .populate('patientId')
    .populate('dischargeRequest.dischargeMedication.medicine.itemId')
    .select({ dischargeRequest: 1, requestNo: 1 , patientId:1 });

  const edr = await EDR.find({
    'dischargeRequest.dischargeMedication.medicine': { $ne: [] },
  })
    .populate('patientId')
    .populate('dischargeRequest.dischargeMedication.medicine.itemId')
    .select({ dischargeRequest: 1, requestNo: 1 , patientId:1 });
  var dataF = [ipr.concat(edr)];
  var data = dataF[0]
  var arr=[]
  for(let i = 0; i<data.length; i++)
  {
     var fullName = data[i].patientId.firstName+" "+data[i].patientId.lastName
     if(
    (data[i].patientId.profileNo && data[i].patientId.profileNo.toLowerCase().match(req.params.keyword.toLowerCase()))||
    (data[i].patientId.firstName && data[i].patientId.firstName.toLowerCase().match(req.params.keyword.toLowerCase()))||
    (data[i].patientId.lastName && data[i].patientId.lastName.toLowerCase().match(req.params.keyword.toLowerCase()))||
    (data[i].patientId.phoneNumber && data[i].patientId.phoneNumber.match(req.params.keyword))||
    (data[i].patientId.SIN && data[i].patientId.SIN.toLowerCase().match(req.params.keyword.toLowerCase()))||
    (data[i].patientId.mobileNumber && data[i].patientId.mobileNumber.match(req.params.keyword))||
    (fullName.toLowerCase().match( req.params.keyword.toLowerCase()) )
    )
    {
      arr.push(data[i])
    }
  }

  res.status(200).json({ success: true, data: arr });
});

exports.getDischargeIPRById = asyncHandler(async (req, res) => {
  const ipr = await IPR.findOne({ _id: req.params._id })
    .populate('patientId')
    .populate('dischargeRequest.dischargeMedication.medicine.itemId')
    .select({ dischargeRequest: 1, requestNo: 1 });
  res.status(200).json({ success: true, data: ipr });
});

exports.getDischargeById = asyncHandler(async (req, res) => {
  const a = await IPR.findOne({ _id: req.params._id });
  if (a !== null) {
    const ipr = await IPR.findOne({ _id: req.params._id })
      .populate('patientId')
      .populate('dischargeRequest.dischargeMedication.medicine.itemId')
      .select({ dischargeRequest: 1, requestNo: 1 });
    res.status(200).json({ success: true, data: ipr });
  }

  const b = await EDR.findOne({ _id: req.params._id });
  if (b !== null) {
    const edr = await EDR.findOne({ _id: req.params._id })
      .populate('patientId')
      .populate('dischargeRequest.dischargeMedication.medicine.itemId')
      .select({ dischargeRequest: 1, requestNo: 1 });
    res.status(200).json({ success: true, data: edr });
  }
});

exports.putDischargeIPRById = asyncHandler(async (req, res) => {
  const ipr = await IPR.findOneAndUpdate(
    { _id: req.body._id },
    { $set: { 'dischargeRequest.status': req.body.status } },
    { new: true }
  )
    .populate('dischargeRequest.dischargeMedication.medicine.itemId')
    .populate('patientId')
    .select({ dischargeRequest: 1, patientId:1 });
  res.status(200).json({ success: true, data: ipr });
});

exports.putDischargeById = asyncHandler(async (req, res) => {
  const a = await IPR.findOne({ _id: req.body._id });
  if (a !== null) {
    const ipr = await IPR.findOneAndUpdate(
      { _id: req.body._id },
      { $set: { 'dischargeRequest.status': req.body.status } },
      { new: true }
    )
      .populate('dischargeRequest.dischargeMedication.medicine.itemId')
      .populate('patientId')
      .select({ dischargeRequest: 1,patientId:1, requestNo:1 });
    res.status(200).json({ success: true, data: ipr });
  }
  const b = await EDR.findOne({ _id: req.body._id });
  if (b !== null) {
    const edr = await EDR.findOneAndUpdate(
      { _id: req.body._id },
      { $set: { 'dischargeRequest.status': req.body.status } },
      { new: true }
    )
      .populate('dischargeRequest.dischargeMedication.medicine.itemId')
      .populate('patientId')
      .select({ dischargeRequest: 1, patientId:1, requestNo:1 });
    res.status(200).json({ success: true, data: edr });
  }
});

exports.getRRIPR = asyncHandler(async (req, res) => {
  const ipr = await IPR.find({ radiologyRequest: { $ne: [] } })
    .populate('patientId')
    .populate('radiologyRequest.requester')
    .populate('radiologyRequest.serviceId')
    .select({ radiologyRequest: 1, requestNo: 1 });
  var data = [];
  for (let i = 0; i < ipr.length; i++) {
    let rr = ipr[i].radiologyRequest;
    for (let j = 0; j < rr.length; j++) {
      let temp = JSON.parse(JSON.stringify(rr[j]));
      var obj = {
        ...temp,
        iprId: ipr[i],
        patientData: ipr[i].patientId,
      };
      data.push(obj);
    }
  }
  res.status(200).json({ success: true, data: data });
});

exports.getRRPatient = asyncHandler(async (req, res) => {
  const edr = await EDR.find()
    .populate('patientId')
    .populate('radiologyRequest.requester')
    .populate('radiologyRequest.serviceId')
    .select({ radiologyRequest: 1, requestNo: 1 });
  var data1 = [];
  for (let i = 0; i < edr.length; i++) {
    let rr = edr[i].radiologyRequest;
    for (let j = 0; j < rr.length; j++) {
      let temp = JSON.parse(JSON.stringify(rr[j]));
      var obj = {
        ...temp,
        edipId: edr[i],
        requestNo: edr[i].requestNo,
        patientData: edr[i].patientId,
      };
      data1.push(obj);
    }
  }
  const ipr = await IPR.find()
    .populate('patientId')
    .populate('radiologyRequest.requester')
    .populate('radiologyRequest.serviceId')
    .select({ radiologyRequest: 1, requestNo: 1 });
  var data2 = [];
  for (let i = 0; i < ipr.length; i++) {
    let rr = ipr[i].radiologyRequest;
    for (let j = 0; j < rr.length; j++) {
      let temp = JSON.parse(JSON.stringify(rr[j]));
      var obj = {
        ...temp,
        edipId: ipr[i],
        requestNo: ipr[i].requestNo,
        patientData: ipr[i].patientId,
      };
      data2.push(obj);
    }
  }
  var data = [data1.concat(data2)];
  var dataF= data[0]
  res.status(200).json({ success: true, data: dataF });
});

exports.getRRPatientKeyword = asyncHandler(async (req, res) => {
  const edr = await EDR.find({ radiologyRequest: { $ne: [] } })
    .populate('patientId')
    .populate('radiologyRequest.requester')
    .populate('radiologyRequest.serviceId')
    .select({ radiologyRequest: 1, requestNo: 1 , patineId:1 });
  var data1 = [];
  for (let i = 0; i < edr.length; i++) {
    let rr = edr[i].radiologyRequest;
    for (let j = 0; j < rr.length; j++) {
      let temp = JSON.parse(JSON.stringify(rr[j]));
      var obj = {
        ...temp,
        edipId: edr[i],
        requestNo: edr[i].requestNo,
        patientData: edr[i].patientId,
      };
      data1.push(obj);
    }
  }
  const ipr = await IPR.find({ radiologyRequest: { $ne: [] } })
    .populate('patientId')
    .populate('radiologyRequest.requester')
    .populate('radiologyRequest.serviceId')
    .select({ radiologyRequest: 1, requestNo: 1 ,patientId:1 });
  var data2 = [];
  for (let i = 0; i < ipr.length; i++) {
    let rr = ipr[i].radiologyRequest;
    for (let j = 0; j < rr.length; j++) {
      let temp = JSON.parse(JSON.stringify(rr[j]));
      var obj = {
        ...temp,
        edipId: ipr[i],
        requestNo: ipr[i].requestNo,
        patientData: ipr[i].patientId,
      };
      data2.push(obj);
    }
  }
  var dataF =[data1.concat(data2)] 
  var data = dataF[0];
  var arr=[];

  for(let i = 0; i<data.length; i++)
  {
     var fullName = data[i].patientData.firstName+" "+data[i].patientData.lastName
     if(
    (data[i].patientData.profileNo && data[i].patientData.profileNo.toLowerCase().match(req.params.keyword.toLowerCase()))||
    (data[i].patientData.firstName && data[i].patientData.firstName.toLowerCase().match(req.params.keyword.toLowerCase()))||
    (data[i].patientData.lastName && data[i].patientData.lastName.toLowerCase().match(req.params.keyword.toLowerCase()))||
    (data[i].patientData.phoneNumber && data[i].patientData.phoneNumber.match(req.params.keyword))||
    (data[i].patientData.SIN && data[i].patientData.SIN.toLowerCase().match(req.params.keyword.toLowerCase()))||
    (data[i].patientData.mobileNumber && data[i].patientData.mobileNumber.match(req.params.keyword))||
    (fullName.toLowerCase().match( req.params.keyword.toLowerCase()) )
    )
    {
      arr.push(data[i])
    }
  }
  res.status(200).json({ success: true, data: arr });

});

exports.getRRPatientById = asyncHandler(async (req, res) => {
  const edr = await EDR.find({ radiologyRequest: { $ne: [] } })
    .populate('patientId')
    .populate('radiologyRequest.requester')
    .populate('radiologyRequest.serviceId')
    .select({ radiologyRequest: 1, requestNo: 1 ,patientId:1 });
  var data1 = [];
  for (let i = 0; i < edr.length; i++) {
    let rr = edr[i].radiologyRequest;
    for (let j = 0; j < rr.length; j++) {
      let temp = JSON.parse(JSON.stringify(rr[j]));
      var obj = {
        ...temp,
        edipId: edr[i],
        requestNo: edr[i].requestNo,
        patientData: edr[i].patientId,
      };
      data1.push(obj);
    }
  }
  const ipr = await IPR.find({ radiologyRequest: { $ne: [] } })
    .populate('patientId')
    .populate('radiologyRequest.requester')
    .populate('radiologyRequest.serviceId')
    .select({ radiologyRequest: 1, requestNo: 1 ,patientId:1 });
  var data2 = [];
  for (let i = 0; i < ipr.length; i++) {
    let rr = ipr[i].radiologyRequest;
    for (let j = 0; j < rr.length; j++) {
      let temp = JSON.parse(JSON.stringify(rr[j]));
      var obj = {
        ...temp,
        edipId: ipr[i],
        requestNo: ipr[i].requestNo,
        patientData: ipr[i].patientId,
      };
      data2.push(obj);
    }
  }
  var data =[data1.concat(data2)] 
  res.status(200).json({ success: true, data: data });
});

exports.getRRIPRById = asyncHandler(async (req, res) => {
  const ipr = await IPR.findOne({ 'radiologyRequest._id': req.params._id })
    .populate('radiologyRequest.requester')
    .populate('radiologyRequest.serviceId')
    .select({ radiologyRequest: 1 });
  for (let i = 0; i < ipr.radiologyRequest.length; i++) {
    if (ipr.radiologyRequest[i]._id == req.params._id) {
      var lab = ipr.radiologyRequest[i];
    }
  }
  res.status(200).json({ success: true, data: lab });
});

exports.getRRById = asyncHandler(async (req, res) => {
  if (
    (await IPR.findOne({ 'radiologyRequest._id': req.params._id })) !== null
  ) {
    const ipr = await IPR.findOne({ 'radiologyRequest._id': req.params._id })
      .populate('radiologyRequest.requester')
      .populate('radiologyRequest.serviceId')
      .select({ radiologyRequest: 1 });
    for (let i = 0; i < ipr.radiologyRequest.length; i++) {
      if (ipr.radiologyRequest[i]._id == req.params._id) {
        var rad1 = ipr.radiologyRequest[i];
      }
    }
    res.status(200).json({ success: true, data: rad1 });
  }

  if (
    (await EDR.findOne({ 'radiologyRequest._id': req.params._id })) !== null
  ) {
    const edr = await EDR.findOne({ 'radiologyRequest._id': req.params._id })
      .populate('radiologyRequest.requester')
      .populate('radiologyRequest.serviceId')
      .select({ radiologyRequest: 1 });
    for (let i = 0; i < edr.radiologyRequest.length; i++) {
      if (edr.radiologyRequest[i]._id == req.params._id) {
        var rad2 = edr.radiologyRequest[i];
      }
    }
    res.status(200).json({ success: true, data: rad2 });
  }
});

exports.putRRIPRById = asyncHandler(async (req, res) => {
  var data = JSON.parse(req.body.data);
  if (req.file) {
    await IPR.findOneAndUpdate(
      { 'radiologyRequest._id': data.radiologyRequestId, _id: data.IPRId },
      data
    );
    await IPR.findOneAndUpdate(
      { 'radiologyRequest._id': data.radiologyRequestId, _id: data.IPRId },
      { $set: { 'radiologyRequest.$.results': req.file.path } },
      { new: true }
    );
    await IPR.findOneAndUpdate(
      { 'radiologyRequest._id': data.radiologyRequestId, _id: data.IPRId },
      { $set: { 'radiologyRequest.$.status': data.status } },
      { new: true }
    );
  } else {
    await IPR.findOneAndUpdate(
      { 'radiologyRequest._id': data.radiologyRequestId, _id: data.IPRId },
      data
    );
    await IPR.findOneAndUpdate(
      { 'radiologyRequest._id': data.radiologyRequestId, _id: data.IPRId },
      { $set: { 'radiologyRequest.$.status': data.status } },
      { new: true }
    );
  }
  res.status(200).json({ success: true });

  // const ipr = await IPR.findOneAndUpdate({'radiologyRequest._id': req.body._id},{ $set: { 'radiologyRequest.$.status': req.body.status }},{new: true})
  // .populate('radiologyRequest.requester')
  // .populate('radiologyRequest.serviceId').select({radiologyRequest:1})
  //  res.status(200).json({ success: true, data: ipr });
});

exports.putRRById = asyncHandler(async (req, res) => {
  var data = JSON.parse(req.body.data);
  var request;
  var not;
  const a = await IPR.findOne({
    'radiologyRequest._id': data.radiologyRequestId,
  });
  if (a !== null) {
    if (req.file) {
      await IPR.findOneAndUpdate(
        { 'radiologyRequest._id': data.radiologyRequestId, _id: data.IPRId },
        data
      );
      await IPR.findOneAndUpdate(
        { 'radiologyRequest._id': data.radiologyRequestId, _id: data.IPRId },
        { $set: { 'radiologyRequest.$.results': req.file.path } },
        { new: true }
      );
      not = await IPR.findOneAndUpdate(
        { 'radiologyRequest._id': data.radiologyRequestId, _id: data.IPRId },
        { $set: { 'radiologyRequest.$.status': data.status } },
        { new: true }
      ).populate('patientId');
      for(let i=0 ; i<not.radiologyRequest.length; i++)
      {
        if(not.radiologyRequest[i]._id==data.radiologyRequestId)
        {
          request=not.radiologyRequest[i].RRrequestNo
        }
      }
      notification(
        'Radiology Request',
        'Radiology Request number ' +
          request +
          ' updated for Patient MRN ' +
          not.patientId.profileNo,
        'Radiology/Imaging'
      );
      const pat = await IPR.findOne({ patientId: not.patientId });
      globalVariable.io.emit('get_data', pat);
    } else {
      await IPR.findOneAndUpdate(
        { 'radiologyRequest._id': data.radiologyRequestId, _id: data.IPRId },
        data
      );
      not = await IPR.findOneAndUpdate(
        { 'radiologyRequest._id': data.radiologyRequestId, _id: data.IPRId },
        { $set: { 'radiologyRequest.$.status': data.status } },
        { new: true }
      ).populate('patientId');
      for(let i=0 ; i<not.radiologyRequest.length; i++)
      {
        if(not.radiologyRequest[i]._id==data.radiologyRequestId)
        {
          request=not.radiologyRequest[i].RRrequestNo
        }
      }
      notification(
        'Radiology Request',
        'Radiology Request number ' +
          request +
          ' updated for Patient MRN ' +
          not.patientId.profileNo,
        'Radiology/Imaging'
      );
      const pat = await IPR.findOne({ patientId: not.patientId });
      globalVariable.io.emit('get_data', pat);
    }
    res.status(200).json({ success: true, data:not, requestNumber:request });
  }

  const b = await EDR.findOne({
    'radiologyRequest._id': data.radiologyRequestId,
  });

  if (b !== null) {
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
      not = await EDR.findOneAndUpdate(
        { 'radiologyRequest._id': data.radiologyRequestId, _id: data.EDRId },
        { $set: { 'radiologyRequest.$.status': data.status } },
        { new: true }
      ).populate('patientId');
      for(let i=0 ; i<not.radiologyRequest.length; i++)
      {
        if(not.radiologyRequest[i]._id==data.radiologyRequestId)
        {
          request=not.radiologyRequest[i].RRrequestNo
        }
      }
      notification(
        'Radiology Request',
        'Radiology Request number ' +
          request +
          ' updated for Patient MRN ' +
          not.patientId.profileNo,
        'Radiology/Imaging'
      );
      const pat = await EDR.findOne({ patientId: not.patientId });
      globalVariable.io.emit('get_data', pat);
    } else {
      await EDR.findOneAndUpdate(
        { 'radiologyRequest._id': data.radiologyRequestId, _id: data.EDRId },
        data
      );
      not = await EDR.findOneAndUpdate(
        { 'radiologyRequest._id': data.radiologyRequestId, _id: data.EDRId },
        { $set: { 'radiologyRequest.$.status': data.status } },
        { new: true }
      ).populate('patientId');
      for(let i=0 ; i<not.radiologyRequest.length; i++)
      {
        if(not.radiologyRequest[i]._id==data.radiologyRequestId)
        {
          request=not.radiologyRequest[i].RRrequestNo
        }
      }
      notification(
        'Radiology Request',
        'Radiology Request number ' +
          request +
          ' updated for Patient MRN ' +
          not.patientId.profileNo,
        'Radiology/Imaging'
      );
      const pat = await EDR.findOne({ patientId: not.patientId });
      globalVariable.io.emit('get_data', pat);
    }
    res.status(200).json({ success: true, data:not, requestNumber:request });
  }
});

exports.getLRIPR = asyncHandler(async (req, res) => {
  const ipr = await IPR.find({ labRequest: { $ne: [] } })
    .populate('patientId')
    .populate('labRequest.requester')
    .populate('labRequest.serviceId')
    .select({ labRequest: 1, requestNo: 1 });
  var data = [];
  for (let i = 0; i < ipr.length; i++) {
    let lr = ipr[i].labRequest;
    for (let j = 0; j < lr.length; j++) {
      let temp = JSON.parse(JSON.stringify(lr[j]));
      var obj = {
        ...temp,
        iprId: ipr[i],
        patientData: ipr[i].patientId,
      };
      data.push(obj);
    }
  }
  res.status(200).json({ success: true, data: data });
});

exports.getLRPatient = asyncHandler(async (req, res) => {
  const edr = await EDR.find({ labRequest: { $ne: [] } })
    .populate('patientId')
    .populate('labRequest.requester')
    .populate('labRequest.serviceId')
    .select({ labRequest: 1, requestNo: 1, patientId:1 });
  var data1 = [];
  for (let i = 0; i < edr.length; i++) {
    let lr = edr[i].labRequest;
    for (let j = 0; j < lr.length; j++) {
      let temp = JSON.parse(JSON.stringify(lr[j]));
      var obj = {
        ...temp,
        edipId: edr[i],
        requestNo: edr[i].requestNo,
        patientData: edr[i].patientId,
      };
      data1.push(obj);
    }
  }
  const ipr = await IPR.find({ labRequest: { $ne: [] } })
    .populate('patientId')
    .populate('labRequest.requester')
    .populate('labRequest.serviceId')
    .select({ labRequest: 1, requestNo: 1 , patientId:1});
  var data2 = [];
  for (let i = 0; i < ipr.length; i++) {
    let lr = ipr[i].labRequest;
    for (let j = 0; j < lr.length; j++) {
      let temp = JSON.parse(JSON.stringify(lr[j]));
      var obj = {
        ...temp,
        edipId: ipr[i],
        requestNo: ipr[i].requestNo,
        patientData: ipr[i].patientId,
      };
      data2.push(obj);
    }
  }
  var data = [data1.concat(data2)];
    var dataF = data[0]
  res.status(200).json({ success: true, data: dataF });
});

exports.getLRPatientKeyword = asyncHandler(async (req, res) => {
  const edr = await EDR.find({ labRequest: { $ne: [] } })
    .populate('patientId')
    .populate('labRequest.requester')
    .populate('labRequest.serviceId')
    .select({ labRequest: 1, requestNo: 1, patientId:1 });
  var data1 = [];
  for (let i = 0; i < edr.length; i++) {
    let lr = edr[i].labRequest;
    for (let j = 0; j < lr.length; j++) {
      let temp = JSON.parse(JSON.stringify(lr[j]));
      var obj = {
        ...temp,
        edipId: edr[i],
        requestNo: edr[i].requestNo,
        patientData: edr[i].patientId,
      };
      data1.push(obj);
    }
  }
  const ipr = await IPR.find({ labRequest: { $ne: [] } })
    .populate('patientId')
    .populate('labRequest.requester')
    .populate('labRequest.serviceId')
    .select({ labRequest: 1, requestNo: 1, patientId:1 });
  var data2 = [];
  for (let i = 0; i < ipr.length; i++) {
    let lr = ipr[i].labRequest;
    for (let j = 0; j < lr.length; j++) {
      let temp = JSON.parse(JSON.stringify(lr[j]));
      var obj = {
        ...temp,
        edipId: ipr[i],
        requestNo: ipr[i].requestNo,
        patientData: ipr[i].patientId,
      };
      data2.push(obj);
    }
  }
  var dataF=[data1.concat(data2)];
  var data = dataF[0]
  var arr=[];

  for(let i = 0; i<data.length; i++)
  {
     var fullName = data[i].patientData.firstName+" "+data[i].patientData.lastName
     if(
    (data[i].patientData.profileNo && data[i].patientData.profileNo.toLowerCase().match(req.params.keyword.toLowerCase()))||
    (data[i].patientData.firstName && data[i].patientData.firstName.toLowerCase().match(req.params.keyword.toLowerCase()))||
    (data[i].patientData.lastName && data[i].patientData.lastName.toLowerCase().match(req.params.keyword.toLowerCase()))||
    (data[i].patientData.phoneNumber && data[i].patientData.phoneNumber.match(req.params.keyword))||
    (data[i].patientData.SIN && data[i].patientData.SIN.toLowerCase().match(req.params.keyword.toLowerCase()))||
    (data[i].patientData.mobileNumber && data[i].patientData.mobileNumber.match(req.params.keyword))||
    (fullName.toLowerCase().match( req.params.keyword.toLowerCase()) )
    )
    {
      arr.push(data[i])
    }
  }
  res.status(200).json({ success: true, data: arr });
});

exports.getLRById = asyncHandler(async (req, res) => {
  if ((await IPR.findOne({ 'labRequest._id': req.params._id })) !== null) {
    const ipr = await IPR.findOne({ 'labRequest._id': req.params._id })
      .populate('labRequest.requester')
      .populate('labRequest.serviceId')
      .select({ labRequest: 1 });
    for (let i = 0; i < ipr.labRequest.length; i++) {
      if (ipr.labRequest[i]._id == req.params._id) {
        var lab1 = ipr.labRequest[i];
      }
    }
    res.status(200).json({ success: true, data: lab1 });
  }

  if ((await EDR.findOne({ 'labRequest._id': req.params._id })) !== null) {
    const edr = await EDR.findOne({ 'labRequest._id': req.params._id })
      .populate('labRequest.requester')
      .populate('labRequest.serviceId')
      .select({ labRequest: 1 });
    for (let i = 0; i < edr.labRequest.length; i++) {
      if (edr.labRequest[i]._id == req.params._id) {
        var lab2 = edr.labRequest[i];
      }
    }
    res.status(200).json({ success: true, data: lab2 });
  }
});

exports.getLRIPRById = asyncHandler(async (req, res) => {
  const ipr = await IPR.findOne({ 'labRequest._id': req.params._id })
    .populate('labRequest.requester')
    .populate('labRequest.serviceId')
    .select({ labRequest: 1 });
  for (let i = 0; i < ipr.labRequest.length; i++) {
    if (ipr.labRequest[i]._id == req.params._id) {
      var lab = ipr.labRequest[i];
    }
  }
  res.status(200).json({ success: true, data: lab });
});

exports.putLRIPRById = asyncHandler(async (req, res) => {
  var data = JSON.parse(req.body.data);
  if (req.file) {
    await IPR.findOneAndUpdate(
      { 'labRequest._id': data.labRequestId, _id: data.IPRId },
      data
    );
    await IPR.findOneAndUpdate(
      { 'labRequest._id': data.labRequestId, _id: data.IPRId },
      { $set: { 'labRequest.$.results': req.file.path } },
      { new: true }
    );
    await IPR.findOneAndUpdate(
      { 'labRequest._id': data.labRequestId, _id: data.IPRId },
      { $set: { 'labRequest.$.status': data.status } },
      { new: true }
    );
  } else {
    await IPR.findOneAndUpdate(
      { 'labRequest._id': data.labRequestId, _id: data.IPRId },
      data
    );
    await IPR.findOneAndUpdate(
      { 'labRequest._id': data.labRequestId, _id: data.IPRId },
      { $set: { 'labRequest.$.status': data.status } },
      { new: true }
    );
  }
  res.status(200).json({ success: true });
});

exports.putLRById = asyncHandler(async (req, res) => {
  var data = JSON.parse(req.body.data);
  var not;
  var request;
  const a = await IPR.findOne({
    'labRequest._id': data.labRequestId,
  });

  if (a !== null) {
    if (req.file) {
      await IPR.findOneAndUpdate(
        { 'labRequest._id': data.labRequestId, _id: data.IPRId },
        data
      );
      await IPR.findOneAndUpdate(
        { 'labRequest._id': data.labRequestId, _id: data.IPRId },
        { $set: { 'labRequest.$.results': req.file.path, 'labRequest.$.sampleId':data.sampleId } },
        { new: true }
      );
      not = await IPR.findOneAndUpdate(
        { 'labRequest._id': data.labRequestId, _id: data.IPRId },
        { $set: { 'labRequest.$.status': data.status, 'labRequest.$.sampleId':data.sampleId  } },
        { new: true }
      ).populate('patientId');
      for(let i=0 ; i<not.labRequest.length; i++)
      {
        if(not.labRequest[i]._id==data.labRequestId)
        {
          request=not.labRequest[i].LRrequestNo
        }
      }
      notification(
        'Laboratory Request',
        'Laboratory Request number ' +
          request +
          ' updated for Patient MRN ' +
          not.patientId.profileNo,
        'Lab Technician'
      );
      const pat = await IPR.findOne({ patientId: not.patientId });
      globalVariable.io.emit('get_data', pat);
    } else {
      await IPR.findOneAndUpdate(
        { 'labRequest._id': data.labRequestId, _id: data.IPRId },
        data
      );
      not = await IPR.findOneAndUpdate(
        { 'labRequest._id': data.labRequestId, _id: data.IPRId },
        { $set: { 'labRequest.$.status': data.status, 'labRequest.$.sampleId':data.sampleId  } },
        { new: true }
      ).populate('patientId');
      for(let i=0 ; i<not.labRequest.length; i++)
      {
        if(not.labRequest[i]._id==data.labRequestId)
        {
          request=not.labRequest[i].LRrequestNo
        }
      }
      notification(
        'Laboratory Request',
        'Laboratory Request number ' +
          request +
          ' updated for Patient MRN ' +
          not.patientId.profileNo,
        'Lab Technician'
      );
      const pat = await IPR.findOne({ patientId: not.patientId });
      globalVariable.io.emit('get_data', pat);
    }
    res.status(200).json({ success: true, data:not, requestNumber:request});
  }

  const b = await EDR.findOne({
    'labRequest._id': data.labRequestId,
  });
  if (b !== null) {
    if (req.file) {
      await EDR.findOneAndUpdate(
        { 'labRequest._id': data.labRequestId, _id: data.EDRId },
        data
      );
      await EDR.findOneAndUpdate(
        { 'labRequest._id': data.labRequestId, _id: data.EDRId },
        { $set: { 'labRequest.$.results': req.file.path, 'labRequest.$.sampleId':data.sampleId  } },
        { new: true }
      );
      not = await EDR.findOneAndUpdate(
        { 'labRequest._id': data.labRequestId, _id: data.EDRId },
        { $set: { 'labRequest.$.status': data.status, 'labRequest.$.sampleId':data.sampleId  } },
        { new: true }
      ).populate('patientId');
      for(let i=0 ; i<not.labRequest.length; i++)
      {
        if(not.labRequest[i]._id==data.labRequestId)
        {
          request=not.labRequest[i].LRrequestNo
        }
      }
      notification(
        'Laboratory Request',
        'Laboratory Request number ' +
          request +
          ' updated for Patient MRN ' +
          not.patientId.profileNo,
        'Lab Technician'
      );
      const pat = await EDR.findOne({ patientId: not.patientId });
      globalVariable.io.emit('get_data', pat);
    } else {
      await EDR.findOneAndUpdate(
        { 'labRequest._id': data.labRequestId, _id: data.EDRId },
        data
      );
      not = await EDR.findOneAndUpdate(
        { 'labRequest._id': data.labRequestId, _id: data.EDRId },
        { $set: { 'labRequest.$.status': data.status, 'labRequest.$.sampleId':data.sampleId  } },
        { new: true }
      ).populate('patientId');
        for(let i=0 ; i<not.labRequest.length; i++)
        {
          if(not.labRequest[i]._id==data.labRequestId)
          {
            request=not.labRequest[i].LRrequestNo
          }
        }
      notification(
        'Laboratory Request',
        'Laboratory Request number ' +
        request +
          ' updated for Patient MRN ' +
          not.patientId.profileNo,
        'Lab Technician'
      );
      const pat = await EDR.findOne({ patientId: not.patientId });
      globalVariable.io.emit('get_data', pat);
    }
    res.status(200).json({ success: true, data:not, requestNumber:request });
  }
});
exports.getIPRById = asyncHandler(async (req, res) => {
  const ipr = await IPR.find({ _id: req.params._id })
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
    .populate('dischargeRequest.dischargeMedication.medicine.itemId')
    .populate('followUp.approvalPerson')
    .populate('triageAssessment.requester')
    ;
  res.status(200).json({ success: true, data: ipr });
});

exports.getIPREDRById = asyncHandler(async (req, res) => {
  const a = await IPR.find({ _id: req.params._id });
  if (a !== null) {
    const ipr = await IPR.find({ _id: req.params._id })
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
      .populate('dischargeRequest.dischargeMedication.medicine.itemId')
      .populate('followUp.approvalPerson');
    res.status(200).json({ success: true, data: ipr });
  }
  const b = await EDR.find({ _id: req.params._id });
  if (b !== null) {
    const edr = await EDR.find({ _id: req.params._id })
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
    res.status(200).json({ success: true, data: edr });
  }
});

exports.addIPR = asyncHandler(async (req, res) => {
  const {
    patientId,
    generatedBy,
    consultationNote,
    residentNotes,
    pharmacyRequest,
    labRequest,
    radiologyRequest,
    nurseService,
    followUp,
    dischargeRequest,
    status,
    triageAssessment,
    functionalUnit,
    verified,
    insurerId,
    paymentMethod,
    claimed
  } = req.body;
  var count = 0;
  const edrCheck = await EDR.find({patientId:req.body.patientId})
    for( let i =0 ; i<edrCheck.length; i++)
    {
      if(edrCheck[i].status == "pending")
      {
        count++;
      }
      if(count>0)
      break;
    }
    const iprCheck = await IPR.find({patientId:req.body.patientId})
    for( let i =0 ; i<iprCheck.length; i++)
    {
      if(iprCheck[i].status == "pending")
      {
        count++;
      }
      if(count>0)
      break;
    }
  var now = new Date();
  var start = new Date(now.getFullYear(), 0, 0);
  var diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
  var oneDay = 1000 * 60 * 60 * 24;
  var day = Math.floor(diff / oneDay);
  if(count>0)
  {
    res.status(200).json({ success: false });
  }
  else{
  const ipr = await IPR.create({
    requestNo: 'IPR' +day+ requestNoFormat(new Date(), 'yyHHMM'),
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
    functionalUnit,
    verified,
    insurerId,
    paymentMethod,
    claimed:false
  });
  res.status(200).json({ success: true, data: ipr });
}

});

exports.deleteIPR = asyncHandler(async (req, res, next) => {
  const { _id } = req.params;
  const ipr = await IPR.findById(_id);
  if (!ipr) {
    return next(new ErrorResponse(`IPR not found with id of ${_id}`, 404));
  }
  await IPR.deleteOne({ _id: _id });
});

exports.updateIPR = asyncHandler(async (req, res, next) => {
  const { _id } = req.body;
  let ipr = await IPR.findById(_id);
  if (!ipr) {
    return next(new ErrorResponse(`IPR not found with id of ${_id}`, 404));
  }
  ipr = await IPR.updateOne({ _id: _id }, req.body);
  res.status(200).json({ success: true, data: ipr });
});

exports.addFollowUp = asyncHandler(async (req, res) => {
  var data = JSON.parse(req.body.data);

  if (req.file) {
    await IPR.findOneAndUpdate(
      { 'followUp._id': data.followUpId, _id: data.IPRId },
      data
    );
    await IPR.findOneAndUpdate(
      { 'followUp._id': data.followUpId, _id: data.IPRId },
      { $set: { 'followUp.$.file': req.file.path } },
      { new: true }
    );
  } else {
    await IPR.findOneAndUpdate(
      { 'followUp._id': data.followUpId, _id: data.IPRId },
      data
    );
  }
  res.status(200).json({ success: true });
});


exports.getConsultationOld = asyncHandler(async (req, res) => {
  const ipr = await IPR.find({
    'consultationNote': { $ne: [] },
  })
    .populate('patientId')
    .populate('consultationNote.requester')
    .select({ consultationNote: 1, requestNo: 1 });
  const edr = await EDR.find({
    'consultationNote': { $ne: [] },
  })
    .populate('patientId')
    .populate('consultationNote.requester')
    .select({ consultationNote: 1, requestNo: 1 });
  var data = [ipr.concat(edr)];
  res.status(200).json({ success: true, data: data });
});
exports.getConsultation = asyncHandler(async (req, res) => {
  var array=[]
  const ipr = await IPR.find({
    'consultationNote': { $ne: [] },
  })
    .populate('consultationNote.requester')
    .select({ consultationNote: 1 });
    for(let i = 0; i<ipr.length; i++)
    {
      for(let j=0; j<ipr[i].consultationNote.length; j++)
      {
        array.push(ipr[i].consultationNote[j])
      }
    }
  const edr = await EDR.find({
    'consultationNote': { $ne: [] },
  })
    .populate('consultationNote.requester')
    .select({ consultationNote: 1});
    for(let i = 0; i<edr.length; i++)
    {
      for(let j=0; j<edr[i].consultationNote.length; j++)
      {
        array.push(edr[i].consultationNote[j])
      }
    }
  res.status(200).json({ success: true, data: array });
});