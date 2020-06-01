const bcrypt = require('bcryptjs');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const SystemAdmin = require('../models/systemAdmin');
const StaffType = require('../models/staffType');
const User = require('../models/user');

exports.getSystemAdmin = asyncHandler(async (req, res) => {
    const systemAdmin = await SystemAdmin.find().populate('staffTypeId');
    const staffType = await StaffType.find();
    const data = {
      staffType,
      systemAdmin
    }
    res.status(200).json({ success: true, data: data });
});

exports.addSystemAdmin = asyncHandler(async (req, res) => {
    const { username, password, staffTypeId } = req.body;
    const systemAdmin = await SystemAdmin.create({
        username,
        password,
        staffTypeId
    });

    // Create user
    await User.create({
      name: username,
      email: username,
      password,
      staffTypeId,
      staffId: systemAdmin._id
    });

    res.status(200).json({ success: true, data: systemAdmin });
});

exports.deleteSystemAdmin = asyncHandler(async (req, res, next) => {
    const { _id } = req.params;
    const systemAdmin = await SystemAdmin.findById(_id);

    if(!systemAdmin) {
      return next(
        new ErrorResponse(`System admin not found with id of ${_id}`, 404)
      );
    }

    await SystemAdmin.deleteOne({_id: _id});

    // delete the record from user as well
    const user = await User.findOne({staffId: _id});
    if(user){
      User.deleteOne({_id: user._id});
    }

    res.status(200).json({ success: true, data: {} });

});

exports.updateSystemAdmin = asyncHandler(async (req, res, next) => {
    const { _id } = req.body;

    let systemAdmin = await SystemAdmin.findById(_id);

    if(!systemAdmin) {
      return next(
        new ErrorResponse(`System admin not found with id of ${_id}`, 404)
      );
    }

    systemAdmin = await SystemAdmin.updateOne({_id: _id}, req.body);

    const user = await User.findOne({staffId: _id});
    if(user){
      // update user
      const params = {
        name: req.body.username,
        email: req.body.username,
        staffTypeId: req.body.staffTypeId,
        staffId: req.body._id
      };
      const salt = await bcrypt.genSalt(10);
      params.password = await bcrypt.hash(req.body.password, salt);
      await User.updateOne({_id: user._id}, params);
    }

    res.status(200).json({ success: true, data: systemAdmin });
});