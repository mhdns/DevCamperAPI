const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

exports.protect = asyncHandler(async (req, res, next) => {
  // let token;
  let token;
  if (req.headers.authorization
    && req.headers.authorization.startsWith('Bearer')) {
    [, token] = req.headers.authorization.split(' ');
  }
  // else if (req.cookies.token) {
  //   token = req.cookies.token
  // }

  // Make sure token exit
  if (!token) {
    return next(new ErrorResponse('Not Authorized to Access.', 401));
  }

  // verify token and extract payload
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    return next(new ErrorResponse('Not Authorized to Access.', 401));
  }

  return null;
});
