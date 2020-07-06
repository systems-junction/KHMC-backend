const webpush = require("web-push");
const bcrypt = require('bcryptjs');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const AccessLevel = require('../models/accessLevel');
const SystemAdmin = require('../models/systemAdmin');
const Staff = require('../models/staff');
const privateVapidKey = "s92YuYXxjJ38VQhRSuayTb9yjN_KnVjgKfbpsHOLpjc";
const publicVapidKey = "BOHtR0qVVMIA-IJEru-PbIKodcux05OzVVIJoIBKQu3Sp1mjvGkjaT-1PIzkEwAiAk6OuSCZfNGsgYkJJjOyV7k"
webpush.setVapidDetails(
  "mailto:hannanbutt1995@gmail.com",
  publicVapidKey,
  privateVapidKey
);
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
  const { name, read, write, del, update, systemAdminId } = req.body;
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
exports.testnot = asyncHandler(async (req, res, next) => {
  const test = await Staff.findOne({_id:"5ef49dd057ea2e27a5b31edb"})
  const subscription = req.body;
    // Send 201 - resource created
  res.status(201).json({});

  // Create payload
  const payload = JSON.stringify({ title: "Push Test",test:test });

  // Pass object into sendNotification
  webpush
    .sendNotification(subscription, payload)
    .catch(err => console.error(err));
});