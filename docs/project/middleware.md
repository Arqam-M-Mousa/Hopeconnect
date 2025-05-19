# Middleware

HopeConnect uses Express middleware to handle cross-cutting concerns such as authentication, validation, and error handling. This page documents the main middleware components and their purposes.

## Middleware Structure

The middleware is organized in a modular structure, with each file handling a specific concern:

```
middleware/
├── auth.js              # Authentication middleware
├── validation.js        # Request validation middleware
├── errorHandler.js      # Global error handling middleware
├── rateLimiter.js       # Rate limiting middleware
├── logger.js            # Request logging middleware
└── upload.js            # File upload middleware
```

## Authentication Middleware

The authentication middleware verifies JWT tokens and attaches the user to the request:

```javascript
const jwt = require('jsonwebtoken');
const { User } = require('../models');

module.exports = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ status: 'error', message: 'Authentication required' });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ status: 'error', message: 'User not found' });
    }
    
    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ status: 'error', message: 'Token expired' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ status: 'error', message: 'Invalid token' });
    }
    next(error);
  }
};
```

## Role-Based Authorization Middleware

The role-based authorization middleware restricts access based on user roles:

```javascript
// Middleware factory for role-based authorization
const authorize = (roles = []) => {
  // Convert string to array if only one role is provided
  if (typeof roles === 'string') {
    roles = [roles];
  }
  
  return (req, res, next) => {
    // Authentication middleware should be called before this
    if (!req.user) {
      return res.status(401).json({ status: 'error', message: 'Authentication required' });
    }
    
    // Check if user's role is in the allowed roles
    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({ status: 'error', message: 'Forbidden: Insufficient permissions' });
    }
    
    next();
  };
};

module.exports = authorize;
```

## Validation Middleware

The validation middleware validates request data using express-validator:

```javascript
const { validationResult } = require('express-validator');

module.exports = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation error',
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  }
  next();
};
```

## Error Handling Middleware

The error handling middleware catches and formats errors:

```javascript
module.exports = (err, req, res, next) => {
  console.error('Unhandled error:', err);
  
  // Default error status and message
  let status = 500;
  let message = 'Internal server error';
  let errorDetails = undefined;
  
  // Handle specific error types
  if (err.name === 'SequelizeValidationError') {
    status = 400;
    message = 'Validation error';
    errorDetails = err.errors.map(e => ({
      field: e.path,
      message: e.message
    }));
  } else if (err.name === 'SequelizeUniqueConstraintError') {
    status = 409;
    message = 'Duplicate entry';
    errorDetails = err.errors.map(e => ({
      field: e.path,
      message: e.message
    }));
  }
  
  // Include error details in development mode
  if (process.env.NODE_ENV === 'development') {
    errorDetails = errorDetails || err.message;
  }
  
  res.status(status).json({
    status: 'error',
    message,
    errors: errorDetails
  });
};
```

## File Upload Middleware

The file upload middleware handles file uploads using multer:

```javascript
const multer = require('multer');
const path = require('path');

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

// Create upload middleware
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

module.exports = upload;
```

## Rate Limiting Middleware

The rate limiting middleware prevents abuse by limiting request rates:

```javascript
const rateLimit = require('express-rate-limit');

// Create rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    status: 'error',
    message: 'Too many requests, please try again later.'
  }
});

// Create stricter limiter for auth routes
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    status: 'error',
    message: 'Too many login attempts, please try again later.'
  }
});

module.exports = {
  apiLimiter,
  authLimiter
};
```

## Logging Middleware

The logging middleware logs request information:

```javascript
module.exports = (req, res, next) => {
  const start = Date.now();
  
  // Log request
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  
  // Log response time on finish
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
  });
  
  next();
};
```

For more detailed information about specific middleware, refer to the JSDoc documentation in the code.