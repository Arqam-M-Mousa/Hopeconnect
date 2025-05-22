# Services

HopeConnect uses a service-oriented architecture to separate business logic from controllers and routes. This page documents the main service files and their purposes.

## Service Structure

The services are organized in a modular structure, with each file handling a specific resource or feature:

```
services/
├── user.js                # User-related business logic
├── orphanage.js           # Orphanage-related business logic
├── orphan.js              # Orphan-related business logic
├── sponsorship.js         # Sponsorship-related business logic
├── donation.js            # Donation-related business logic
├── volunteer.js           # Volunteer-related business logic
├── review.js              # Review-related business logic
├── deliveryTracking.js    # Delivery tracking business logic
└── partnership.js         # Partnership-related business logic
```

## Service Layer Benefits

The service layer provides several benefits:

1. **Separation of Concerns**: Business logic is separated from controllers, making the code more maintainable
2. **Reusability**: Services can be reused across different controllers and routes
3. **Testability**: Services are easier to test in isolation
4. **Transaction Management**: Services can manage database transactions for complex operations

## User Service

The user service handles user-related business logic:

```javascript
// Example of user service methods
async function register(userData) {
  // Hash password
  const hashedPassword = await bcrypt.hash(userData.password, 10);

  // Create user
  const user = await User.create({
    ...userData,
    password: hashedPassword
  });

  // Generate token
  const token = generateToken(user);

  return { user, token };
}

async function login(email, password) {
  // Find user
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Error('User not found');
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid password');
  }

  // Generate token
  const token = generateToken(user);

  return { user, token };
}
```

## Donation Service

The donation service handles donation processing and tracking:

```javascript
// Example of donation service methods
async function createDonation(donationData, userId) {
  // Start transaction
  const transaction = await sequelize.transaction();

  try {
    // Create donation
    const donation = await Donation.create({
      ...donationData,
      donorId: userId
    }, { transaction });

    // Update orphanage balance
    if (donationData.orphanageId) {
      await OrphanageBalance.increment('balance', { 
        by: donationData.amount, 
        where: { orphanageId: donationData.orphanageId },
        transaction
      });
    }

    // Create donation tracking
    await DonationTracking.create({
      donationId: donation.id,
      status: 'received',
      notes: 'Donation received'
    }, { transaction });

    // Commit transaction
    await transaction.commit();

    // Send confirmation email
    await emailService.sendDonationConfirmation(userId, donation);

    return donation;
  } catch (error) {
    // Rollback transaction on error
    await transaction.rollback();
    throw error;
  }
}
```


## Service Error Handling

Services include error handling to ensure that errors are properly caught and reported:

```javascript
// Example of service with error handling
async function getOrphanageById(id) {
  try {
    const orphanage = await Orphanage.findByPk(id, {
      include: [
        { model: Orphan },
        { model: Review }
      ]
    });

    if (!orphanage) {
      throw new Error('Orphanage not found');
    }

    return orphanage;
  } catch (error) {
    console.error('Error in getOrphanageById:', error);
    throw error;
  }
}
```

For more detailed information about specific services, refer to the JSDoc documentation in the code.
