const Margin = require('../models/margin');
const asyncHandler = require('../middleware/async');

exports.getMargin = asyncHandler(async (req, res) => {
    const margin = await Margin.find()
    res.status(200).json({ success: true, data: margin });
});

exports.createMargin = asyncHandler(async (req, res) => {
const margin = await Margin.create({
    wtf:req.body.wtf,
    ftp:req.body.ftp
})
res.status(200).json({ success: true, data: margin });
});