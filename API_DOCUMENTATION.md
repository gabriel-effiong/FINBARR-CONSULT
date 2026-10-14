# API reference

Base path: `/api`

## Health

`GET /api/health` checks the API and database connection.

## Contact messages

`POST /api/contact` accepts JSON:

```json
{
  "fullName": "Jane Doe",
  "email": "jane@example.com",
  "company": "Example Ltd",
  "phone": "+234 800 000 0000",
  "service": "Business consulting",
  "message": "How can you help us?"
}
```

`fullName`, `email`, and `message` are required. Returns `201` when saved.

`GET /api/contact?page=1&limit=20` returns paginated messages and requires `Authorization: Bearer <token>`.

## Consultations

`POST /api/consultation` accepts `name` and `email` (required), with optional `company` and `service`. Returns `201` when saved.

`GET /api/consultation?page=1&limit=20` returns paginated consultation requests and requires an admin bearer token.

## Admin login

`POST /api/auth/login` accepts:

```json
{ "username": "your-admin-name", "password": "your-admin-password" }
```

A successful response contains a JWT token. The dashboard stores it for the current browser session and includes it on admin list requests. Tokens expire after 8 hours.

## Errors and limits

Responses use `{ "success": false, "message": "..." }` for errors. Form submissions and login are limited to 10 requests per IP per 15 minutes; JSON request bodies are limited to 12 KB. See [README_BACKEND.md](README_BACKEND.md) for setup and deployment.