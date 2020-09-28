const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { v4: uuidv4 } = require('uuid');
const EDR = require('../models/EDR');
const IPR = require('../models/IPR');
const DR = require ('../models/dischargeRequest');

exports.getEDRdischarge = asyncHandler(async (req, res) => {
  const edr = await EDR.find({'dischargeRequest.dischargeMedication.medicine':{$ne:[]}})
  .populate('patientId')
  .populate('consultationNote.requester')
  .populate('residentNotes.doctorRef').populate('dischargeRequest.dischargeMedication.requester')
  .populate('dischargeRequest.dischargeMedication.requester')
  .populate('dischargeRequest.dischargeMedication.medicine.itemId')
  // .populate('pharmacyRequest.requester').populate('pharmacyRequest.medicine.itemId')
  .populate('labRequest.requester').populate('labRequest.serviceId')
  .populate('radiologyRequest.serviceId').populate('radiologyRequest.requester')  
  const ipr = await IPR.find({'dischargeRequest.dischargeMedication.medicine':{$ne:[]}})
  .populate('patientId')
  .populate('consultationNote.requester')
  .populate('residentNotes.doctorRef').populate('dischargeRequest.dischargeMedication.requester')
  .populate('dischargeRequest.dischargeMedication.requester')
  .populate('dischargeRequest.dischargeMedication.medicine.itemId')
  // .populate('pharmacyRequest.requester').populate('pharmacyRequest.medicine.itemId')
  .populate('labRequest.requester').populate('labRequest.serviceId')
  .populate('nurseService.requester').populate('nurseService.serviceId')
  .populate('radiologyRequest.serviceId').populate('radiologyRequest.requester')  
  const data = edr.concat(ipr)
  res.status(200).json({ success: true, data: data });
});

exports.addDischargeRequest = asyncHandler(async (req, res) => {
    // var parsed = JSON.parse(req.body.data);
    // var dr;
        const dr = await DR.create({
        edrId: req.body.edrId,
        iprId: req.body.iprId,
        generatedFor: req.body.generatedFor,
        paymentMethod: req.body.paymentMethod,
        depositAmount: req.body.depositAmount,
        amountReceived: req.body.amountReceived,
        totalAmount: req.body.totalAmount,
        bankName: req.body.bankName,
        depositorName: req.body.depositorName,
        receivedBy:req.body.receivedBy
              });
              // console.log(dr)
    // if (req.file) {
    //   dr = await DR.create({
    //     edrId: parsed.edrId,
    //     iprId: parsed.iprId,
    //     generatedFor: parsed.generatedFor,
    //     paymentMethod: parsed.paymentMethod,
    //     depositAmount: parsed.depositAmount,
    //     amountReceived: parsed.amountReceived,
    //     totalAmount: parsed.totalAmount,
    //     bankName: parsed.bankName,
    //     depositorName: parsed.depositorName,
    //     depositSlip: req.file.path,
    //     receivedBy:parsed.receivedBy
    //   });
    // } else {
    //   dr = await DR.create({
    //     edrId: parsed.edrId,
    //     iprId: parsed.iprId,
    //     generatedFor: parsed.generatedFor,
    //     paymentMethod: parsed.paymentMethod,
    //     depositAmount: parsed.depositAmount,
    //     amountReceived: parsed.amountReceived,
    //     totalAmount: parsed.totalAmount,
    //     bankName: parsed.bankName,
    //     depositorName: parsed.depositorName,
    //     receivedBy:parsed.receivedBy
    //   });
    // }
    if(dr && req.body.edrId)
    {
      // await EDR.findOneAndUpdate({ _id: parsed.edrId},{ $set: { 'dischargeRequest.status': 'Complete' } })
      // await EDR.findOneAndUpdate({ _id: parsed.edrId},{ $set: { 'status': 'Discharged' } })
            await EDR.findOneAndUpdate({ _id: req.body.edrId},{ $set: { 'status': 'Discharged' } })
    }
    if (dr && req.body.iprId)
    {

      // await IPR.findOneAndUpdate({ _id: parsed.iprId},{ $set: { 'dischargeRequest.status': 'Complete' } })
      // await IPR.findOneAndUpdate({ _id: parsed.iprId},{ $set: { 'status': 'Discharged' } })
      await IPR.findOneAndUpdate({ _id: req.body.iprId},{ $set: { 'status': 'Discharged' } })
    }
    res.status(200).json({ success: true, data: dr });
  });