# Quick start

1. Create a Neon PostgreSQL database and copy its pooled URL and direct URL.
2. Add the settings below to `.env` (start from `.env.example`):

   ```env
   DATABASE_URL="your-pooled-neon-url"
   DIRECT_URL="your-direct-neon-url"
   JWT_SECRET="a-random-secret-at-least-32-characters-long"
   ADMIN_USERNAME="your-admin-name"
   ADMIN_PASSWORD="a-unique-strong-password"
   ```

3. Install, generate Prisma Client, and apply the schema migration:

   ```sh
   npm install
   npm run db:generate
   npm run db:deploy
   ```

4. Start the site and API:

   ```sh
   npm start
   ```

Open `http://localhost:5000/`, `http://localhost:5000/admin`, and `http://localhost:5000/api/health`.

Email notifications are optional. Add `RESEND_API_KEY`, `FROM_EMAIL`, and `ADMIN_EMAIL` to `.env` to enable them. For more detail, see [README_BACKEND.md](README_BACKEND.md).