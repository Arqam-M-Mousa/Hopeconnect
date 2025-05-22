# Configuration

HopeConnect uses various configuration files and environment variables to control its behavior. This page documents the main configuration settings and how to customize them.

## Environment Variables

HopeConnect uses environment variables for configuration. These can be set in a `.env` file in the root directory of the project.

### Required Environment Variables

```
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASS=your_password
DB_NAME=hopeconnect

# JWT Configuration
JWT_SECRET=your_jwt_secret

# Email Configuration
EMAIL_ADDRESS=your_email@example.com
EMAIL_PASSWORD=your_email_password
```

### Optional Environment Variables

```
# Server Configuration
API_PREFIX=/api/v1

# Database Configuration
DB_PORT=3306
DB_DIALECT=mysql

# JWT Configuration
JWT_EXPIRATION=24h

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587

# File Upload Configuration
UPLOAD_DIR=uploads
MAX_FILE_SIZE=5242880 # 5MB

# Logging Configuration
LOG_LEVEL=info
LOG_DIR=logs
```

## Database Configuration

The database connection is configured in `config/database.js`:

```javascript
const Sequelize = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: process.env.DB_DIALECT || 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

module.exports = sequelize;
```

## Swagger Configuration

The Swagger API documentation is configured in `config/swagger.js`:

```javascript
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'HopeConnect API',
      version: '1.0.0',
      description: 'API documentation for HopeConnect platform',
      contact: {
        name: 'API Support',
        email: 'support@hopeconnect.example.com'
      }
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}/api/v1`,
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./routes/*.js', './models/*.js']
};

const specs = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  specs
};
```

## Email Configuration

Email sending is configured in `config/email.js`:

```javascript
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: process.env.EMAIL_PORT === '465',
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD
  }
});

module.exports = transporter;
```

## Rate Limiting Configuration

Rate limiting is configured in `config/rateLimit.js`:

```javascript
const rateLimit = require('express-rate-limit');

const defaultLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    status: 'error',
    message: 'Too many requests, please try again later.'
  }
});

const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    status: 'error',
    message: 'Too many login attempts, please try again later.'
  }
});

module.exports = {
  defaultLimiter,
  authLimiter
};
```

## Multer Configuration

File uploads are configured using Multer in `config/multer.js`:

```javascript
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const uploadDir = process.env.UPLOAD_DIR || 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
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
    fileSize: parseInt(process.env.MAX_FILE_SIZE || 5242880) // 5MB default
  }
});

module.exports = upload;
```

## Winston Logger Configuration

Logging is configured using Winston in `config/logger.js`:

```javascript
const winston = require('winston');
const path = require('path');
const fs = require('fs');

// Ensure log directory exists
const logDir = process.env.LOG_DIR || 'logs';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level.toUpperCase()}: ${message}`;
  })
);

// Create logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
  format: logFormat,
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: path.join(logDir, 'error.log'), level: 'error' }),
    new winston.transports.File({ filename: path.join(logDir, 'combined.log') })
  ]
});

module.exports = logger;
```

## Configuration Best Practices

1. **Never commit sensitive information**: Keep sensitive information like API keys and passwords in environment variables, not in code.
2. **Use environment-specific configurations**: Use different configurations for development, testing, and production environments.
3. **Validate environment variables**: Check that required environment variables are present when the application starts.
4. **Document all configuration options**: Ensure all configuration options are well-documented for other developers.
5. **Use sensible defaults**: Provide sensible default values for optional configuration settings.

For more detailed information about specific configuration options, refer to the comments in the configuration files.