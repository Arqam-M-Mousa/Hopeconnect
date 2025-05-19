/**
 * @module utils/responses
 * @description Utility functions for handling HTTP responses
 */

/**
 * HTTP status codes used in the application
 * @constant {Object}
 * @property {number} OK - 200 OK
 * @property {number} CREATED - 201 Created
 * @property {number} BAD_REQUEST - 400 Bad Request
 * @property {number} UNAUTHORIZED - 401 Unauthorized
 * @property {number} FORBIDDEN - 403 Forbidden
 * @property {number} NOT_FOUND - 404 Not Found
 * @property {number} SERVER_ERROR - 500 Internal Server Error
 */
exports.HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
};

/**
 * Handle errors in request handlers
 * @function handleError
 * @param {Object} res - Express response object
 * @param {Error} error - Error object
 * @returns {Object} JSON response with error details
 */
exports.handleError = (res, error) => {
  console.error("Operation failed:", error);
  return res.status(exports.HTTP_STATUS.SERVER_ERROR).json({
    message: "Server error",
    error: error.message,
  });
};
