# Routes

HopeConnect's API is organized into logical route groups that handle different aspects of the application. This page documents the main route files and their purposes, including the complete URIs for each endpoint.

## API Base URL

All API endpoints are prefixed with:

```
http://localhost:3000/api/v1
```

## Route Structure

The routes are organized in a modular structure, with each file handling a specific resource or feature:

```
routes/
├── index.js           # Main router that combines all routes
├── user.js            # User management routes
├── orphanage.js       # Orphanage management routes
├── orphan.js          # Orphan profile routes
├── sponsorship.js     # Sponsorship management routes
├── donation.js        # Donation processing routes
├── volunteer.js       # Volunteer management routes
├── review.js          # Orphanage review routes
├── deliveryTracking.js # Donation delivery tracking routes
└── partnership.js     # Partnership management routes
```

## User Routes

The user routes handle user registration, authentication, and profile management:

| Method | URI | Description | Authentication | Authorization |
|--------|-----|-------------|----------------|---------------|
| POST | `/api/v1/user/register` | Register a new user | No | None |
| POST | `/api/v1/user/login` | Login a user | No | None |
| GET | `/api/v1/user/dashboard` | Get user dashboard | Yes | Donor |
| GET | `/api/v1/user/me` | Get current user profile | Yes | Any |
| PUT | `/api/v1/user/me` | Update current user profile | Yes | Any |
| DELETE | `/api/v1/user/me` | Delete current user profile | Yes | Any |
| DELETE | `/api/v1/user/:id` | Delete a user by ID | Yes | Admin |
| GET | `/api/v1/user/:id` | Get a user by ID | Yes | Admin |
| GET | `/api/v1/user` | Get all users | Yes | Admin |

## Orphanage Routes

The orphanage routes handle orphanage registration, updates, and queries:

| Method | URI | Description | Authentication | Authorization |
|--------|-----|-------------|----------------|---------------|
| GET | `/api/v1/orphanage/statistics` | Get orphanage statistics | No | None |
| GET | `/api/v1/orphanage/help-requests` | Get all help requests | No | None |
| GET | `/api/v1/orphanage/:id` | Get orphanage by ID | No | None |
| PUT | `/api/v1/orphanage/:id` | Update orphanage | Yes | Admin |
| DELETE | `/api/v1/orphanage/:id` | Delete orphanage | Yes | Admin |
| GET | `/api/v1/orphanage/:id/help-requests` | Get help requests for a specific orphanage | No | None |
| POST | `/api/v1/orphanage/:id/help-requests` | Create a help request for a specific orphanage | Yes | Admin |
| GET | `/api/v1/orphanage/:id/help-requests/:requestId` | Get a specific help request for a specific orphanage | No | None |
| PUT | `/api/v1/orphanage/:id/help-requests/:requestId` | Update a specific help request for a specific orphanage | Yes | Admin |
| DELETE | `/api/v1/orphanage/:id/help-requests/:requestId` | Delete a specific help request for a specific orphanage | Yes | Admin |
| GET | `/api/v1/orphanage` | Get all orphanages | No | None |
| POST | `/api/v1/orphanage` | Create a new orphanage | Yes | Admin |

## Orphan Routes

The orphan routes handle orphan profile management:

| Method | URI | Description | Authentication | Authorization |
|--------|-----|-------------|----------------|---------------|
| GET | `/api/v1/orphan/sponsorships` | Get orphans available for sponsorship | No | None |
| GET | `/api/v1/orphan/:id` | Get orphan by ID | Yes | Any |
| DELETE | `/api/v1/orphan/:id` | Delete orphan | Yes | Admin |
| PUT | `/api/v1/orphan/:id` | Update orphan | Yes | Admin |
| GET | `/api/v1/orphan` | Get all orphans | No | None |
| POST | `/api/v1/orphan` | Create a new orphan | Yes | Admin |

## Sponsorship Routes

The sponsorship routes handle sponsorship management:

| Method | URI | Description | Authentication | Authorization |
|--------|-----|-------------|----------------|---------------|
| GET | `/api/v1/sponsorship/:id` | Get sponsorship by ID | Yes | Any |
| PUT | `/api/v1/sponsorship/:id` | Update sponsorship | Yes | Any |
| DELETE | `/api/v1/sponsorship/:id` | Delete sponsorship | Yes | Donor or Admin |
| GET | `/api/v1/sponsorship` | Get all sponsorships | Yes | Admin |
| POST | `/api/v1/sponsorship` | Create a new sponsorship | Yes | Donor |

## Donation Routes

The donation routes handle donation processing and tracking:

