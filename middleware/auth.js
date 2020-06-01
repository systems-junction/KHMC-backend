const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/user');

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  // Skip authentication when url 'login', 'logout', 'register'
  if(req.url === '/api/auth/login' || req.url === '/api/auth/logout' || req.url === '/api/auth/register' ){
    return next();
  } 

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
 

  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id);

    next();
  } catch (err) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
});

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    console.log('role: ', req.headers.role, roles);
    if (!roles.includes(req.headers.role)) {
      return next(
        new ErrorResponse(
          `User role ${req.headers.role} is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};
