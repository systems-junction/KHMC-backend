const { v4: uuidv4 } = require('uuid');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Item = require('../models/item');
const Vendor = require('../models/vendor');
const FunctionalUnit = require('../models/functionalUnit');

exports.getItem = asyncHandler(async (req, res) => {
  const _id = req.params._id;
  const item = Item.findById(_id);
  if (!item) {
    return next(new ErrorResponse(`Item not found with id of ${_id}`, 404));
  }

  res.status(200).json({ success: true, data: item });
});

exports.getItems = asyncHandler(async (req, res) => {
  const items = await Item.find().populate('vendorId').limit(100);
  const vendors = await Vendor.find();
  const functionalUnit = await FunctionalUnit.find();
  const classes = [
    { key: 'Medical', value: 'Medical' },
    { key: 'Non-Medical', value: 'Non Medical' },
  ];
  const medClasses = [
    { key: 'Pharmaceutical', value: 'Pharmaceutical', parent: 'Medical' },
    {
      key: 'Non Pharmaceutical',
      value: 'Non Pharmaceutical',
      parent: 'Medical',
    },
  ];
  const subClasses = [
    {
      key: 'Medical Supplies & Instruments',
      value: 'Medical Supplies & Instruments',
      parent: 'Non Pharmaceutical',
    },
    { key: 'Medicine', value: 'Medicine', parent: 'Pharmaceutical' },
    {
      key: 'Laboratory Supplies',
      value: 'Laboratory Supplies',
      parent: 'Non Pharmaceutical',
    },
    {
      key: 'Radiology Medicine & Supplies',
      value: 'Radiology Medicine & Supplies',
      parent: 'Pharmaceutical',
    },
    {
      key: 'Food & Beverage',
      value: 'Food & Beverage',
      parent: 'Non-Medical',
    },
    {
      key: 'Food Supplies',
      value: 'Food Supplies',
      parent: 'Non-Medical',
    },
    {
      key: 'Housekeeping Supplies',
      value: 'Housekeeping Supplies',
      parent: 'Non-Medical',
    },
    { key: 'Maintenance', value: 'Maintenance', parent: 'Non-Medical' },
    { key: 'Textile', value: 'Textile', parent: 'Non-Medical' },
    {
      key: 'Office & Stationary Supplies',
      value: 'Office & Stationary Supplies',
      parent: 'Non-Medical',
    },
  ];
  const grandSubClasses = [
    { key: 'BV-beverage', value: 'BV-beverage', parent: 'Food & Beverage' },
    { key: 'FO-FOOD', value: 'FO-FOOD', parent: 'Food & Beverage' },
    { key: 'FR-FROZEN', value: 'FR-FROZEN', parent: 'Food & Beverage' },
    {
      key: 'FS - Food Supplies',
      value: 'FS - Food Supplies',
      parent: 'Food & Beverage',
    },
    {
      key: 'VE - Vigetables Supplies',
      value: 'VE - Vigetables Supplies',
      parent: 'Food & Beverage',
    },
    {
      key: 'CA - Cafeteria Supplies',
      value: 'CA - Cafeteria Supplies',
      parent: 'Food Supplies',
    },
    {
      key: 'KM - Kitchen Materials',
      value: 'KM - Kitchen Materials',
      parent: 'Food Supplies',
    },
    {
      key: 'HS - House Keeping Supplies',
      value: 'HS - House Keeping Supplies',
      parent: 'Housekeeping Supplies',
    },

    {
      key: 'CH - Chemicals',
      value: 'CH - Chemicals',
      parent: 'Laboratory Supplies',
    },
    {
      key: 'DP - Disposables',
      value: 'DP - Disposables',
      parent: 'Laboratory Supplies',
    },
    { key: 'KT - Kits', value: 'KT - Kits', parent: 'Laboratory Supplies' },
    { key: 'RG -Reagents', value: 'RG -Reagents', parent: 'Laboratory Supplies' },
    {
      key: 'MAC - Airconditioning',
      value: 'MAC - Airconditioning',
      parent: 'Maintenance',
    },
    {
      key: 'MCD - Carpintary & Decoration',
      value: 'MCD - Carpintary & Decoration',
      parent: 'Maintenance',
    },
    { key: 'MCK - Ceramic', value: 'MCK - Ceramic', parent: 'Maintenance' },
    { key: 'MDL - Dubai Light', value: 'MDL - Dubai Light', parent: 'Maintenance' },
    { key: 'MEC - Electronics', value: 'MEC - Electronics', parent: 'Maintenance' },
    { key: 'MEL - Electricity', value: 'MEL - Electricity', parent: 'Maintenance' },
    {
      key: 'MGM - General Maintinace',
      value: 'MGM - General Maintinace',
      parent: 'Maintenance',
    },
    { key: 'MME - MECHANIC', value: 'MME - MECHANIC', parent: 'Maintenance' },
    { key: 'MPD - Pad', value: 'MPD - Pad', parent: 'Maintenance' },
    { key: 'MPE - Paint', value: 'MPE - Paint', parent: 'Maintenance' },
    { key: 'MPL - PLUMPING', value: 'MPL - PLUMPING', parent: 'Maintenance' },
    { key: 'MPV - PVC', value: 'MPV - PVC', parent: 'Maintenance' },
    { key: 'MSA - Safety', value: 'MSA - Safety', parent: 'Maintenance' },
    { key: 'MSL - Singal', value: 'MSL - Singal', parent: 'Maintenance' },
    { key: 'MSN - Stain', value: 'MSN - Stain', parent: 'Maintenance' },

    { key: 'CL - Cath. Supplies', value: 'CL - Cath. Supplies', parent: 'Medical Supplies & Instruments' },
    {
      key: 'CLS - CATH STENTING SUPPLIES',
      value: 'CLS - CATH STENTING SUPPLIES',
      parent: 'Medical Supplies & Instruments',
    },
    {
      key: 'CS -Cardiac Supplies',
      value: 'CS -Cardiac Supplies',
      parent: 'Medical Supplies & Instruments',
    },
    { key: 'IV - I.V.F Supplies', value: 'IV - I.V.F Supplies', parent: 'Medical Supplies & Instruments' },
    {
      key: 'KS -Kidney Supplies',
      value: 'KS -Kidney Supplies',
      parent: 'Medical Supplies & Instruments',
    },
    {
      key: 'MEI - MEDICAL INSTRUMENT',
      value: 'MEI - MEDICAL INSTRUMENT',
      parent: 'Medical Supplies & Instruments',
    },
    {
      key: 'MS - Medical Supplies',
      value: 'MS - Medical Supplies',
      parent: 'Medical Supplies & Instruments',
    },
    {
      key: 'OS - Orthopedic Supplies',
      value: 'OS - Orthopedic Supplies',
      parent: 'Medical Supplies & Instruments',
    },
    {
      key: 'Pathology supplies',
      value: 'Pathology supplies',
      parent: 'Medical Supplies & Instruments',
    },

    { key: 'ME - Medicines', value: 'ME - Medicines', parent: 'Medicine' },

    {
      key: 'OF - Office Supplies',
      value: 'OF - Office Supplies',
      parent: 'Office & Stationary Supplies',
    },
    {
      key: 'ST -Stationary Supplies',
      value: 'ST -Stationary Supplies',
      parent: 'Office & Stationary Supplies',
    },

    {
      key: 'CM-Contrast Media Supplies',
      value: 'CM-Contrast Media Supplies',
      parent: 'Radiology Medicine & Supplies',
    },
    {
      key: 'MRI Contrast Media',
      value: 'MRI Contrast Media',
      parent: 'Radiology Medicine & Supplies',
    },
    { key: 'XR-Supplies', value: 'XR-Supplies', parent: 'Radiology Medicine & Supplies' },

    { key: 'TE-TEXTILE', value: 'TE-TEXTILE', parent: 'Textile' },
  ];

  const data = {
    items,
    vendors,
    functionalUnit,
    classes,
    medClasses,
    subClasses,
    grandSubClasses,
  };

  res.status(200).json({ success: true, data: data });
});

