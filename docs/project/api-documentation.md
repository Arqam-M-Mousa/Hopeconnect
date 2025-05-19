# API Documentation

HopeConnect provides a RESTful API that allows you to interact with all aspects of the platform. This page provides an overview of the API and how to use it.

## API Overview

The HopeConnect API is organized around REST principles. It uses standard HTTP verbs, returns JSON-encoded responses, and uses standard HTTP response codes to indicate the success or failure of requests.

### Base URL

All API endpoints are prefixed with:

```
http://localhost:3000/api/v1
```

For production, this would be replaced with your domain.

### Authentication

Most API endpoints require authentication. HopeConnect uses JSON Web Tokens (JWT) for authentication. To authenticate, you need to:

1. Obtain a token by calling the login endpoint
2. Include the token in the Authorization header of subsequent requests

Example:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Interactive API Documentation

HopeConnect provides interactive API documentation using Swagger UI. This allows you to:

- Browse all available endpoints
- See request parameters and response schemas
- Test endpoints directly from your browser

To access the Swagger documentation, visit:

```
http://localhost:3000/api-docs/
```

## Main API Endpoints

### User Management

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/user/register` | POST | Register a new user |
| `/user/login` | POST | Login and get authentication token |
| `/user/me` | GET | Get current user profile |
| `/user/{id}` | GET | Get user by ID |
| `/user` | GET | List users |

### Orphanage Management

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/orphanage` | GET | List orphanages |
| `/orphanage/{id}` | GET | Get orphanage by ID |
| `/orphanage` | POST | Create a new orphanage |
| `/orphanage/{id}` | PUT | Update an orphanage |
| `/orphanage/statistics` | GET | Get orphanage statistics |
| `/orphanage/help-requests` | GET | List help requests from orphanages |

### Orphan Management

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/orphan` | GET | List orphans |
| `/orphan/{id}` | GET | Get orphan by ID |
| `/orphan` | POST | Create a new orphan profile |
| `/orphan/{id}` | PUT | Update an orphan profile |
| `/orphan/sponsorships` | GET | List orphans with sponsorship information |

### Donation Management

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/donation` | GET | List donations |
| `/donation/{id}` | GET | Get donation by ID |
| `/donation` | POST | Create a new donation |
| `/donation/updates` | GET | Get donation updates |
| `/donation/{id}/updates` | GET | Get updates for a specific donation |

### Volunteer Management

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/volunteer` | GET | List volunteers |
| `/volunteer/{id}` | GET | Get volunteer by ID |
| `/volunteer` | POST | Register as a volunteer |
| `/volunteer/search` | GET | Search for volunteers |
| `/volunteer/{id}/verify` | PUT | Verify a volunteer |
| `/volunteer/{id}/apply` | POST | Apply for a help request |

### Sponsorship Management

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/sponsorship` | GET | List sponsorships |
| `/sponsorship/{id}` | GET | Get sponsorship by ID |
| `/sponsorship` | POST | Create a new sponsorship |

### Review Management

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/review` | GET | List reviews |
| `/review/{id}` | GET | Get review by ID |
| `/review` | POST | Create a new review |

### Delivery Tracking

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/deliveryTracking` | GET | List delivery trackings |
| `/deliveryTracking/{id}` | GET | Get delivery tracking by ID |
| `/deliveryTracking` | POST | Create a new delivery tracking |
| `/deliveryTracking/{id}/location` | PUT | Update delivery location |

### Partnership Management

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/partnership` | GET | List partnerships |
| `/partnership/{id}` | GET | Get partnership by ID |
| `/partnership` | POST | Create a new partnership |
| `/partnership/{partnershipId}/orphanages` | GET | List orphanages in a partnership |

## Pagination

The HopeConnect API supports pagination for endpoints that return multiple items:

- **Query Parameters**:
  - `page`: The page number (starts from 1)
  - `limit`: Number of items per page (default: 10)

- **Response Format**:
  ```json
  {
    "data": [...],
    "pagination": {
      "totalItems": 100,
      "totalPages": 10,
      "currentPage": 1,
      "itemsPerPage": 10
    }
  }
  ```

- **Example Usage**:
  ```
  GET /api/v1/orphanages?page=2&limit=15
  ```

## Error Handling

The API uses standard HTTP status codes to indicate the success or failure of requests:

- 2xx: Success
- 4xx: Client error (invalid request)
- 5xx: Server error

Error responses include a JSON body with more details:

```json
{
  "status": "error",
  "message": "Detailed error message",
  "error": "Optional technical details (in development mode only)"
}
```