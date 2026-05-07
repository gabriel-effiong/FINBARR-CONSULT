# API Documentation

Complete API documentation for FINBARR CONSULT backend.

## Base URL

**Development:** `http://localhost:5000/api`
**Production:** `https://your-deployed-backend-url.com/api`

## Authentication

Admin endpoints require JWT token in Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Endpoints

### 1. Contact Form Endpoints

#### Submit Contact Form

- **URL:** `/contact`
- **Method:** `POST`
- **Auth:** No
- **Content-Type:** `application/json`

**Request Body:**

```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "company": "ABC Corp",
  "phone": "+234 803 815 8668",
  "service": "strategy",
  "message": "We need strategic consulting for our business growth"
}
```

**Success Response (201):**

```json
{
  "success": true,
  "message": "Thank you for your message! We will contact you soon!",
  "contactId": "507f1f77bcf86cd799439011"
}
```

**Error Response (400):**

```json
{
  "success": false,
  "errors": [
    {
      "msg": "Full name is required",
      "param": "fullName"
    }
  ]
}
```

---

#### Get All Contacts (Admin)

- **URL:** `/contact?page=1&limit=10`
- **Method:** `GET`
- **Auth:** Required
- **Query Parameters:**
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Items per page (default: 10)

**Success Response (200):**

```json
{
  "success": true,
  "contacts": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "fullName": "John Doe",
      "email": "john@example.com",
      "company": "ABC Corp",
      "phone": "+234 803 815 8668",
      "service": "strategy",
      "message": "We need...",
      "status": "new",
      "adminNotes": "",
      "isRead": false,
      "createdAt": "2024-05-07T10:30:00Z",
      "updatedAt": "2024-05-07T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 45,
    "pages": 5,
    "currentPage": 1,
    "limit": 10
  }
}
```

---

#### Get Contact by ID (Admin)

- **URL:** `/contact/:id`
- **Method:** `GET`
- **Auth:** Required

**Success Response (200):**

```json
{
  "success": true,
  "contact": {
    "_id": "507f1f77bcf86cd799439011",
    "fullName": "John Doe",
    "email": "john@example.com",
    "company": "ABC Corp",
    "phone": "+234 803 815 8668",
    "service": "strategy",
    "message": "We need...",
    "status": "new",
    "adminNotes": "Follow up next week",
    "isRead": true,
    "createdAt": "2024-05-07T10:30:00Z",
    "updatedAt": "2024-05-07T10:30:00Z"
  }
}
```

---

#### Update Contact (Admin)

- **URL:** `/contact/:id`
- **Method:** `PUT`
- **Auth:** Required

**Request Body:**

```json
{
  "status": "replied",
  "adminNotes": "Sent proposal email"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Contact updated",
  "contact": {
    /* updated contact object */
  }
}
```

---

#### Delete Contact (Admin)

- **URL:** `/contact/:id`
- **Method:** `DELETE`
- **Auth:** Required

**Success Response (200):**

```json
{
  "success": true,
  "message": "Contact deleted"
}
```

---

#### Get Contact Statistics (Admin)

- **URL:** `/contact/stats`
- **Method:** `GET`
- **Auth:** Required

**Success Response (200):**

```json
{
  "success": true,
  "stats": {
    "totalContacts": 45,
    "unreadContacts": 8,
    "byService": [
      { "_id": "strategy", "count": 15 },
      { "_id": "analytics", "count": 12 },
      { "_id": "process", "count": 18 }
    ]
  }
}
```

---

### 2. Consultation Endpoints

#### Submit Consultation Request

