const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/user');
const Staff = require('../models/staff')
// @desc      Register user
// @route     POST /api/auth/register
// @access    Public
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, staffTypeId } = req.body;
  // Create user
  const user = await User.create({
    name,
    email,
    password,
    staffTypeId,
  });

  sendTokenResponse(user, 200, res);
});

// @desc      Login user
// @route     POST /api/auth/login
// @access    Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Check for user
  const user = await User.findOne({ email }).populate('staffTypeId');
  var data
  if(email=="superadmin@khmc.com")
  {
    data={
      _id:user._id,
    name:user.name,
    email:user.email,
    password:user.password,
    staffTypeId:user.staffTypeId,
    staffId:user.staffId,
    createdAt:user.createdAt,
    updatedAt:user.updatedAt
    }
  }
  else{
  const staff = await Staff.findOne({_id:user.staffId}).populate('functionalUnit')
  data={
    _id:user._id,
    name:user.name,
    email:user.email,
    password:user.password,
    staffTypeId:user.staffTypeId,
    staffId:user.staffId,
    functionalUnit:staff.functionalUnit,
    createdAt:user.createdAt,
    updatedAt:user.updatedAt
  }
}
  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }
  sendTokenResponse(user, 200, res, data);
});

// @desc      Log user out / clear cookie
// @route     GET /api/auth/logout
// @access    Private
exports.logout = asyncHandler(async (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: false,
  });

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc      Get current logged in user
// @route     POST /api/auth/me
// @access    Private
exports.getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

// Get token from model, create cookie and send response
const sendTokenResponse = (userOld, statusCode, res, user) => {
  // Create token
  const token = userOld.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: false,
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  const data = {
    token,
    user
  };
  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    data,
  });
};
