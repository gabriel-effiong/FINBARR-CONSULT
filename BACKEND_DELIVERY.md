# Backend delivery

The active backend is the root Express application in `server.js` and `src/`. It uses Prisma ORM with Neon PostgreSQL and includes contact and consultation submissions, optional Resend notifications, an admin JWT login, pagination, input validation, request limits, and database health reporting.

Database tables and the initial migration are in `prisma/`. The existing website forms and admin page are wired to the API. Follow [QUICK_START.md](QUICK_START.md) to configure Neon and start the app; see [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for the endpoint reference.