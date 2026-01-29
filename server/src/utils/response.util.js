const { HTTP_STATUS, SUCCESS_MESSAGES, ERROR_MESSAGES } = require('../constants/response.constants');

const sendSuccess = (res, data = {}, message = SUCCESS_MESSAGES.DATA_RETRIEVED, statusCode = HTTP_STATUS.OK) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  });
};


const sendError = (res, message = ERROR_MESSAGES.SERVER_ERROR, statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR, errors = null) => {
  const response = {
    success: false,
    message,
    timestamp: new Date().toISOString(),
  };
  
  if (errors) {
    response.errors = errors;
  }
  
  return res.status(statusCode).json(response);
};

const sendValidationError = (res, errors) => {
  return sendError(res, ERROR_MESSAGES.VALIDATION_ERROR, HTTP_STATUS.BAD_REQUEST, errors);
};

const sendNotFound = (res, resource = 'Resource') => {
  return sendError(res, `${resource} not found`, HTTP_STATUS.NOT_FOUND);
};

const sendCreated = (res, data, message = SUCCESS_MESSAGES.DATA_RETRIEVED) => {
  return sendSuccess(res, data, message, HTTP_STATUS.CREATED);
};

module.exports = {
  sendSuccess,
  sendError,
  sendValidationError,
  sendNotFound,
  sendCreated,
};
