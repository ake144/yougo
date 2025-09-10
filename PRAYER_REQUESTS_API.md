# Prayer Requests API Documentation

## Overview
The Prayer Requests API allows users to submit prayer requests and administrators to manage them. The API provides endpoints for creating, reading, updating, and deleting prayer requests.

## Base URL
```
http://localhost:3000/prayer-requests
```

## Endpoints

### 1. Create Prayer Request
**POST** `/prayer-requests`

Creates a new prayer request. This endpoint is public and doesn't require authentication.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "type": "Personal",
  "message": "Please pray for my family's health and safety during these difficult times.",
  "isAnonymous": false
}
```

**Response:**
```json
{
  "id": "uuid",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "type": "Personal",
  "message": "Please pray for my family's health and safety during these difficult times.",
  "status": "Pending",
  "isAnonymous": false,
  "notes": null,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### 2. Get All Prayer Requests
**GET** `/prayer-requests`

Retrieves all prayer requests. Requires authentication (JWT token).

**Query Parameters:**
- `status` (optional): Filter by status (Pending, In Progress, Answered, Closed)
- `type` (optional): Filter by type (Personal, Family, Health, Financial, Spiritual, Work, Relationship, Other)

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "type": "Personal",
    "message": "Please pray for my family's health and safety during these difficult times.",
    "status": "Pending",
    "isAnonymous": false,
    "notes": null,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### 3. Get Prayer Request Statistics
**GET** `/prayer-requests/stats`

Retrieves statistics about prayer requests. Requires authentication.

**Response:**
```json
{
  "total": 100,
  "pending": 25,
  "inProgress": 15,
  "answered": 50,
  "closed": 10
}
```

### 4. Get Single Prayer Request
**GET** `/prayer-requests/:id`

Retrieves a specific prayer request by ID. Requires authentication.

**Response:**
```json
{
  "id": "uuid",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "type": "Personal",
  "message": "Please pray for my family's health and safety during these difficult times.",
  "status": "Pending",
  "isAnonymous": false,
  "notes": null,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### 5. Update Prayer Request
**PATCH** `/prayer-requests/:id`

Updates a prayer request. Requires authentication.

**Request Body:**
```json
{
  "status": "In Progress",
  "notes": "Prayer team has been notified and will begin praying immediately."
}
```

**Response:**
```json
{
  "id": "uuid",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "type": "Personal",
  "message": "Please pray for my family's health and safety during these difficult times.",
  "status": "In Progress",
  "isAnonymous": false,
  "notes": "Prayer team has been notified and will begin praying immediately.",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### 6. Delete Prayer Request
**DELETE** `/prayer-requests/:id`

Deletes a prayer request. Requires authentication.

**Response:**
```
204 No Content
```

## Data Models

### PrayerRequestType Enum
- `Personal`
- `Family`
- `Health`
- `Financial`
- `Spiritual`
- `Work`
- `Relationship`
- `Other`

### PrayerRequestStatus Enum
- `Pending` (default)
- `In Progress`
- `Answered`
- `Closed`

## Authentication
Most endpoints require a JWT token in the request cookies as `access_token`. The token is obtained through the authentication system.

## Error Responses
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Missing or invalid authentication token
- `404 Not Found`: Prayer request not found
- `500 Internal Server Error`: Server error

## Example Usage

### Submit a Prayer Request (Frontend)
```javascript
const response = await fetch('/api/prayer-requests', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    type: 'Health',
    message: 'Please pray for my recovery from illness.',
    isAnonymous: false
  })
});

const prayerRequest = await response.json();
```

### Get Prayer Requests (Admin)
```javascript
const response = await fetch('/api/prayer-requests', {
  method: 'GET',
  credentials: 'include' // Include cookies for authentication
});

const prayerRequests = await response.json();
```
