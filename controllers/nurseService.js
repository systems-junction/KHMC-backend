const { v4: uuidv4 } = require('uuid');
const notification = require('../components/notification');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const NurseService = require('../models/nurseService');
const requestNoFormat = require('dateformat');

exports.getNurseService = asyncHandler(async (req, res) => {
  const nurseService = await NurseService.find();
  res.status(200).json({ success: true, data: nurseService });
});

exports.addNurseService = asyncHandler(async (req, res) => {
  const { name, description, price, status } = req.body;
  var now = new Date();
  var start = new Date(now.getFullYear(), 0, 0);
  var diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
  var oneDay = 1000 * 60 * 60 * 24;
  var day = Math.floor(diff / oneDay);
  const nurseService = await NurseService.create({
    serviceNo: 'NS' + day + requestNoFormat(new Date(), 'yyHHMM'),
    name,
    description,
    price,
    status,
  });
  res.status(200).json({ success: true, data: nurseService });
});

exports.deleteNurseService = asyncHandler(async (req, res, next) => {
  const { _id } = req.params;
  const nurseService = await NurseService.findById(_id);
  if (!nurseService) {
    return next(
      new ErrorResponse(`Nurse Service not found with id of ${_id}`, 404)
    );
  }
  await NurseService.deleteOne({ _id: _id });
  res.status(200).json({ success: true, data: {} });
});

exports.updateNurseService = asyncHandler(async (req, res, next) => {
  const { _id } = req.body;
  let nurseService = await NurseService.findById(_id);
  if (!nurseService) {
    return next(
      new ErrorResponse(`Nurse Service not found with id of ${_id}`, 404)
    );
  }
  nurseService = await NurseService.findOneAndUpdate({ _id: _id }, req.body, {
    new: true,
  });
  res.status(200).json({ success: true, data: nurseService });
});

exports.getSearchedNurse = asyncHandler(async (req, res) => {
  const nurseService = await NurseService.find({
    $or: [
      { name: { $regex: req.params.keyword, $options: 'i' } },
      { serviceNo: { $regex: req.params.keyword, $options: 'i' } },
    ],
  });
  res.status(200).json({ success: true, data: nurseService });
});
