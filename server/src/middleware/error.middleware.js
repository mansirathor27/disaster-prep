/**
 * Error Handler Middleware
 * Centralized error handling
 */

const { sendError } = require('../utils/response.util');
const { ERROR_MESSAGES, HTTP_STATUS } = require('../constants/response.constants');

/**
 * Not Found Middleware
 */
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(HTTP_STATUS.NOT_FOUND);
  next(error);
};

/**
 * Error Handler Middleware
 */
const errorHandler = (err, req, res, next) => {
  // Log error for debugging
  console.error('❌ Error:', err.message);
  console.error('Stack:', err.stack);
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => e.message);
    return sendError(res, ERROR_MESSAGES.VALIDATION_ERROR, HTTP_STATUS.BAD_REQUEST, errors);
  }
  
  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    return sendError(res, 'Invalid ID format', HTTP_STATUS.BAD_REQUEST);
  }
  
  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return sendError(res, `${field} already exists`, HTTP_STATUS.BAD_REQUEST);
  }
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return sendError(res, 'Invalid token', HTTP_STATUS.UNAUTHORIZED);
  }
  
  if (err.name === 'TokenExpiredError') {
    return sendError(res, 'Token expired', HTTP_STATUS.UNAUTHORIZED);
  }
  
  // Default error
  const statusCode = res.statusCode === 200 ? HTTP_STATUS.INTERNAL_SERVER_ERROR : res.statusCode;
  return sendError(res, err.message || ERROR_MESSAGES.SERVER_ERROR, statusCode);
};

module.exports = {
  notFound,
  errorHandler,
};
