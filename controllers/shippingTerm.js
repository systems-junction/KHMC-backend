/* eslint-disable no-param-reassign */
const { v4: uuidv4 } = require('uuid');
const aysncforEach = require('async-foreach').forEach;
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const ShippingTerm = require('../models/shippingTerm');

exports.getShippingTerms = asyncHandler(async (req, res) => {
    const shippingTerm = await ShippingTerm.find({vendorId: req.params.vendorId});
    const data = {
        shippingTerm
    }
    res.status(200).json({ success: true, data: data });
});

exports.addShippingTerm = asyncHandler(async (req, res) => {
    const { shippingTermsData, vendorId } = req.body;
    
    shippingTermsData.forEach(element => {
        element.uuid = uuidv4();
        element.vendorId = vendorId;
    });
    const shippingTerms = await ShippingTerm.insertMany([...shippingTermsData]);
    

    res.status(200).json({ success: true, data: shippingTerms });
});

exports.deleteShippingTerm = asyncHandler(async (req, res, next) => {
    const { _id } = req.params;
    const shippingTerm = await ShippingTerm.findById(_id);
    if(!shippingTerm) {
        return next(
            new ErrorResponse(`Shipping Term not found with id of ${_id}`, 404)
        );
    }

    await ShippingTerm.deleteOne({_id: _id});
    res.status(200).json({ success: true, data: {} });
});

exports.updateShippingTerm = asyncHandler(async (req, res) => {
    const { shippingTermsData } = req.body;
    const shippingTerms = [];

    aysncforEach(shippingTermsData, function(item){
        // Only when `this.async` is called does iteration becomes asynchronous. The
        // loop won't be continued until the `done` function is executed.
        const done = this.async();
        ShippingTerm.findById(item._id, function(err0r, shippingTerm){
            if(!shippingTerm) {
                done();
            }
            else{
                ShippingTerm.updateOne({_id: item._id}, item, function(err, data){
                    shippingTerms.push(item);
                    done();
                });
            }

        });
    }, function(){
        res.status(200).json({ success: true, data: shippingTerms });
    });

});