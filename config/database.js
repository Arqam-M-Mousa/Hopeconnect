const Sequelize = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const requiredEnvVars = ['DATABASE_NAME', 'DATABASE_USERNAME', 'DATABASE_PASSWORD', 'DATABASE_HOST'];

requiredEnvVars.forEach(varName => {
    if (!process.env[varName]) {
        throw new Error(`Missing required environment variable: ${varName}`);
    }
});

const config = {
    database: process.env.DATABASE_NAME,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    host: process.env.DATABASE_HOST,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,

    pool: {
        max: 5,               // Maximum number of connection in pool
        min: 0,               // Minimum number of connection in pool
        acquire: 30000,       // Maximum time (ms) that pool will try to get connection before throwing error
        idle: 10000          // Maximum time (ms) that a connection can be idle before being released
    },

    retry: {
        max: 3               // Maximum amount of connection retries
    },

    // SSL configuration for production
    dialectOptions: {
        ssl: process.env.NODE_ENV === 'production' ? {
            require: true, rejectUnauthorized: false
        } : false
    }
};

const sequelize = new Sequelize(config);

class DatabaseConnection {
    static async connect() {
        try {
            await sequelize.authenticate();
            console.log('✅ Database connection established successfully.');

            // Sync models if in development (be careful with this in production!)
            if (process.env.NODE_ENV === 'development' && process.env.SYNC_DATABASE === 'true') {
                await sequelize.sync({alter: true});
                console.log('✅ Database models synchronized.');
            }
        } catch (error) {
            console.error('❌ Unable to connect to the database:', error);
            await this.retryConnection();
        }
    }

    static async retryConnection(retries = 3) {
        for (let i = 0; i < retries; i++) {
            try {
                await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds before retrying
                await sequelize.authenticate();
                console.log('✅ Database connection established successfully after retry.');
                return;
            } catch (error) {
                console.error(`❌ Retry ${i + 1}/${retries} failed:`, error);
                if (i === retries - 1) {
                    console.error('❌ All connection retries failed. Exiting application...');
                    process.exit(1);
                }
            }
        }
    }

    static async disconnect() {
        try {
            await sequelize.close();
            console.log('Database connection closed.');
        } catch (error) {
            console.error('Error while closing database connection:', error);
            process.exit(1);
        }
    }
}

process.on('SIGINT', async () => {
    await DatabaseConnection.disconnect();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    await DatabaseConnection.disconnect();
    process.exit(0);
});

DatabaseConnection.connect();

module.exports = sequelize;