const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const FunctionalUnit = require('../models/functionalUnit');
const FunctionalUnitLog = require('../models/functionalUnitLogs');
const BusinessUnit = require('../models/businessUnit');
const Staff = require('../models/staff');

exports.getFunctionalUnits = asyncHandler(async (req, res) => {
  const functionalUnits = await FunctionalUnit.find().populate('fuHead').populate('buId').populate('fuLogId');
  const businessUnit = await BusinessUnit.find();
  const staff = await Staff.find();
  const statues = [{key:'active', value:'Active'}, {key:'in_active', value:'In Active'}];

  const data ={
    functionalUnits,
    businessUnit,
    staff,
    statues
  }
  
  res.status(200).json({ success: true, data: data });
});

exports.getFunctionalUnitLogs = asyncHandler(async (req, res) => {
  console.log("req: ", req.params)
  const fuLogs = await FunctionalUnitLog.find({fuId: req.params._id});

  res.status(200).json({ success: true, data: fuLogs });
});

exports.addFunctionalUnit = asyncHandler(async (req, res) => {
  const { fuName, description, fuHead, buId, status, updatedBy, reason } = req.body;
  const _id = new mongoose.mongo.ObjectID();

  const fuLogs = await FunctionalUnitLog.create({
    uuid: uuidv4(),
    status,
    reason,
    fuId: _id,
    updatedBy
  });

  const functionalUnit = await FunctionalUnit.create({
    _id,
    uuid: uuidv4(),
    fuName,
    description,
    fuHead,
    buId,
    status,
    fuLogId: fuLogs._id
  });

  res.status(200).json({ success: true, data: functionalUnit });
});

exports.deleteFunctionalUnit = asyncHandler(async (req, res, next) => {
    // const { _id } = req.params;
    // const functionalUnit = await FunctionalUnit.findById(_id);

    // if(!functionalUnit) {
    //   return next(
    //     new ErrorResponse(`Functional Unit not found with id of ${_id}`, 404)
    //   );
    // }

    // await FunctionalUnit.deleteOne({_id: _id});
    res.status(200).json({ success: false, data: {}, msg:'Can not delete the record permanently' });
});

exports.updateFunctionalUnit = asyncHandler(async (req, res, next) => {

  const { _id, fuLogId, updatedBy, reason, status } = req.body;

  let functionalUnitLog = await FunctionalUnitLog.findById(fuLogId);
  let functionalUnit = await FunctionalUnit.findById(_id);

  if(!functionalUnitLog) {
    return next(
      new ErrorResponse(`Functional unit Log not found with id of ${_id}`, 404)
    );
  }
  else if(updatedBy !== functionalUnitLog.updatedBy || (status && functionalUnitLog.status !== status)){ // create new log when staus or updated by changed
    console.log("Create: ", reason, status);
    functionalUnitLog = await FunctionalUnitLog.create({
      uuid: uuidv4(),
      status,
      reason,
      fuId: functionalUnit._id,
      updatedBy
    });
    req.body.fuLogId = functionalUnitLog._id;
  }   
  else if(functionalUnitLog.reason !== reason){ // update the log when only reason changes
    functionalUnitLog.status = status;
    functionalUnitLog.updatedBy = updatedBy;
    functionalUnitLog.reason = reason;
    functionalUnitLog = await FunctionalUnitLog.updateOne({_id: fuLogId}, functionalUnitLog);
  }

  if(!functionalUnit) {
    return next(
      new ErrorResponse(`Functional Unit not found with id of ${_id}`, 404)
    );
  }

  functionalUnit = await FunctionalUnit.updateOne({_id: _id}, req.body);
  res.status(200).json({ success: true, data: functionalUnit });
});
exports.getHead = asyncHandler(async (req, res) => {
  const head = await FunctionalUnit.find({fuHead: req.params._id}).populate('buId');
  res.status(200).json({ success: true, data: head });
});