# Getting Started

This guide will help you set up and run the HopeConnect application on your local machine for development and testing purposes.

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) (v6 or higher)
- [MySQL](https://www.mysql.com/) (v8 or higher)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/Arqam-M-Mousa/Hopeconnect
cd Hopeconnect
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:

```
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASS=your_password
DB_NAME=hopeconnect

# JWT Secret
JWT_SECRET=your_jwt_secret

# Email Configuration (if using nodemailer)
EMAIL_ADDRESS=your_email@example.com
EMAIL_PASSWORD=your_email_password
```

4. Set up the database:

```bash
# Create a MySQL database named 'hopeconnect'
# The tables will be automatically created when you start the server in development mode
```

## Running the Application

### Development Mode

To run the application in development mode with automatic reloading:

```bash
npm run dev
```

### Production Mode

To run the application in production mode:

```bash
npm start
```

## Accessing the Application

Once the server is running, you can access:

- API endpoints at `http://localhost:3000/api/v1/`
- API documentation at `http://localhost:3000/api-docs/`
- Health check at `http://localhost:3000/health`

## Project Structure

```
hopeconnect/
├── config/             # Configuration files
├── docs/               # Documentation files
├── middleware/         # Express middleware
├── models/             # Sequelize models
├── routes/             # API routes
├── services/           # Business logic
├── utils/              # Utility functions
├── .env                # Environment variables (create this)
├── package.json        # Project dependencies
├── README.md           # Project documentation
└── server.js           # Application entry point
```

## Next Steps

- Explore the [API Documentation](api-documentation.md) to understand the available endpoints
- Learn about the [Architecture](architecture.md) of the application
- Check out the [Development Guide](development-guide.md) for coding standards and best practices