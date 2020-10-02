
const asyncHandler = require('../middleware/async');
const CPT = require('../models/cptCodes');
const ICD = require('../models/icd10Codes');

exports.getCPT = asyncHandler(async (req, res) => {
  const cpt = await CPT.find().select({procedureCodeCategory:1,cptCodes:1})
  res.status(200).json({ success: true, data: cpt });
});

exports.getCPTById = asyncHandler(async (req, res) => {
    const cpt = await CPT.findOne({_id:req.params.id})
    res.status(200).json({ success: true, data: cpt });
  });

exports.getICD = asyncHandler(async (req, res) => {
    const icd = await ICD.find().select({procedureCodeCategory:1,icd10PCSCodes:1})
    res.status(200).json({ success: true, data: icd });
  });

  exports.getICDById = asyncHandler(async (req, res) => {
    const icd = await ICD.findOne({_id:req.params.id})
    res.status(200).json({ success: true, data: icd });
  });