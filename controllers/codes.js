
const asyncHandler = require('../middleware/async');
const CPT = require('../models/cptCodes');
const ICD = require('../models/icd10Codes');

exports.getCPT = asyncHandler(async (req, res) => {
  const cpt = await CPT.find().select({procedureCodeCategory:1,cptCodes:1})
  res.status(200).json({ success: true, data: cpt });
});

exports.getCPTCategories = asyncHandler(async (req, res) => {
  const cpt = await CPT.find().select({procedureCodeCategory:1})
  var uniqueArray = (function(cpt){
      var m = {}, uniqueArray = []
      for (var i=0; i<cpt.length; i++) {
        var v = cpt[i].procedureCodeCategory;
        if (!m[v]) {
          uniqueArray.push(v);
          m[v]=true;
        }
      }
      return uniqueArray;
    })(cpt);
  res.status(200).json({ success: true, data: uniqueArray });
});
exports.getCPTByCategories = asyncHandler(async (req, res) => {
  const cpt = await CPT.find({procedureCodeCategory:req.params.code}).select({cptCodes:1,procedureCodeDescriptions:1})
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

  exports.getICDCategories = asyncHandler(async (req, res) => {
    const icd = await ICD.find().select({procedureCodeCategory:1})
    var uniqueArray = (function(icd){
        var m = {}, uniqueArray = []
        for (var i=0; i<icd.length; i++) {
          var v = icd[i].procedureCodeCategory;
          if (!m[v]) {
            uniqueArray.push(v);
            m[v]=true;
          }
        }
        return uniqueArray;
      })(icd);
    res.status(200).json({ success: true, data: uniqueArray });
  });
  exports.getICDByCategories = asyncHandler(async (req, res) => {
    const icd = await ICD.find({procedureCodeCategory:req.params.code}).select({icd10PCSCodes:1,procedureCodeDescriptions:1})
    res.status(200).json({ success: true, data: icd });
  });

  exports.getICDById = asyncHandler(async (req, res) => {
    const icd = await ICD.findOne({_id:req.params.id})
    res.status(200).json({ success: true, data: icd });
  });