- **URL:** `/consultation`
- **Method:** `POST`
- **Auth:** No

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "company": "ABC Corp",
  "service": "strategy"
}
```

**Success Response (201):**

```json
{
  "success": true,
  "message": "Consultation scheduled! We will contact you to confirm.",
  "consultationId": "507f1f77bcf86cd799439012"
}
```

---

#### Get All Consultations (Admin)

- **URL:** `/consultation?page=1&limit=10`
- **Method:** `GET`
- **Auth:** Required

**Success Response (200):**

```json
{
  "success": true,
  "consultations": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "John Doe",
      "email": "john@example.com",
      "company": "ABC Corp",
      "service": "strategy",
      "preferredDate": "2024-05-15T09:00:00Z",
      "preferredTime": "09:00 AM",
      "status": "pending",
      "notes": "",
      "followUpDate": null,
      "createdAt": "2024-05-07T10:30:00Z",
      "updatedAt": "2024-05-07T10:30:00Z"
    }
  ],
  "pagination": {
    /* ... */
  }
}
```

---

#### Get Consultation by ID (Admin)

- **URL:** `/consultation/:id`
- **Method:** `GET`
- **Auth:** Required

**Success Response (200):**

```json
{
  "success": true,
  "consultation": {
    /* consultation object */
  }
}
```

---

#### Update Consultation (Admin)

- **URL:** `/consultation/:id`
- **Method:** `PUT`
- **Auth:** Required

**Request Body:**

```json
{
  "status": "scheduled",
  "preferredDate": "2024-05-15T09:00:00Z",
  "preferredTime": "09:00 AM",
  "notes": "Initial assessment call",
  "followUpDate": "2024-05-22T09:00:00Z"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Consultation updated",
  "consultation": {
    /* updated consultation object */
  }
}
```

---

#### Get Consultation Statistics (Admin)

- **URL:** `/consultation/stats`
- **Method:** `GET`
- **Auth:** Required

**Success Response (200):**

```json
{
  "success": true,
  "stats": {
    "totalRequests": 32,
    "pending": 8,
    "scheduled": 15,
    "completed": 9
  }
}
```

---

### 3. Authentication Endpoints

#### Admin Login

- **URL:** `/auth/login`
- **Method:** `POST`
- **Auth:** No

**Request Body:**

```json
{
  "username": "admin",
  "password": "your-password"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "username": "admin",
    "role": "admin"
  }
}
```

**Error Response (401):**

```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

### 4. Health Check

#### Server Status

- **URL:** `/health`
- **Method:** `GET`
- **Auth:** No

**Success Response (200):**

```json
{
  "success": true,
  "message": "Server is running"
}
```

---

## HTTP Status Codes

| Code | Meaning                                 |
| ---- | --------------------------------------- |
| 200  | OK - Success                            |
| 201  | Created - Resource created successfully |
| 400  | Bad Request - Invalid input             |
| 401  | Unauthorized - Authentication required  |
| 404  | Not Found - Resource not found          |
| 500  | Internal Server Error                   |

---

## Error Handling

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error (only in development mode)"
}
```

---

## Request Examples Using cURL

### Submit Contact Form

```bash
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "company": "ABC Corp",
    "phone": "+234 803 815 8668",
    "service": "strategy",
    "message": "We need strategic consulting"
  }'
```

### Admin Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

### Get Contacts with Token

```bash
curl -X GET http://localhost:5000/api/contact \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Request Examples Using JavaScript Fetch

### Submit Contact Form

```javascript
fetch("http://localhost:5000/api/contact", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    fullName: "John Doe",
    email: "john@example.com",
    company: "ABC Corp",
    phone: "+234 803 815 8668",
    service: "strategy",
    message: "We need strategic consulting",
  }),
})
  .then((response) => response.json())
  .then((data) => console.log(data));
```

### Admin Login

```javascript
fetch("http://localhost:5000/api/auth/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    username: "admin",
    password: "admin123",
  }),
})
  .then((response) => response.json())
  .then((data) => {
    if (data.success) {
      localStorage.setItem("token", data.token);
    }
  });
```

### Get Contacts with Authentication

```javascript
const token = localStorage.getItem("token");

fetch("http://localhost:5000/api/contact", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
})
  .then((response) => response.json())
  .then((data) => console.log(data));
```

---

## Rate Limiting

Currently no rate limiting is implemented. For production, add:

```javascript
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use(limiter);
```

---

## CORS

CORS is enabled for requests from `FRONTEND_URL` environment variable.

Allowed methods: GET, POST, PUT, DELETE, OPTIONS
Allowed headers: Content-Type, Authorization

---

## Validation Rules

### Contact Form

- `fullName`: Required, string
- `email`: Required, valid email format
- `company`: Optional, string
- `phone`: Optional, string
- `service`: Optional, one of: strategy, analytics, process, organization, digital, risk
- `message`: Required, string

### Consultation

- `name`: Required, string
- `email`: Required, valid email format
- `company`: Optional, string
- `service`: Optional, string

---

## Support

For API issues or questions:

- Check server logs
- Review this documentation
- Test endpoints with Postman
- Check browser console for client-side errors
