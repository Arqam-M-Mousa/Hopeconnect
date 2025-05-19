# Development Guide

This guide provides information for developers who want to contribute to or extend the HopeConnect platform. It covers development setup, coding standards, testing, and other important aspects of the development process.

## Development Environment Setup

### Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v14 or later)
- npm (v6 or later)
- MySQL (v8 or later)
- Git

### Setting Up the Project

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/hopeconnect.git
   cd hopeconnect
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the required environment variables (see [Configuration](configuration.md) for details).

4. Set up the database:
   ```bash
   # Create a MySQL database named 'hopeconnect'
   mysql -u root -p -e "CREATE DATABASE hopeconnect CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

The server will start on the port specified in your `.env` file (default: 3000) and will automatically restart when you make changes to the code.

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

## Coding Standards

HopeConnect follows a set of coding standards to ensure consistency and maintainability:

### JavaScript Style Guide

- Use ES6+ features where appropriate
- Use camelCase for variables and functions
- Use PascalCase for classes and constructor functions
- Use UPPER_CASE for constants
- Use meaningful variable and function names
- Keep functions small and focused on a single task
- Add JSDoc comments for all functions and classes

### Example:

```javascript
/**
 * Calculate the total donation amount for an orphanage
 * @param {number} orphanageId - The ID of the orphanage
 * @param {Date} startDate - Start date for the calculation
 * @param {Date} endDate - End date for the calculation
 * @returns {Promise<number>} Total donation amount
 */
async function calculateTotalDonations(orphanageId, startDate, endDate) {
  const donations = await Donation.findAll({
    where: {
      orphanageId,
      createdAt: {
        [Op.between]: [startDate, endDate]
      },
      status: 'completed'
    }
  });
  
  return donations.reduce((total, donation) => total + parseFloat(donation.amount), 0);
}
```

## API Development

When developing new API endpoints, follow these guidelines:

1. **Route Organization**: Add new routes to the appropriate file in the `routes` directory. If creating a new resource, create a new route file.

2. **Controller Logic**: Keep route handlers thin. Move business logic to service files in the `services` directory.

3. **Validation**: Add request validation using express-validator for all endpoints that accept user input.

4. **Error Handling**: Use try-catch blocks and pass errors to the error handling middleware.

5. **Documentation**: Add Swagger/JSDoc comments to document the API endpoint.

### Example:

```javascript
/**
 * @swagger
 * /api/v1/orphanage/{id}:
 *   get:
 *     summary: Get orphanage by ID
 *     description: Retrieves detailed information about an orphanage
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Orphanage ID
 *     responses:
 *       200:
 *         description: Orphanage details
 *       404:
 *         description: Orphanage not found
 */
router.get('/:id', async (req, res, next) => {
  try {
    const orphanage = await orphanageService.getOrphanageById(req.params.id);
    if (!orphanage) {
      return res.status(404).json({ status: 'error', message: 'Orphanage not found' });
    }
    res.json({ status: 'success', data: orphanage });
  } catch (error) {
    next(error);
  }
});
```

## Database Development

When working with the database:

1. **Model Definition**: Define models in the `models` directory using Sequelize.

2. **Migrations**: Use Sequelize migrations for database schema changes.

3. **Relationships**: Define model relationships in the `models/index.js` file.

4. **Transactions**: Use transactions for operations that modify multiple tables.

### Creating a Migration

```bash
npx sequelize-cli migration:generate --name add-column-to-table
```

Edit the generated migration file:

```javascript
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('TableName', 'columnName', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('TableName', 'columnName');
  }
};
```

Run the migration:

```bash
npx sequelize-cli db:migrate
```

## Testing

HopeConnect uses Jest for testing. Tests are organized in a `tests` directory that mirrors the project structure.

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- tests/services/userService.test.js
```

### Writing Tests

1. **Unit Tests**: Write unit tests for individual functions and methods.
2. **Integration Tests**: Write integration tests for API endpoints.
3. **Mock Dependencies**: Use Jest's mocking capabilities to mock dependencies.

### Example Test:

```javascript
const userService = require('../../services/userService');
const { User } = require('../../models');

// Mock the User model
jest.mock('../../models', () => ({
  User: {
    findOne: jest.fn(),
    create: jest.fn()
  }
}));

describe('userService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should throw an error if user is not found', async () => {
      // Arrange
      User.findOne.mockResolvedValue(null);
      
      // Act & Assert
      await expect(userService.login('test@example.com', 'password'))
        .rejects.toThrow('User not found');
    });
    
    // More tests...
  });
});
```

## Debugging

For debugging, you can use:

1. **Console Logging**: Use `console.log()` for quick debugging.
2. **Node Inspector**: Run the application with the `--inspect` flag:
   ```bash
   node --inspect server.js
   ```
   Then open Chrome and navigate to `chrome://inspect` to connect to the debugger.
3. **VS Code Debugger**: Use the VS Code debugger with the following configuration in `.vscode/launch.json`:
   ```json
   {
     "version": "0.2.0",
     "configurations": [
       {
         "type": "node",
         "request": "launch",
         "name": "Launch Program",
         "skipFiles": ["<node_internals>/**"],
         "program": "${workspaceFolder}/server.js"
       }
     ]
   }
   ```

## Git Workflow

1. **Branches**: Create a new branch for each feature or bug fix:
   ```bash
   git checkout -b feature/feature-name
   ```

2. **Commits**: Write clear, concise commit messages:
   ```bash
   git commit -m "Add user authentication service"
   ```

3. **Pull Requests**: Submit a pull request when your feature is complete.

4. **Code Review**: All code should be reviewed before merging.

5. **Merge**: After approval, merge your branch into the main branch.

## Documentation

Keep documentation up to date:

1. **Code Comments**: Add JSDoc comments to all functions and classes.
2. **README**: Update the README.md file with any new features or changes.
3. **API Documentation**: Update Swagger comments for API endpoints.
4. **Project Documentation**: Update the documentation in the `docs` directory.

## Troubleshooting Common Issues

### Database Connection Issues

If you're having trouble connecting to the database:

1. Check that MySQL is running:
   ```bash
   sudo service mysql status
   ```

2. Verify your database credentials in the `.env` file.

3. Ensure the database exists:
   ```bash
   mysql -u root -p -e "SHOW DATABASES;"
   ```

### Node.js/npm Issues

If you're having issues with Node.js or npm:

1. Check your Node.js version:
   ```bash
   node -v
   ```

2. Clear npm cache:
   ```bash
   npm cache clean --force
   ```

3. Delete `node_modules` and reinstall:
   ```bash
   rm -rf node_modules
   npm install
   ```

For more detailed information about development, refer to the specific documentation sections for each component of the application.