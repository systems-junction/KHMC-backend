const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const BusinessUnit = require('../models/businessUnit');
const BusinessUnitLogs = require('../models/businessUnitLogs');
const Staff = require('../models/staff');

exports.getBusinessUnit = asyncHandler(async (req, res) => {
    const businessUnit = await BusinessUnit.find().populate('buLogsId').populate('buHead');
    // const buHeads = await Staff.find({"staffTypeId":{$ne:null}}).populate({
    //   path: 'staffTypeId',
    //   match: { type: "BU Head" },
    // })
  const buHeads = await Staff.aggregate([
  {
    $lookup:{from:'stafftypes',localField:'staffTypeId',foreignField:'_id',as:'staffTypeId'}

  },
  {
    $unwind:"$staffTypeId"
  },
  {$match:{"staffTypeId.type":"BU Head"}}
  ])
    const divisions = [{key:'medical_ops', value:'Medical Ops'}, {key:'hosp_ops', value:'Hosp Ops'}];
    const statues = [{key:'active', value:'Active'}, {key:'in_active', value:'In Active'}];

    const data = {
      businessUnit,
      divisions,
      buHeads,
      statues
    }
    res.status(200).json({ success: true, data: data });
});

exports.getBusinessUnitLogs = asyncHandler(async (req, res) => {
  const buLogs = await BusinessUnitLogs.find({buId: req.params._id});

  res.status(200).json({ success: true, data: buLogs });
});
exports.getHead = asyncHandler(async (req, res) => {
  const head = await BusinessUnit.find({buHead: req.params._id});
  res.status(200).json({ success: true, data: head });
});

exports.addBusinessUnit = asyncHandler(async (req, res) => {
    const { buName, description, division, buHead, status, updatedBy, reason } = req.body;
    const _id = new mongoose.mongo.ObjectID();

    const buLogs = await BusinessUnitLogs.create({
      uuid: uuidv4(),
      status,
      reason,
      buId: _id,
      updatedBy
    });
  
    const businessUnit = await BusinessUnit.create({
        _id,
        uuid: uuidv4(),
        buName,
        description,
        division,
        buHead,
        status,
        buLogsId: buLogs._id
    });

    res.status(200).json({ success: true, data: businessUnit });
});

exports.deleteBusinessUnit = asyncHandler(async (req, res, next) => {
    // const { _id } = req.params;
    // const businessUnit = await BusinessUnit.findById(_id);

    // if(!businessUnit) {
    //   return next(
    //     new ErrorResponse(`Business unit not found with id of ${_id}`, 404)
    //   );
    // }

    // await BusinessUnit.deleteOne({_id: _id});

    res.status(200).json({ success: false, data: {}, msg:'Can not delete permanentaly' });

});

exports.updateBusinessUnit = asyncHandler(async (req, res, next) => {
    const { _id, buLogsId, updatedBy, reason, status } = req.body;
  

    let businessUnitLogs = await BusinessUnitLogs.findById(buLogsId);
    let businessUnit = await BusinessUnit.findById(_id);

    if(!businessUnitLogs) {
      return next(
        new ErrorResponse(`Business unit Log not found with id of ${_id}`, 404)
      );
    }
    else if(updatedBy !== businessUnitLogs.updatedBy || (status && businessUnitLogs.status !== status)){ // create new log when staus or updated by changed
      businessUnitLogs = await BusinessUnitLogs.create({
        uuid: uuidv4(),
        status,
        reason,
        buId: businessUnit._id,
        updatedBy
      });
      req.body.buLogsId = businessUnitLogs._id;
    }
    else if(businessUnitLogs.reason !== reason){ // update the log when only reason changes
      
      businessUnitLogs.status = status;
      businessUnitLogs.updatedBy = updatedBy;
      businessUnitLogs.reason = reason;

      businessUnitLogs = await BusinessUnitLogs.updateOne({_id: buLogsId}, businessUnitLogs);
    }

    if(!businessUnit) {
      return next(
        new ErrorResponse(`Business unit not found with id of ${_id}`, 404)
      );
    }

    businessUnit = await BusinessUnit.updateOne({_id: _id}, req.body);
    res.status(200).json({ success: true, data: businessUnit });
});