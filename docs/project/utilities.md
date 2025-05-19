# Utilities

HopeConnect includes various utility functions and helper modules to support common operations across the application. This page documents the main utility files and their purposes.

## Utility Structure

The utilities are organized in a modular structure, with each file handling a specific type of functionality:

```
utils/
├── tokenUtils.js        # JWT token generation and validation
├── passwordUtils.js     # Password hashing and verification
├── pagination.js        # Pagination utilities for API endpoints
└── responses.js         # Response handling utilities
```

## Token Utilities

The token utilities handle JWT token generation and validation:

```javascript
const jwt = require('jsonwebtoken');

/**
 * Generate a JWT token for a user
 * @param {Object} user - User object
 * @returns {string} JWT token
 */
function generateToken(user) {
  return jwt.sign(
    { 
      id: user.id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
}

/**
 * Verify a JWT token
 * @param {string} token - JWT token
 * @returns {Object} Decoded token payload
 * @throws {Error} If token is invalid
 */
function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = {
  generateToken,
  verifyToken
};
```

## Password Utilities

The password utilities handle password hashing and verification:

```javascript
const bcrypt = require('bcryptjs');

/**
 * Hash a password
 * @param {string} password - Plain text password
 * @returns {Promise<string>} Hashed password
 */
async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Verify a password against a hash
 * @param {string} password - Plain text password
 * @param {string} hash - Hashed password
 * @returns {Promise<boolean>} True if password matches hash
 */
async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

/**
 * Generate a random password
 * @param {number} length - Password length
 * @returns {string} Random password
 */
function generateRandomPassword(length = 10) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

module.exports = {
  hashPassword,
  verifyPassword,
  generateRandomPassword
};
```

## Pagination Utilities

The pagination utilities provide functions for handling pagination in API endpoints:

```javascript
// Default page size for paginated responses
exports.DEFAULT_PAGE_SIZE = 10;

/**
 * Extract pagination parameters from query object
 * @param {Object} query - Express request query object
 * @returns {Object} Pagination parameters (page, limit, offset)
 */
exports.getPaginationParams = (query) => {
    const page = parseInt(query.page) || 1;
    const limit = Math.min(parseInt(query.limit, 10) || exports.DEFAULT_PAGE_SIZE, exports.DEFAULT_PAGE_SIZE);
    const offset = (page - 1) * limit;
    return {page, limit, offset};
};

/**
 * Format paginated response with metadata
 * @param {Object} data - Sequelize result object with rows and count
 * @param {number} page - Current page number
 * @param {number} limit - Items per page
 * @returns {Object} Formatted response with pagination metadata
 */
exports.formatPaginatedResponse = (data, page, limit) => ({
    items: data.rows,
    totalPages: Math.ceil(data.count / limit),
    currentPage: page,
    totalItems: data.count
});
```

## Response Utilities

The response utilities provide functions for handling API responses:

```javascript
// HTTP status codes
exports.HTTP_STATUS = {
    OK: 200, 
    CREATED: 201, 
    BAD_REQUEST: 400, 
    UNAUTHORIZED: 401, 
    FORBIDDEN: 403, 
    NOT_FOUND: 404, 
    SERVER_ERROR: 500
};

/**
 * Handle error responses
 * @param {Object} res - Express response object
 * @param {Error} error - Error object
 * @returns {Object} JSON response with error details
 */
exports.handleError = (res, error) => {
    console.error('Operation failed:', error);
    return res.status(exports.HTTP_STATUS.SERVER_ERROR).json({
        message: "Server error", 
        error: error.message
    });
};
```

For more detailed information about specific utilities, refer to the JSDoc documentation in the code.