exports.getSearchedItems = asyncHandler(async (req, res) => {
  const items = await Item.find({
    $or: [
      { tradeName: { $regex: "^"+req.params.keyword, $options: 'i' } },
      { scientificName: { $regex: "^"+req.params.keyword, $options: 'i' } },
      { itemCode: { $regex: "^"+req.params.keyword, $options: 'i' } },
    ],
  }).limit(100).populate('vendorId');
  const data = {
    items,
  };
  res.status(200).json({ success: true, data: data });
});
exports.getSearchedItemsNM = asyncHandler(async (req, res) => {
  const items = await Item.find({
    $or: [
      { tradeName: { $regex: "^"+req.params.keyword, $options: 'i' } },
      { scientificName: { $regex: "^"+req.params.keyword, $options: 'i' } },
      { itemCode: { $regex: "^"+req.params.keyword, $options: 'i' } },
    ],
    cls: 'Non-Medical',
  }).limit(100).populate('vendorId');
  const data = {
    items,
  };
  res.status(200).json({ success: true, data: data });
});
exports.getSearchedItemsP = asyncHandler(async (req, res) => {
  const items = await Item.find({
    $or: [
      { tradeName: { $regex: "^"+req.params.keyword, $options: 'i' } },
      { scientificName: { $regex: "^"+req.params.keyword, $options: 'i' } },
      { itemCode: { $regex: "^"+req.params.keyword, $options: 'i' } },
    ],
    cls: 'Medical',
    medClass: 'Pharmaceutical',
  }).limit(100).populate('vendorId');
  const data = {
    items,
  };
  res.status(200).json({ success: true, data: data });
});
exports.getSearchedItemsNP = asyncHandler(async (req, res) => {
  const items = await Item.find({
    $or: [
      { tradeName: { $regex: "^"+req.params.keyword, $options: 'i' } },
      { scientificName: { $regex: "^"+req.params.keyword, $options: 'i' } },
      { itemCode: { $regex: "^"+req.params.keyword, $options: 'i' } },
    ],
    cls: 'Medical',
    medClass: 'Non Pharmaceutical',
  }).limit(100).populate('vendorId');
  const data = {
    items,
  };
  res.status(200).json({ success: true, data: data });
});
exports.addItem = asyncHandler(async (req, res, next) => {
  const {
    name,
    description,
    itemCode,
    vendorId,
    purchasePrice,
    receiptUnit,
    issueUnit,
    minimumLevel,
    maximumLevel,
    reorderLevel,
    form,
    drugAllergy,
    cls,
    medClass,
    subClass,
    grandSubClass,
    comments,
    tax,
    receiptUnitCost,
    issueUnitCost,
    scientificName,
    tradeName,
    temprature,
    humidity,
    expiration,
    lightSensitive,
    resuableItem,
    storageCondition,
  } = req.body;
  const item = await Item.create({
    uuid: uuidv4(),
    name,
    description,
    itemCode,
    vendorId,
    purchasePrice,
    receiptUnit,
    issueUnit,
    minimumLevel,
    maximumLevel,
    reorderLevel,
    form,
    drugAllergy,
    cls,
    medClass,
    subClass,
    grandSubClass,
    comments,
    tax,
    receiptUnitCost,
    issueUnitCost,
    scientificName,
    tradeName,
    temprature,
    humidity,
    expiration,
    lightSensitive,
    resuableItem,
    storageCondition,
  });

  res.status(200).json({ success: true, data: item });
});

exports.deleteItem = asyncHandler(async (req, res, next) => {
  const { _id } = req.params;
  const item = await Item.findById(_id);

  if (!item) {
    return next(new ErrorResponse(`Item not found with id of ${_id}`, 404));
  }

  await Item.deleteOne({ _id: _id });

  res.status(200).json({ success: true, data: {} });
});

exports.updateItem = asyncHandler(async (req, res, next) => {
  const { _id } = req.body;

  let item = await Item.findById(_id);

  if (!item) {
    return next(new ErrorResponse(`Item not found with id of ${_id}`, 404));
  }

  item = await Item.updateOne({ _id: _id }, req.body);

  res.status(200).json({ success: true, data: item });
});