| Method | URI | Description | Authentication | Authorization |
|--------|-----|-------------|----------------|---------------|
| GET | `/api/v1/donation/updates` | Get all donation updates | Yes | Admin |
| GET | `/api/v1/donation/:id` | Get donation by ID | Yes | Admin |
| DELETE | `/api/v1/donation/:id` | Delete donation | Yes | Admin |
| PUT | `/api/v1/donation/:id` | Update donation | Yes | Admin |
| GET | `/api/v1/donation/:id/updates` | Get updates for a specific donation | Yes | Admin or Donor |
| GET | `/api/v1/donation/:id/updates/:updateId` | Get a specific update for a specific donation | Yes | Admin or Donor |
| GET | `/api/v1/donation/updates/:id` | Get update by ID | Yes | Admin |
| GET | `/api/v1/donation` | Get all donations | Yes | Admin |
| POST | `/api/v1/donation` | Create a new donation | Yes | Donor |

## Volunteer Routes

The volunteer routes handle volunteer management:

| Method | URI | Description | Authentication | Authorization |
|--------|-----|-------------|----------------|---------------|
| GET | `/api/v1/volunteer/me` | Get current volunteer profile | Yes | Volunteer |
| PUT | `/api/v1/volunteer/me` | Update current volunteer profile | Yes | Volunteer |
| DELETE | `/api/v1/volunteer/me` | Delete current volunteer profile | Yes | Volunteer |
| GET | `/api/v1/volunteer/me/applications` | Get volunteer applications | Yes | Any |
| GET | `/api/v1/volunteer/search` | Search volunteers | Yes | Admin |
| GET | `/api/v1/volunteer/:id` | Get volunteer by ID | Yes | Admin |
| DELETE | `/api/v1/volunteer/:id` | Delete volunteer by ID | Yes | Admin |
| PUT | `/api/v1/volunteer/:id` | Update volunteer by ID | Yes | Admin |
| PUT | `/api/v1/volunteer/:id/verify` | Verify volunteer | Yes | Admin |
| POST | `/api/v1/volunteer/:id/apply` | Apply to help request | Yes | Volunteer |
| DELETE | `/api/v1/volunteer/:id/applications/:applicationId` | Cancel application | Yes | Any |
| GET | `/api/v1/volunteer/:id/matches` | Match volunteer to opportunities | Yes | Any |
| GET | `/api/v1/volunteer` | Get all volunteers | Yes | Admin |

## Review Routes

The review routes handle orphanage reviews:

| Method | URI | Description | Authentication | Authorization |
|--------|-----|-------------|----------------|---------------|
| GET | `/api/v1/review/:id` | Get review by ID | Yes | Any |
| GET | `/api/v1/review` | Get all reviews | Yes | Any |
| POST | `/api/v1/review` | Create a new review | Yes | Donor |
| PUT | `/api/v1/review` | Update review | Yes | Donor |
| DELETE | `/api/v1/review` | Delete review | Yes | Donor or Admin |

## Delivery Tracking Routes

The delivery tracking routes handle donation delivery tracking:

| Method | URI | Description | Authentication | Authorization |
|--------|-----|-------------|----------------|---------------|
| GET | `/api/v1/deliveryTracking/:id` | Get delivery by ID | Yes | Admin or Donor |
| PUT | `/api/v1/deliveryTracking/:id` | Update delivery | Yes | Admin |
| DELETE | `/api/v1/deliveryTracking/:id` | Delete delivery | Yes | Admin |
| GET | `/api/v1/deliveryTracking/:id/location` | Get current location of delivery | Yes | Admin or Donor |
| GET | `/api/v1/deliveryTracking` | Get all deliveries | Yes | Admin |
| POST | `/api/v1/deliveryTracking` | Create a new delivery | Yes | Admin |

## Partnership Routes

The partnership routes handle partnership management:

| Method | URI | Description | Authentication | Authorization |
|--------|-----|-------------|----------------|---------------|
| POST | `/api/v1/partnership` | Create a new partner | Yes | Admin |
| GET | `/api/v1/partnership/:id` | Get partner by ID | No | None |
| PUT | `/api/v1/partnership/:id` | Update partner | Yes | Admin |
| DELETE | `/api/v1/partnership/:id` | Delete partner | Yes | Admin |
| GET | `/api/v1/partnership/:partnershipId/orphanages` | Get orphanages for a specific partner | No | None |
| POST | `/api/v1/partnership/:partnershipId/orphanages/:orphanageId` | Link partner to orphanage | Yes | Admin |
| DELETE | `/api/v1/partnership/:partnershipId/orphanages/:orphanageId` | Unlink partner from orphanage | Yes | Admin |
| GET | `/api/v1/partnership` | Get all partners | No | None |

## Authentication

Most routes are protected by authentication middleware that verifies the user's JWT token. To authenticate, include the JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Error Handling

Routes include error handling to ensure that errors are properly caught and reported:

```javascript
// Example of route with error handling
router.get('/:id', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }
    res.json({ status: 'success', data: user });
  } catch (error) {
    next(error); // Pass to global error handler
  }
});
```

For more detailed information about specific routes, refer to the API Documentation.
