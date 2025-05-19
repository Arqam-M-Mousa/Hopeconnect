/**
 * @module utils/pagination
 * @description Utility functions for handling pagination in API responses
 */

/**
 * Default number of items to return per page
 * @constant {number}
 */
exports.DEFAULT_PAGE_SIZE = 10;

/**
 * Extract pagination parameters from request query
 * @function getPaginationParams
 * @param {Object} query - Express request query object
 * @param {number|string} [query.page=1] - Page number
 * @param {number|string} [query.limit=DEFAULT_PAGE_SIZE] - Number of items per page
 * @returns {Object} Pagination parameters
 * @returns {number} .page - Current page number
 * @returns {number} .limit - Number of items per page
 * @returns {number} .offset - Offset for database query
 */
exports.getPaginationParams = (query) => {
  const page = parseInt(query.page) || 1;
  const limit = Math.min(
    parseInt(query.limit, 10) || exports.DEFAULT_PAGE_SIZE,
    exports.DEFAULT_PAGE_SIZE
  );
  const offset = (page - 1) * limit;
  return { page, limit, offset };
};

/**
 * Format paginated response with metadata
 * @function formatPaginatedResponse
 * @param {Object} data - Sequelize findAndCountAll result
 * @param {Array} data.rows - Array of items
 * @param {number} data.count - Total count of items
 * @param {number} page - Current page number
 * @param {number} limit - Number of items per page
 * @returns {Object} Formatted response with pagination metadata
 * @returns {Array} .items - Array of items for current page
 * @returns {number} .totalPages - Total number of pages
 * @returns {number} .currentPage - Current page number
 * @returns {number} .totalItems - Total number of items
 */
exports.formatPaginatedResponse = (data, page, limit) => ({
  items: data.rows,
  totalPages: Math.ceil(data.count / limit),
  currentPage: page,
  totalItems: data.count,
});
