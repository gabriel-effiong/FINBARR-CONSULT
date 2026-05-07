# Complete Setup Guide

## Step 1: Database Setup

### Option A: MongoDB Atlas (Cloud - Recommended)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new cluster (M0 is free)
4. In "Database Access", create a username and password
5. In "Network Access", add your IP address (or 0.0.0.0 for development)
6. Get your connection string: `mongodb+srv://username:password@cluster.mongodb.net/database-name`
7. Add this to `.env` as `MONGODB_URI`

### Option B: Local MongoDB

1. Download from https://www.mongodb.com/try/download/community
2. Install MongoDB
3. Use connection string: `mongodb://localhost:27017/finbarr-consult`

## Step 2: Email Configuration

### Gmail Setup

1. Go to https://myaccount.google.com/security
2. Enable "2-Step Verification"
3. Go to https://myaccount.google.com/apppasswords
4. Generate "App Password" for Mail
5. Copy the 16-character password
6. Add to `.env`:
   ```
   SMTP_USER=your-email@gmail.com
   SMTP_PASSWORD=xxxx xxxx xxxx xxxx
   ```

## Step 3: Backend Setup

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your configuration
# Add your MongoDB URI, Email credentials, etc.

# Start development server
npm run dev
```

The backend should now run on `http://localhost:5000`

## Step 4: Frontend Integration

### Update index.html

Find this line in your `index.html`:

```javascript
function initContactForm() {
```

Replace the form handling with:

```javascript
// Include the API integration script
<script src="api-integration.js"></script>;

// Replace initContactForm with:
function initContactForm() {
  // Change API_BASE_URL in api-integration.js first!
  initContactFormWithAPI();
}
```

### Update API_BASE_URL

In `api-integration.js`, change:

```javascript
const API_BASE_URL = "http://localhost:5000/api"; // For development
// Change to your production URL when deploying
```

## Step 5: Admin Dashboard

Place `backend/admin-dashboard.html` in a secure location or deploy it separately.

Access it at: `http://localhost:5000/admin-dashboard.html` (during development)

## Step 6: Test Everything

1. **Test Contact Form:**
   - Fill out the contact form on your website
   - Check if you receive notification
   - Check admin dashboard to see the submission

2. **Test Consultation Booking:**
   - Click "Get Consultation"
   - Fill and submit the form
   - Check admin dashboard

3. **Test Admin Dashboard:**
   - Go to admin dashboard
   - Login with credentials from `.env` (default: admin/admin123)
   - View contacts and consultations

## Troubleshooting

### Forms Not Submitting

- Check browser console (F12) for error messages
- Verify API_BASE_URL is correct
- Check if backend server is running
- Check CORS settings in backend

### Emails Not Sending

- Verify SMTP credentials are correct
- Check "Less secure apps" for Gmail
- Use app-specific password (not regular Gmail password)
- Check email configuration

### MongoDB Connection Error

- Verify MongoDB is running
- Check MongoDB URI in `.env`
- For MongoDB Atlas, check IP whitelist
- Test connection with: `mongo "your-connection-string"`

## Next Steps

1. ✅ Deploy backend to production (Vercel/Heroku)
2. ✅ Update frontend API_BASE_URL to production
3. ✅ Setup admin password (change from default)
4. ✅ Setup automated email notifications
5. ✅ Setup SSL certificate
6. ✅ Monitor submissions and respond promptly
