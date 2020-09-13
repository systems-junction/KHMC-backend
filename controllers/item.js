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
  const items = await Item.find().populate('vendorId');
  const vendors = await Vendor.find();
  const functionalUnit = await FunctionalUnit.find();
  const classes = [
    { key: 'Medical', value: 'Medical' },
    { key: 'Non_medical', value: 'Non Medical' },
  ];
  const medClasses = [
    { key: 'Pharmaceutical', value: 'Pharmaceutical', parent: 'Medical' },
    {
      key: 'Non_pharmaceutical',
      value: 'Non Pharmaceutical',
      parent: 'Medical',
    },
  ];
  const subClasses = [
    {
      key: 'medical_supplies',
      value: 'Medical Supplies & Instruments',
      parent: 'non_pharmaceutical',
    },
    { key: 'medicine', value: 'Medicine', parent: 'pharmaceutical' },
    {
      key: 'laboratory_supplies',
      value: 'Laboratory Supplies',
      parent: 'non_pharmaceutical',
    },
    {
      key: 'radiology_medicine',
      value: 'Radiology Medicine & Supplies',
      parent: 'pharmaceutical',
    },
    {
      key: 'food_beverage',
      value: 'Food & Beverage',
      parent: 'non_pharmaceutical',
    },
    {
      key: 'food_supplies',
      value: 'Food Supplies',
      parent: 'non_pharmaceutical',
    },
    {
      key: 'housekeeping_supplies',
      value: 'Housekeeping Supplies',
      parent: 'non_medical',
    },
    { key: 'maintenance', value: 'Maintenance', parent: 'non_medical' },
    { key: 'textile', value: 'Textile', parent: 'non_medical' },
    {
      key: 'office_stationary_supplies',
      value: 'Office & Stationary Supplies',
      parent: 'non_medical',
    },
  ];
  const grandSubClasses = [
    { key: 'bv_beverage', value: 'BV-beverage', parent: 'food_beverage' },
    { key: 'fo_food', value: 'FO-FOOD', parent: 'food_beverage' },
    { key: 'fr_frozen', value: 'FR-FROZEN', parent: 'food_beverage' },
    {
      key: 'fs_food_supplies',
      value: 'FS-Food Supplies',
      parent: 'food_beverage',
    },
    {
      key: 've_vegetables_supplies',
      value: 'VE-Vegetables Supplies',
      parent: 'food_beverage',
    },
    {
      key: 'ca_cafeteria',
      value: 'CA-Cafeteria Supplies',
      parent: 'food_supplies',
    },
    {
      key: 'km_kitchen',
      value: 'KM-Kitchen Materials',
      parent: 'food_supplies',
    },
    {
      key: 'hs_house_keeping',
      value: 'HS-House Keeping Supplies',
      parent: 'housekeeping_supplies',
    },

    {
      key: 'ch_chemicals',
      value: 'CH-Chemicals',
      parent: 'laboratory_supplies',
    },
    {
      key: 'dp_disposables',
      value: 'DP-Disposables',
      parent: 'laboratory_supplies',
    },
    { key: 'kt_kits', value: 'KT-Kits', parent: 'laboratory_supplies' },
    { key: 'rg_reagents', value: 'RG-Reagents', parent: 'laboratory_supplies' },
    {
      key: 'mac_air_conditioning',
      value: 'MAC-Air conditioning',
      parent: 'maintenance',
    },
    {
      key: 'mdc_carpentry',
      value: 'MCD-Carpentry & Decoration',
      parent: 'maintenance',
    },
    { key: 'mck_ceramic', value: 'MCK-Ceramic', parent: 'maintenance' },
    { key: 'mdl_dubai_light', value: 'MDL-Dubai Light', parent: 'maintenance' },
    { key: 'mec_electronics', value: 'MEC-Electronics', parent: 'maintenance' },
    { key: 'mel_electricity', value: 'MEL-Electricity', parent: 'maintenance' },
    {
      key: 'mgm_general',
      value: 'MGM-General Maintenance',
      parent: 'maintenance',
    },
    { key: 'mme_mechanic', value: 'MME-MECHANIC', parent: 'maintenance' },
    { key: 'mpd_pad', value: 'MPD-Pad', parent: 'maintenance' },
    { key: 'mpe_paint', value: 'MPE-Paint', parent: 'maintenance' },
    { key: 'mpl_plumping', value: 'MPL-PLUMPING', parent: 'maintenance' },
    { key: 'mpv_pvc', value: 'MPV-PVC', parent: 'maintenance' },
    { key: 'msa_safety', value: 'MSA-Safety', parent: 'maintenance' },
    { key: 'msl_signal', value: 'MSL-Singal', parent: 'maintenance' },
    { key: 'msn_stain', value: 'MSN-Stain', parent: 'maintenance' },

    { key: 'cl_cath', value: 'CL-Cath.Supplies', parent: 'medical_supplies' },
    {
      key: 'cls_cath',
      value: 'CLS-CATH STENTING SUPPLIES',
      parent: 'medical_supplies',
    },
    {
      key: 'cs_cardiac',
      value: 'CS-Cardiac Supplies',
      parent: 'medical_supplies',
    },
    { key: 'iv_i.v.f', value: 'IV-I.V.F Supplies', parent: 'medical_supplies' },
    {
      key: 'ks_kidney',
      value: 'KS-Kidney Supplies',
      parent: 'medical_supplies',
    },
    {
      key: 'mei_medical',
      value: 'MEI-MEDICAL INSTRUMENT',
      parent: 'medical_supplies',
    },
    {
      key: 'ms_medical',
      value: 'MS-Medical Supplies',
      parent: 'medical_supplies',
    },
    {
      key: 'os_orthopedic',
      value: 'OS-Orthopedic Supplies',
      parent: 'medical_supplies',
    },
    {
      key: 'pathology',
      value: 'Pathology supplies',
      parent: 'medical_supplies',
    },

    { key: 'me_medicines', value: 'ME-Medicines', parent: 'medicine' },

    {
      key: 'of_office',
      value: 'OF-Office Supplies',
      parent: 'office_stationary_supplies',
    },
    {
      key: 'st_stationary',
      value: 'ST-Stationary Supplies',
      parent: 'office_stationary_supplies',
    },

    {
      key: 'cm_contrast',
      value: 'CM-Contrast Media Supplies',
      parent: 'radiology_medicine',
    },
    {
      key: 'mri_contrast',
      value: 'MRI Contrast Media',
      parent: 'radiology_medicine',
    },
    { key: 'xr_supplies', value: 'XR-Supplies', parent: 'radiology_medicine' },

    { key: 'te_textile', value: 'TE-TEXTILE', parent: 'textile' },
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
      { tradeName: { $regex: req.params.keyword, $options: 'i' } },
      { scientificName: { $regex: req.params.keyword, $options: 'i' } },
      { itemCode: { $regex: req.params.keyword, $options: 'i' } },
    ],
  }).populate('vendorId');
  const data = {
    items,
  };
  res.status(200).json({ success: true, data: data });
});
exports.getSearchedItemsNM = asyncHandler(async (req, res) => {
  const items = await Item.find({
    $or: [
      { tradeName: { $regex: req.params.keyword, $options: 'i' } },
      { scientificName: { $regex: req.params.keyword, $options: 'i' } },
      { itemCode: { $regex: req.params.keyword, $options: 'i' } },
    ],
    cls: 'non_medical',
  }).populate('vendorId');
  const data = {
    items,
  };
  res.status(200).json({ success: true, data: data });
});
exports.getSearchedItemsP = asyncHandler(async (req, res) => {
  const items = await Item.find({
    $or: [
      { tradeName: { $regex: req.params.keyword, $options: 'i' } },
      { scientificName: { $regex: req.params.keyword, $options: 'i' } },
      { itemCode: { $regex: req.params.keyword, $options: 'i' } },
    ],
    cls: 'Medical',
    medClass: 'Pharmaceutical',
  }).populate('vendorId');
  const data = {
    items,
  };
  res.status(200).json({ success: true, data: data });
});
exports.getSearchedItemsNP = asyncHandler(async (req, res) => {
  const items = await Item.find({
    $or: [
      { tradeName: { $regex: req.params.keyword, $options: 'i' } },
      { scientificName: { $regex: req.params.keyword, $options: 'i' } },
      { itemCode: { $regex: req.params.keyword, $options: 'i' } },
    ],
    cls: 'Medical',
    medClass: 'Non Pharmaceutical',
  }).populate('vendorId');
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
