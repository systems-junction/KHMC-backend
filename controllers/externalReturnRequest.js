/* eslint-disable prefer-const */
const notification = require('../components/notification');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const ExternalReturnRequest = require('../models/externalReturnRequest');
const requestNoFormat = require('dateformat');
exports.getExternalReturnRequests = asyncHandler(async (req, res) => {
    const externalRequest = await ExternalReturnRequest.find().populate({
        path:'itemId',
        populate:{
            path:'vendorId'
        }
    });
    res.status(200).json({ success: true, data: externalRequest });
});
exports.getExternalReturnRequestsKeyword = asyncHandler(async (req, res) => {
  const externalRequest = await ExternalReturnRequest.find().populate('itemId');
  var arr = [];
  for (let i = 0; i < externalRequest.length; i++) {
    if (
      (externalRequest[i].returnRequestNo &&
        externalRequest[i].returnRequestNo
          .toLowerCase()
          .startsWith(req.params.keyword.toLowerCase())) ||
      (externalRequest[i].itemId.itemCode &&
        externalRequest[i].itemId.itemCode.startsWith(req.params.keyword))
    ) {
      arr.push(externalRequest[i]);
    }
  }
  res.status(200).json({ success: true, data: arr });
});
exports.getExternalReturnRequestsById = asyncHandler(async (req, res) => {
  const externalRequest = await ExternalReturnRequest.findOne({
    _id: _id,
  }).populate('itemId');
  res.status(200).json({ success: true, data: externalRequest });
});
exports.deleteExternalReturnRequests = asyncHandler(async (req, res, next) => {
  const { _id } = req.params;
  const externalReturn = await ExternalReturnRequest.findById(_id);
  if (!externalReturn) {
    return next(
      new ErrorResponse(`External Return not found with id of ${_id}`, 404)
    );
  }
  await ExternalReturnRequest.deleteOne({ _id: _id });
  res.status(200).json({ success: true, data: {} });
});

exports.addExternalReturnRequest = asyncHandler(async (req, res) => {
  const {
    generatedBy,
    generated,
    dateGenerated,
    expiryDate,
    itemId,
    returnedQty,
    reason,
    reasonDetail,
    description,
    status,
    damageReport,
    prId,
    batchArray,
  } = req.body;
  var now = new Date();
  var start = new Date(now.getFullYear(), 0, 0);
  var diff =
    now -
    start +
    (start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000;
  var oneDay = 1000 * 60 * 60 * 24;
  var day = Math.floor(diff / oneDay);
  const err = await ExternalReturnRequest.create({
    returnRequestNo: 'ER' + day + requestNoFormat(new Date(), 'yyHHMM'),
    generatedBy,
    generated,
    dateGenerated,
    expiryDate,
    itemId,
    returnedQty,
    description,
    reason,
    reasonDetail,
    damageReport,
    status,
    prId,
    batchArray,
  });
  notification("External Return Request", "A new Return Request "+err.returnRequestNo+" has been generated at "+err.createdAt+" Manually", "Warehouse Incharge")

  const send = await ExternalReturnRequest.find().populate('itemId');
  globalVariable.io.emit('get_data', send);
  res.status(200).json({ success: true, data: err });
});

exports.updateExternalRequest = asyncHandler(async (req, res, next) => {
  const { _id } = req.body;
  let externalReturn = await ExternalReturnRequest.findById(_id);
  if (!externalReturn) {
    return next(
      new ErrorResponse(`External Return not found with id of ${_id}`, 404)
    );
  }
  if (req.body.status == 'approved') {
    req.body.inProgressTime = Date.now();
    notification("External Return Request", "The Return Request "+req.body.returnRequestNo+" has been approved at "+externalReturn.updatedAt, "admin")
    const send = await ExternalReturnRequest.find().populate('itemId');
    globalVariable.io.emit("get_data", send)
  }
  if (req.body.status == 'reject') {
    req.body.inProgressTime = Date.now();
    notification("External Return Request", "The Return Request "+req.body.returnRequestNo+" has been rejected at "+externalReturn.updatedAt, "admin")
    const send = await ExternalReturnRequest.find().populate('itemId');
    globalVariable.io.emit("get_data", send)
  }
  externalReturn = await ExternalReturnRequest.findOneAndUpdate(
    { _id: _id },
    req.body,
    { new: true }
  );
  res.status(200).json({ success: true, data: externalReturn });
});
