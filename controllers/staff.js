const bcrypt = require('bcryptjs');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Staff = require('../models/staff');
const StaffType = require('../models/staffType');
const SystemAdmin = require('../models/systemAdmin');
const User = require('../models/user');

exports.getStaff = asyncHandler(async (req, res) => {
  const staff = await Staff.find()
    .populate('systemAdminId')
    .populate('staffTypeId');
  const staffType = await StaffType.find().populate('accessLevelId');
  const systemAdmin = await SystemAdmin.find();
  const data = {
    staff,
    staffType,
    systemAdmin,
  };
  res.status(200).json({ success: true, data: data });
});

exports.getExternalConsultant = asyncHandler(async (req, res) => {
  const staff = await Staff.find({staffTypeId:'5f28f500b0d678b22fd9cafb'})
    .populate('systemAdminId')
    .populate('staffTypeId');
  res.status(200).json({ success: true, data: staff });
});
exports.addStaff = asyncHandler(async (req, res) => {
  const {
    staffTypeId,
    firstName,
    lastName,
    designation,
    contactNumber,
    identificationNumber,
    email,
    password,
    gender,
    dob,
    address,
    systemAdminId,
    status,
    routes
  } = req.body;

  const staff = await Staff.create({
    staffTypeId,
    firstName,
    lastName,
    designation,
    contactNumber,
    identificationNumber,
    email,
    password,
    gender,
    dob,
    address,
    systemAdminId,
    status,
    routes
  });

  // Create user
  await User.create({
    name: firstName + ' ' + lastName,
    email,
    password,
    staffTypeId,
    staffId: staff._id,
  });

  res.status(200).json({ success: true, data: staff });
});

exports.deleteStaff = asyncHandler(async (req, res, next) => {
  const { _id } = req.params;
  const staff = await Staff.findById(_id);

  if (!staff) {
    return next(new ErrorResponse(`Staff not found with id of ${_id}`, 404));
  }

  await Staff.deleteOne({ _id: _id });

  // delete the record from user as well
  const user = await User.findOne({ staffId: _id });
  if (user) {
    User.deleteOne({ _id: user._id });
  }

  res.status(200).json({ success: true, data: {} });
});

exports.updateStaff = asyncHandler(async (req, res, next) => {
  const { _id } = req.body;

  let staff = await Staff.findById(_id);

  if (!staff) {
    return next(new ErrorResponse(`Staff not found with id of ${_id}`, 404));
  }

  staff = await Staff.updateOne({ _id: _id }, req.body);

  const user = await User.findOne({ staffId: _id });
  if (user) {
    // update user
    const params = {
      name: req.body.firstName + ' ' + req.body.lastName,
      email: req.body.email,
      staffTypeId: req.body.staffTypeId,
      staffId: req.body._id,
    };
    const salt = await bcrypt.genSalt(10);
    params.password = await bcrypt.hash(req.body.password, salt);
    await User.updateOne({ _id: user._id }, params);
  }

  res.status(200).json({ success: true, data: staff });
});
