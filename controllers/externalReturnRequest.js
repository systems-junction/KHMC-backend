/* eslint-disable prefer-const */
const notification = require('../components/notification')
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const ExternalReturnRequest = require('../models/externalReturnRequest');
const requestNoFormat = require('dateformat');
exports.getExternalReturnRequests = asyncHandler(async (req, res) => {
    const externalRequest = await ExternalReturnRequest.find().populate('itemId');
    res.status(200).json({ success: true, data: externalRequest });
});
exports.getExternalReturnRequestsById = asyncHandler(async (req, res) => {
    const externalRequest = await ExternalReturnRequest.findOne({_id:_id,}).populate('itemId');
    res.status(200).json({ success: true, data: externalRequest });
});
exports.deleteExternalReturnRequests = asyncHandler(async (req, res, next) => {
    const { _id } = req.params;
    const externalReturn = await ExternalReturnRequest.findById(_id);
    if(!externalReturn) {
        return next(
        new ErrorResponse(`External Return not found with id of ${_id}`, 404)
        );
    }
    await ExternalReturnRequest.deleteOne({_id: _id});
    res.status(200).json({ success: true, data: {} });
});

exports.addExternalReturnRequest = asyncHandler(async (req, res) => {
    const { generatedBy,generated,dateGenerated,expiryDate,itemId,currentQty,reason,
           reasonDetail,description,status,damageReport,prId} = req.body;
    var now = new Date();
    var start = new Date(now.getFullYear(), 0, 0);
    var diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
    var oneDay = 1000 * 60 * 60 * 24;
    var day = Math.floor(diff / oneDay);
   const err =  await ExternalReturnRequest.create({
        returnRequestNo: 'ER'+ day + requestNoFormat(new Date(), 'yyHHMM'),
        generatedBy,
        generated,
        dateGenerated,
        expiryDate,
        itemId,
        currentQty,
        description,
        reason,
        reasonDetail,
        damageReport,
        status,
        prId
    });
    notification("Return Request", "A new Return Request "+err.returnRequestNo+" has been generated at "+err.createdAt+" Manually", "Warehouse Incharge")
    const send = await ExternalReturnRequest.find().populate('itemId');
    globalVariable.io.emit("get_data", send)
    res.status(200).json({ success: true, data:err });
});


exports.updateExternalRequest = asyncHandler(async (req, res, next) => {
    const { _id } = req.body;
    let externalReturn = await ExternalReturnRequest.findById(_id);
    if(!externalReturn) {
        return next(
        new ErrorResponse(`External Return not found with id of ${_id}`, 404)
        );
    }
    if(req.body.status == "approved")
    {
        notification("Return Request", "The Return Request "+req.body.returnRequestNo+" has been approved at "+req.body.updatedAt, "admin")
        const send = await ExternalReturnRequest.find().populate('itemId');
        globalVariable.io.emit("get_data", send)
    }
    if(req.body.status == "reject")
    {
        notification("Return Request", "The Return Request "+req.body.returnRequestNo+" has been rejected at "+req.body.updatedAt, "admin")
        const send = await ExternalReturnRequest.find().populate('itemId');
        globalVariable.io.emit("get_data", send)
    }
    externalReturn = await ExternalReturnRequest.findOneAndUpdate({_id: _id}, req.body,{new:true});
    res.status(200).json({ success: true, data: externalReturn });
});