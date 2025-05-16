const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const sequelize = require('./config/database');


// Load environment variables
dotenv.config();

// Routes
const routes = require('./routes/index');

const app = express();

// Constants
const PORT = process.env.PORT || 3000;
const API_PREFIX = '/api/v1';
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

// Middleware
app.use(cors());
app.use(helmet());
app.use(limiter)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// API Routes
app.use(`${API_PREFIX}/orphanages`, routes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Resource not found'
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

const startServer = async () => {
    try {
        // Test database connection
        await sequelize.authenticate();
        console.log('Database connection established successfully.');

        // Sync database models (in development)
        if (process.env.NODE_ENV === 'development') {
            await sequelize.sync({ alter: true });
            console.log('Database models synchronized.');
        }

        // Start server
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            console.log(`API is available at http://localhost:${PORT}${API_PREFIX}`);
        });
    } catch (error) {
        console.error('Unable to start server:', error);
        process.exit(1);
    }
};

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

// Start the server
startServer();
