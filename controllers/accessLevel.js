const bcrypt = require('bcryptjs');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const AccessLevel = require('../models/accessLevel');
const SystemAdmin = require('../models/systemAdmin');
exports.getAccessLevel = asyncHandler(async (req, res) => {
  const accessLevel = await AccessLevel.find().populate('systemAdminId');
  const systemAdmin = await SystemAdmin.find();
  const data = {
    accessLevel,
    systemAdmin,
  };
  res.status(200).json({ success: true, data: data });
});

exports.addAccessLevel = asyncHandler(async (req, res) => {
  const { name, read, write, del, update } = req.body;
  const accessLevel = await AccessLevel.create({
    name,
    read,
    write,
    del,
    update,
    systemAdminId,
  });
  res.status(200).json({ success: true, data: accessLevel });
});

exports.deleteAccessLevel = asyncHandler(async (req, res, next) => {
  const { _id } = req.params;
  const accessLevel = await AccessLevel.findById(_id);
  if (!accessLevel) {
    return next(
      new ErrorResponse(`Access Level not found with id of ${_id}`, 404)
    );
  }
  await AccessLevel.deleteOne({ _id: _id });
});

exports.updateAccessLevel = asyncHandler(async (req, res, next) => {
  const { _id } = req.body;
  let accessLevel = await AccessLevel.findById(_id);
  if (!accessLevel) {
    return next(
      new ErrorResponse(`Access Level not found with id of ${_id}`, 404)
    );
  }
  accessLevel = await AccessLevel.updateOne({ _id: _id }, req.body);
  res.status(200).json({ success: true, data: accessLevel });
});
