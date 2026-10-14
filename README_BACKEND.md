# Express, Prisma, and Neon backend

This repository now uses an Express API and Prisma ORM with Neon PostgreSQL. The API saves the website's contact messages and consultation requests, sends optional Resend email notifications, and provides a JWT-protected admin dashboard.

## Local setup

1. Create a Neon PostgreSQL project. Copy its pooled connection string to `DATABASE_URL` and its direct connection string to `DIRECT_URL`.
2. Copy `.env.example` to `.env` if needed. Add the Neon URLs, a long random `JWT_SECRET`, and a unique `ADMIN_USERNAME` and `ADMIN_PASSWORD` to `.env`. Do not use the old sample admin credentials.
3. Install packages and generate Prisma Client:

   ```sh
   npm install
   npm run db:generate
   ```

4. Apply the included initial migration and start the server:

   ```sh
   npm run db:deploy
   npm start
   ```

5. Open `http://localhost:5000/` for the website or `http://localhost:5000/admin` for the dashboard. The API and database health check is `http://localhost:5000/api/health`.

For local schema development, use `npm run db:migrate -- --name describe-change`. Use `npm run db:deploy` to apply committed migrations in production.

## Environment variables

- `DATABASE_URL`: Neon pooled URL used by the application.
- `DIRECT_URL`: Neon direct URL used by Prisma migrations.
- `JWT_SECRET`: long, private signing secret (at least 32 characters).
- `ADMIN_USERNAME`, `ADMIN_PASSWORD`: dashboard credentials.
- `PORT`: server port (defaults to `5000`).
- `FRONTEND_URL`: optional comma-separated browser origins when hosting the frontend separately.
- `RESEND_API_KEY`, `FROM_EMAIL`, `ADMIN_EMAIL`: optional email notifications. Database writes still succeed when email is not configured or delivery fails.

Keep `.env` private. If the frontend is hosted on a separate domain, set `window.FINBARR_API_BASE_URL` to the API origin in both `index.html` and `admin.html`, and set that frontend origin in the API's `FRONTEND_URL`.

## Deployment

The Express app serves the website and API together. On a Node host, use `npm install`, run `npm run db:deploy` once the Neon environment variables are available, and set the start command to `npm start`. The existing Vercel API entry points wrap the same Express app; configure `DATABASE_URL`, `DIRECT_URL`, `JWT_SECRET`, and admin credentials in the Vercel project, then apply the migration before accepting submissions. Configure `FRONTEND_URL` only when the browser page and API have different origins.

Existing submissions in the previous Supabase project are not copied by this setup. Export and import them separately if you need those records in Neon.

## Admin access

The dashboard login is checked on the server. It receives an 8-hour JWT and sends it with admin-only list requests. Contact and consultation records are never returned without a valid token. Public form and login requests are validated, limited in size, and rate limited.