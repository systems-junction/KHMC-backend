/* eslint-disable prefer-const */
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Vendor = require('../models/vendor');
const PurchaseRequest = require('../models/purchaseRequest');
const PurchaseOrder = require('../models/purchaseOrder');
const MaterialReceiving = require('../models/materialReceiving');

exports.getMaterialReceivings = asyncHandler(async (req, res) => {
    const materialReceivings = await MaterialReceiving.find()
    .populate({
        path : 'poId',
        populate: [{
            path : 'purchaseRequestId',
            populate : {
                path : 'item.itemId'
              }},{
            path:'vendorId'
        }]
    }).populate('vendorId').populate({
        path:'prId.id',
        populate:{path:'item.itemId'}
    })
    const vendors = await Vendor.find();
    const purchaseRequests = await PurchaseRequest.find();
    const purchaseOrders = await PurchaseOrder.find();
    const statues = [{key:'in_progress', value:'In Progress'},{key:'approved', value:'Approved'} ]
    const data = {
        materialReceivings,
        vendors,
        statues,
        purchaseRequests,
        purchaseOrders
    }
    
    res.status(200).json({ success: true, data: data });
});
exports.getMaterialReceivingsKeyword = asyncHandler(async (req, res) => {
    const materialReceivings = await MaterialReceiving.find()
    .populate({
        path : 'poId',
        populate: [{
            path : 'purchaseRequestId',
            populate : {
                path : 'item.itemId'
              }},{
            path:'vendorId'
        }]
    }).populate('vendorId').populate({
        path:'prId.id',
        populate:{path:'item.itemId'}
    })
    var arr = [];
    for(let i=0; i<materialReceivings.length; i++)
    {
        if(
            (materialReceivings[i].poId.purchaseOrderNo && materialReceivings[i].poId.purchaseOrderNo.toLowerCase().startsWith(req.params.keyword.toLowerCase()))
            ||(materialReceivings[i].vendorId.englishName && materialReceivings[i].vendorId.englishName.toLowerCase().startsWith(req.params.keyword.toLowerCase()))
            )
            {
              arr.push(materialReceivings[i])
            }
    }
    const data = {
        materialReceivings:arr
    }
    
    res.status(200).json({ success: true, data: data });
});
exports.getMaterialReceivingsById = asyncHandler(async (req, res) => {
    const materialReceivings = await MaterialReceiving.findOne({_id:req.params._id})
    .populate({
        path : 'poId',
        populate: [{
            path : 'purchaseRequestId',
            populate : {
                path : 'item.itemId'
              }},{
            path:'vendorId'
        }]
    })
    res.status(200).json({ success: true, data: materialReceivings });
});
exports.addMaterialReceiving = asyncHandler(async (req, res) => {
    const { itemCode, itemName, prId, poId, vendorId, status, poSentDate } = req.body;
    const materialReceiving = await MaterialReceiving.create({
        itemCode,
        itemName,
        prId,
        poId,
        vendorId,
        status,
        poSentDate
    });

    res.status(200).json({ success: true, data: materialReceiving });
});

exports.deleteMaterialReceiving = asyncHandler(async (req, res, next) => {
    const { _id } = req.params;
    const materialReceiving = await MaterialReceiving.findById(_id);
    if(!materialReceiving) {
        return next(
        new ErrorResponse(`Material receiving not found with id of ${_id}`, 404)
        );
    }

    await MaterialReceiving.deleteOne({_id: _id});

    res.status(200).json({ success: true, data: {} });
});

exports.updateMaterialReceiving = asyncHandler(async (req, res, next) => {
    const { _id } = req.body;

    let materialReceiving = await MaterialReceiving.findById(_id);

    if(!materialReceiving) {
        return next(
        new ErrorResponse(`Material receiving not found with id of ${_id}`, 404)
        );
    }

    materialReceiving = await MaterialReceiving.updateOne({_id: _id}, req.body);
    res.status(200).json({ success: true, data: materialReceiving });
});