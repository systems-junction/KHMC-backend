const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');
const fetch = require('node-fetch');




const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const FunctionalUnit = require('../models/functionalUnit');
const FunctionalUnitLog = require('../models/functionalUnitLogs');
const BusinessUnit = require('../models/businessUnit');
const Staff = require('../models/staff');

const blockchainUrl = require("../components/blockchain");

exports.getFUById = asyncHandler(async (req, res) => {
  const functionalUnits = await FunctionalUnit.findOne({_id:req.params._id}).populate('fuHead').populate('buId');  
  res.status(200).json({ success: true, data: functionalUnits });
});
exports.getWithBU = asyncHandler(async (req, res) => {
  const functionalUnits = await FunctionalUnit.find({buId:req.params._id}).populate('fuHead').populate('buId');  
  res.status(200).json({ success: true, data: functionalUnits });
});
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
  const fuLogs = await FunctionalUnitLog.find({fuId: req.params._id});

  res.status(200).json({ success: true, data: fuLogs });
});

exports.addFunctionalUnit = asyncHandler(async (req, res) => {
  const { fuName, description, fuHead, buId, status } = req.body;

  const functionalUnit = await FunctionalUnit.create({
    uuid: uuidv4(),
    fuName,
    description,
    fuHead,
    buId,
    status
  });
  const BC = {
    uuid: functionalUnit.uuid,
    fuName:functionalUnit.fuName,
    description:functionalUnit.description,
    fuHead:functionalUnit.fuHead,
    status:functionalUnit.status,
    buId:functionalUnit.buId,
    fuLogId:" ",
    createdAt:functionalUnit.createdAt,
    updatedAt:functionalUnit.updatedAt
  }; 
  (async () => {
    try {
        const response = await fetch(blockchainUrl+"addFunctionalUnit", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(BC),
          })
      const json = await response.json()
      console.log(json)
    } catch (error) {
      console.log(error.response.body);
    }
  })();
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

  const { _id } = req.body;

  let functionalUnit = await FunctionalUnit.findById(_id);

  if(!functionalUnit) {
    return next(
      new ErrorResponse(`Functional Unit not found with id of ${_id}`, 404)
    );
  }

  functionalUnit = await FunctionalUnit.findOneAndUpdate({_id: _id}, req.body);
  const BC = {
    uuid: functionalUnit.uuid,
    fuName:functionalUnit.fuName,
    description:functionalUnit.description,
    fuHead:functionalUnit.fuHead,
    status:functionalUnit.status,
    buId:functionalUnit.buId,
    fuLogId:" ",
    createdAt:functionalUnit.createdAt,
    updatedAt:functionalUnit.updatedAt
  }; 
  (async () => {
    try {
        const response = await fetch(blockchainUrl+"updateFunctionalUnit", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(BC)
          })
      const json = await response.json()
      console.log(json)
    } catch (error) {
      console.log(error.response.body);
    }
  })();

  res.status(200).json({ success: true, data: functionalUnit });
});

exports.getHead = asyncHandler(async (req, res) => {
  const head = await FunctionalUnit.find({fuHead: req.params._id}).populate('buId');
  res.status(200).json({ success: true, data: head });
});