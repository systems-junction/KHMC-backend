const bcrypt = require('bcryptjs');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Insurance = require('../models/insurance');
const IV = require('../models/insuranceVendors');

exports.getInsurance = asyncHandler(async (req, res) => {
  const insurance = await Insurance.find();
  res.status(200).json({ success: true, data: insurance });
});
exports.getInsuranceById = asyncHandler(async (req, res) => {
    const insurance = await Insurance.find({_id:req.params._id});
    res.status(200).json({ success: true, data: insurance });
  });
exports.addInsurance = asyncHandler(async (req, res) => {
  const { englishName, arabicName, telephone1, telephone2, fax, email,
    tax, address1, address2, country, city, poBox,
    zipCode, discountRate, coverageTerms, paymentTerms, exceptions, subsidiary,
    priceList } = req.body;
  const insurance = await Insurance.create({
    englishName,
    arabicName,
    telephone1,
    telephone2,
    fax,
    email,
    tax,
    address1,
    address2,
    country,
    city,
    poBox,
    zipCode,
    discountRate,
    coverageTerms,
    paymentTerms,
    exceptions,
    subsidiary,
    priceList
});
  res.status(200).json({ success: true, data: insurance });
});

exports.deleteInsurance = asyncHandler(async (req, res, next) => {
  const { _id } = req.params;
  const insurance = await Insurance.findById(_id);
  if (!insurance) {
    return next(
      new ErrorResponse(`Insurance not found with id of ${_id}`, 404)
    );
  }
  await Insurance.deleteOne({ _id: _id });
});

exports.updateInsurance = asyncHandler(async (req, res, next) => {
  const { _id } = req.body;
  let insurance = await Insurance.findById(_id);
  if (!insurance) {
    return next(
      new ErrorResponse(`Insurance not found with id of ${_id}`, 404)
    );
  }
  insurance = await Insurance.updateOne({ _id: _id }, req.body);
  res.status(200).json({ success: true, data: insurance });
});

exports.addInsuranceVendor = asyncHandler(async (req, res) => {
  const { 
  name,
  poBox,
  zipCode,
  telephone1,
  telephone2,
  address,
  faxNo,
  email,
  country,
  city,
  taxNo,
  contractualDiscount,
  subCompanies,
  exceptions,
  agreedPricePolicy,
  paymentTerms
  } = req.body;
  const insurance = await IV.create({
  name,
  poBox,
  zipCode,
  telephone1,
  telephone2,
  address,
  faxNo,
  email,
  country,
  city,
  taxNo,
  contractualDiscount,
  subCompanies,
  exceptions,
  agreedPricePolicy,
  paymentTerms
});
  res.status(200).json({ success: true, data: insurance });
});