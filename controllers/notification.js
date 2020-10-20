const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Notification = require('../models/notification');

exports.getNotification = asyncHandler(async (req, res) => {
  const not = await Notification.find({'sendTo.userId':req.params.id}).populate('sendTo.userId');
  res.status(200).json({ success: true, data: not });
});



// exports.updateLaboratoryService = asyncHandler(async (req, res, next) => {
//   const { _id } = req.body;
//   let laboratoryService = await LaboratoryService.findById(_id);
//   if (!laboratoryService) {
//     return next(
//       new ErrorResponse(`Laboratory Service not found with id of ${_id}`, 404)
//     );
//   }
//   laboratoryService = await LaboratoryService.findOneAndUpdate(
//     { _id: _id },
//     req.body,
//     { new: true }
//   );
//   res.status(200).json({ success: true, data: laboratoryService });
// });
