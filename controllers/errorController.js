const AppError = require('../utils/appError');

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};
const handleDuplicateFieldsDB = err => {
  const [field, value] = Object.entries(err.keyValue || {})[0] || ['field', ''];
  const message =
    field === 'email'
      ? 'An account with that email already exists. Please log in instead.'
      : `Duplicate ${field}: "${value}". Please use another value.`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
  // Ensure err.errors exists before trying to access it
  if (err.errors) {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
  }
  // Handle case where err.errors is undefined
  return new AppError('Invalid input data', 400);
};
const handleJWTError = () =>
  new AppError('Invalid token, please login again.', 401);
const handleJWTExpierdError = () =>
  new AppError('Your token has expired, please login again.', 401);
const sendErrorDev = (err, req, res) => {
  //A) API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  }
  //B) Render the error on the client
  console.error('ERROR: 💥', err);
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong',
    msg: err.message
  });
};
const sendErrorProd = (err, req, res) => {
  //A) API
  if (req.originalUrl.startsWith('/api')) {
    //A) operational, trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    }
    //B) programming or other unknown error: don't leak error details
    //1) Log the error
    console.error('ERROR: 💥', err);

    //2) Send generic message to client
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong, please try again later.'
    });
  }
  //B) Render the error on the client
  //A) operational, trusted error: send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong',
      msg: err.message
    });
  }
  //B) programming or other unknown error: don't leak error details
  //1) Log the error
  console.error('ERROR: 💥', err);

  //2) Send generic message to client
  return res.status(500).render('error', {
    title: 'Something went wrong',
    msg: 'Something went wrong'
  });
};

// Translate known DB/JWT errors into friendly operational errors.
const normalize = err => {
  if (err.name === 'CastError') return handleCastErrorDB(err);
  if (err.code === 11000) return handleDuplicateFieldsDB(err);
  if (err.name === 'ValidationError') return handleValidationErrorDB(err);
  if (err.name === 'JsonWebTokenError') return handleJWTError();
  if (err.name === 'TokenExpiredError') return handleJWTExpierdError();
  return err;
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  const error = normalize(err);

  if (process.env.NODE_ENV === 'development') {
    // Friendly message and status, but keep the original stack for debugging.
    error.stack = err.stack;
    sendErrorDev(error, req, res);
  } else {
    sendErrorProd(error, req, res);
  }
};
