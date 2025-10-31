// ============================================
// FILE: middleware/error.middleware.js
// PURPOSE: Global error handling middleware
// RESPONSIBILITIES: Format errors, log server errors, send error responses
// ============================================

const { AppError } = require('../utils/errors');

/**
 * Global error handler middleware
 * Catches all errors passed via next(error) and formats response
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const errorHandler = (err, req, res, next) => {
  
  // Log detailed error information for server errors (500) or unexpected errors
  if (err.statusCode === 500 || !err.isOperational) {
    console.error('--- SERVER ERROR LOG (500) ---');
    console.error(`Path: ${req.path}`);
    console.error(`Error:`, err);
    console.error('------------------------------');
  }

  // Default error status and message
  let statusCode = err.statusCode || 500;
  let message = err.message;

  // Handle specific Mongoose errors with user-friendly messages
  
  // Invalid MongoDB ObjectId format
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ID format.`;
  } 
  // Duplicate key error (unique constraint violation)
  else if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue).join(', ');
    message = `Duplicate field: ${field} already exists.`;
  } 
  // Mongoose validation error
  else if (err.name === 'ValidationError') {
    statusCode = 400;
    const errors = Object.values(err.errors).map(el => el.message);
    message = `Validation failed: ${errors.join('. ')}`;
  }

  // Send formatted error response
  res.status(statusCode).json({
    status: 'error',
    message: message,
    // Include full error stack only in development environment
    ...(process.env.NODE_ENV === 'development' && { error: err }),
  });
};

module.exports = errorHandler;