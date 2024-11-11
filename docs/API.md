## RWA Platform API Documentation

### Authentication

All authenticated endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <token>
```

### Endpoints

#### Authentication

##### POST /api/auth/register
Register a new user.

Request:
```json
{
  "email": "user@example.com",
  "password": "securePassword123!",
  "name": "John Doe"
}
```

Response:
```json
{
  "token": "jwt.token.here",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

##### POST /api/auth/login
Login with existing credentials.

Request:
```json
{
  "email": "user@example.com",
  "password": "securePassword123!"
}
```

Response:
```json
{
  "token": "jwt.token.here",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

#### Transactions

##### POST /api/transactions
Create a new transaction.

Request:
```json
{
  "type": "DEPOSIT",
  "amount": "100.00"
}
```

Response:
```json
{
  "id": "transaction-id",
  "type": "DEPOSIT",
  "amount": "100.00",
  "fee": "0.10",
  "status": "pending",
  "timestamp": 1699142400000
}
```

##### GET /api/transactions
Get user transactions.

Query Parameters:
- type: DEPOSIT | WITHDRAWAL | CONVERSION
- status: pending | completed | failed

Response:
```json
[
  {
    "id": "transaction-id",
    "type": "DEPOSIT",
    "amount": "100.00",
    "fee": "0.10",
    "status": "completed",
    "timestamp": 1699142400000
  }
]
```

#### Profiles

##### GET /api/profiles/:userId
Get user profile.

Response:
```json
{
  "userId": "user-id",
  "bio": "User bio",
  "location": "New York",
  "website": "https://example.com",
  "createdAt": "2023-11-05T00:00:00.000Z",
  "updatedAt": "2023-11-05T00:00:00.000Z"
}
```

### Error Responses

All error responses follow this format:

```json
{
  "error": "Error Type",
  "code": "ERROR_CODE",
  "message": "Detailed error message"
}
```

Common error codes:
- VALIDATION_ERROR: Invalid input data
- UNAUTHORIZED: Authentication required
- NOT_FOUND: Resource not found
- RATE_LIMIT_EXCEEDED: Too many requests
- INTERNAL_ERROR: Server error