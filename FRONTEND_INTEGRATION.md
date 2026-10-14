# Frontend integration

`index.html` already sends the contact form to `POST /api/contact` and the consultation form to `POST /api/consultation`. `admin.html` logs in through `POST /api/auth/login` and loads submissions through the token-protected GET endpoints. No Supabase browser client is needed.

When Express serves the site (the default `npm start` setup), the pages and API share one origin and no frontend configuration is needed. For a separately hosted frontend, set this before the page's inline scripts in both `index.html` and `admin.html`:

```html
<script>window.FINBARR_API_BASE_URL = "https://your-api-host.example";</script>
```

Then add the frontend origin to the backend's comma-separated `FRONTEND_URL` setting. See [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for request details.