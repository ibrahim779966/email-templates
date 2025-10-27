const { AppError } = require('../utils/errors');

const errorHandler = (err, req, res, next) => {
  // 1. ERROR LOGS: Log detailed info for server errors
  if (err.statusCode === 500 || !err.isOperational) {
    console.error('--- SERVER ERROR LOG (500) ---');
    console.error(`Path: ${req.path}`);
    console.error(`Error:`, err);
    console.error('------------------------------');
  } 

  let statusCode = err.statusCode || 500;
  let message = err.message;

  // Handle Mongoose errors for better user messages
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ID format.`;
  } else if (err.code === 11000) {
    statusCode = 409; 
    const field = Object.keys(err.keyValue).join(', ');
    message = `Duplicate field: ${field} already exists.`;
  } else if (err.name === 'ValidationError') {
    statusCode = 400;
    const errors = Object.values(err.errors).map(el => el.message);
    message = `Validation failed: ${errors.join('. ')}`;
  } 

  // 2. Send final response
  res.status(statusCode).json({
    status: 'error',
    message: message,
    // Show full error only in development mode
    ...(process.env.NODE_ENV === 'development' && { error: err }),
  });
};

module.exports = errorHandler;