# HopeConnect

HopeConnect is a platform designed to bridge the gap between orphanages and those who want to help. It facilitates sponsorships, donations, volunteer opportunities, and partnerships to support orphans and orphanages.

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [License](#license)

## Features

- **Orphanage Management**: Register and manage orphanages
- **Orphan Profiles**: Create and manage profiles for orphans
- **User Management**: Register users as donors, volunteers, or administrators
- **Sponsorship System**: Allow users to sponsor specific orphans
- **Donation System**: Process and track donations to orphanages
- **Volunteer Management**: Connect volunteers with orphanages needing assistance
- **Review System**: Allow users to leave reviews for orphanages
- **Delivery Tracking**: Track the delivery of physical donations
- **Partnership Management**: Manage partnerships between organizations and orphanages

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MySQL with Sequelize ORM
- **Authentication**: JWT (JSON Web Tokens), bcrypt for password hashing
- **Documentation**: Swagger/OpenAPI
- **Security**: Helmet, Express Rate Limit
- **Other Tools**: Nodemailer for email functionality

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/hopeconnect.git
   cd hopeconnect
   ```

2. Install dependencies:
   ```
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
   ```
   # Create a MySQL database named 'hopeconnect'
   # The tables will be automatically created when you start the server in development mode
   ```

5. Start the server:
   ```
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## Usage

Once the server is running, you can access:

- API endpoints at `http://localhost:3000/api/v1/`
- API documentation at `http://localhost:3000/api-docs/`
- Health check at `http://localhost:3000/health`

## API Documentation

The API is documented using Swagger. After starting the server, visit `http://localhost:3000/api-docs/` to explore the available endpoints.

### Main API Endpoints

- `/api/v1/user` - User management
- `/api/v1/orphanage` - Orphanage management
- `/api/v1/orphan` - Orphan profiles
- `/api/v1/sponsorship` - Sponsorship management
- `/api/v1/donation` - Donation processing
- `/api/v1/volunteer` - Volunteer management
- `/api/v1/review` - Orphanage reviews
- `/api/v1/deliveryTracking` - Track donation deliveries
- `/api/v1/partnership` - Partnership management

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
