// +++++++++++++++++++++++++++++++++++++++++++
// Imports
// +++++++++++++++++++++++++++++++++++++++++++
const AppError = require('./../utils/appError');

// +++++++++++++++++++++++++++++++++++++++++++
// Cast error handling
// +++++++++++++++++++++++++++++++++++++++++++
const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

// +++++++++++++++++++++++++++++++++++++++++++
// Duplicate fields handling
// +++++++++++++++++++++++++++++++++++++++++++
const handleDuplicateFieldsDB = err => {
  const value = Object.values(err.keyValue)[0];
  const message = `Duplicate field value: ${value}.Pleace use another value `;
  return new AppError(message, 400);
};

// +++++++++++++++++++++++++++++++++++++++++++
// Validation error handling
// +++++++++++++++++++++++++++++++++++++++++++
const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

// +++++++++++++++++++++++++++++++++++++++++++
// Invalid JWT provided
// +++++++++++++++++++++++++++++++++++++++++++
const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 401);

// +++++++++++++++++++++++++++++++++++++++++++
// JWT is expired
// +++++++++++++++++++++++++++++++++++++++++++
const handleJWTExpiredError = () =>
  new AppError('Your token has expired! Please log in again.', 401);

// +++++++++++++++++++++++++++++++++++++++++++
// Send error to development
// +++++++++++++++++++++++++++++++++++++++++++
const sendErrorDev = (err, req, res) => {
  // A) API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  }

  // B) RENDERED WEBSITE
  console.error('🔴 Unknown error:', err);
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: err.message
  });
};

// +++++++++++++++++++++++++++++++++++++++++++
// Send error to production
// +++++++++++++++++++++++++++++++++++++++++++
const sendErrorProd = (err, req, res) => {
  // A) API
  if (req.originalUrl.startsWith('/api')) {
    // A) Operational, trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    }
    // B) Programming or other unknown error: don't leak error details
    // 1) Log error
    console.error('🔴 Unknown error:', err);
    // 2) Send generic message
    return res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!'
    });
  }

  // B) RENDERED WEBSITE
  // A) Operational, trusted error: send message to client
  if (err.isOperational) {
    console.log(err);
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message
    });
  }
  // B) Programming or other unknown error: don't leak error details
  // 1) Log error
  console.error('🔴 Unknown error:', err);
  // 2) Send generic message
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: 'Please try again later.'
  });
};

// +++++++++++++++++++++++++++++++++++++++++++
// Check for environment
// +++++++++++++++++++++++++++++++++++++++++++
module.exports = (err, req, res, next) => {
  // console.log(err.stack);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, req, res);
  }
};
