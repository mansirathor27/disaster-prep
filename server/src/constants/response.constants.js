/**
 * Response Message Constants
 * Standardized response messages
 */

const SUCCESS_MESSAGES = {
  USER_REGISTERED: 'User registered successfully',
  USER_FOUND: 'User retrieved successfully',
  PROGRESS_SAVED: 'Progress saved successfully',
  BADGE_AWARDED: 'Badge awarded successfully',
  QUIZ_SUBMITTED: 'Quiz submitted successfully',
  GAME_COMPLETED: 'Game completed successfully',
  DATA_RETRIEVED: 'Data retrieved successfully',
};

const ERROR_MESSAGES = {
  USER_NOT_FOUND: 'User not found',
  INVALID_INPUT: 'Invalid input data',
  DISASTER_NOT_FOUND: 'Disaster information not found',
  GAME_NOT_FOUND: 'Game not found',
  QUIZ_NOT_FOUND: 'Quiz not found',
  SERVER_ERROR: 'Internal server error',
  DATABASE_ERROR: 'Database operation failed',
  VALIDATION_ERROR: 'Validation failed',
  UNAUTHORIZED: 'Unauthorized access',
  INVALID_AGE: 'Age must be between 5 and 15',
  MISSING_REQUIRED_FIELDS: 'Missing required fields',
};

const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

module.exports = {
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
  HTTP_STATUS,
};
