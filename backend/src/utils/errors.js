// Base class for custom operational errors
class AppError extends Error {
  constructor(message, statusCode, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

// 404 Not Found Error
class TemplateNotFoundError extends AppError {
  constructor(message = 'Template resource not found.') {
    super(message, 404);
  }
}

// 500 Internal Server Error
class InternalServerError extends AppError {
  constructor(message = 'Something went wrong.', originalError = null) {
    super(message, 500);
    this.originalError = originalError; 
  }
}

module.exports = {
  AppError,
  TemplateNotFoundError,
  InternalServerError,
};