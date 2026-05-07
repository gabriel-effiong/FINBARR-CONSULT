# Finbarr Consult - Backend API

Complete backend API for the FINBARR CONSULT LIMITED website built with Node.js, Express, and MongoDB.

## Features

- ✅ Contact Form Submission & Management
- ✅ Consultation Request Scheduling
- ✅ Email Notifications (Admin & Client)
- ✅ Admin Dashboard API
- ✅ JWT Authentication
- ✅ Request Validation
- ✅ CORS Enabled
- ✅ Production Ready

## Installation

### 1. Clone/Download the backend folder

```bash
cd backend
npm install
```

### 2. Setup Environment Variables

Create a `.env` file in the root of the backend folder:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/finbarr-consult
# Or use MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/finbarr-consult

# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=https://finbarr-consult.vercel.app

# Email (Gmail SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
ADMIN_EMAIL=admin@finbarrconsult.com

# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123

# JWT
JWT_SECRET=your-super-secret-key-change-this
JWT_EXPIRE=7d
```

### 3. Start the Server

**Development:**

```bash
npm run dev
```

**Production:**

```bash
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Public Endpoints

#### Contact Form

- **POST** `/api/contact` - Submit contact form
  ```json
  {
    "fullName": "John Doe",
    "email": "john@example.com",
    "company": "ABC Corp",
    "phone": "+234 803 815 8668",
    "service": "strategy",
    "message": "We need help with..."
  }
  ```

#### Consultation Booking

- **POST** `/api/consultation` - Request consultation
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "company": "ABC Corp",
    "service": "strategy"
  }
  ```

#### Admin Login

- **POST** `/api/auth/login` - Get JWT token
  ```json
  {
    "username": "admin",
    "password": "admin123"
  }
  ```
  Response:
  ```json
  {
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "admin": { "username": "admin", "role": "admin" }
  }
  ```

### Admin Endpoints (Requires Authentication)

Add header: `Authorization: Bearer {token}`

#### Contact Management

- **GET** `/api/contact` - List all contacts (paginated)
- **GET** `/api/contact/stats` - Get contact statistics
- **GET** `/api/contact/:id` - Get single contact
- **PUT** `/api/contact/:id` - Update contact status/notes
- **DELETE** `/api/contact/:id` - Delete contact

#### Consultation Management

- **GET** `/api/consultation` - List all consultations
- **GET** `/api/consultation/stats` - Get consultation statistics
- **GET** `/api/consultation/:id` - Get single consultation
- **PUT** `/api/consultation/:id` - Update consultation status

### Health Check

- **GET** `/api/health` - Server status

## Database Models

### ContactForm

```javascript
{
  fullName: String (required),
  email: String (required),
  company: String,
  phone: String,
  service: String (enum),
  message: String (required),
  status: String (enum: 'new', 'read', 'replied'),
  adminNotes: String,
  isRead: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Consultation

```javascript
{
  name: String (required),
  email: String (required),
  company: String,
  service: String,
  preferredDate: Date,
  preferredTime: String,
  status: String (enum: 'pending', 'scheduled', 'completed', 'cancelled'),
  notes: String,
  followUpDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## Email Configuration

### Using Gmail

1. Enable 2-factor authentication on your Gmail account
2. Generate an "App Password" at https://myaccount.google.com/apppasswords
3. Use this app password in `.env` as `SMTP_PASSWORD`

### Using Other Email Services

Update the email config in `src/config/email.js`:

- SendGrid
- Mailgun
- AWS SES
- etc.

## Frontend Integration

Update your frontend `index.html` to send requests to the API:

```javascript
// Replace the form submission logic with API calls

// Contact Form
fetch("https://your-backend-url/api/contact", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(formData),
});

// Consultation Booking
fetch("https://your-backend-url/api/consultation", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(formData),
});
```

## Deployment

### Vercel (Recommended - Same Platform as Frontend)

1. Create a new project in Vercel
2. Connect your GitHub repository
3. Set environment variables in Vercel settings
4. Deploy

### Heroku

```bash
heroku login
heroku create your-app-name
heroku config:set MONGODB_URI=your_mongo_uri
heroku config:set SMTP_USER=your_email
# ... set other variables
git push heroku main
```

### DigitalOcean App Platform

Similar process - set environment variables and deploy

### AWS Lambda + API Gateway

Convert to serverless format or use AWS Elastic Beanstalk

## File Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js
│   │   └── email.js
│   ├── controllers/
│   │   ├── contactController.js
│   │   └── consultationController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── ContactForm.js
│   │   └── Consultation.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── contact.js
│   │   └── consultation.js
│   └── server.js
├── .env.example
├── .gitignore
└── package.json
```

## Security Recommendations

1. **Change default admin credentials** in production
2. **Use strong JWT_SECRET** (generate with: `require('crypto').randomBytes(32).toString('hex')`)
3. **Enable MongoDB authentication** and IP whitelisting
4. **Use HTTPS only** in production
5. **Implement rate limiting** for public endpoints
6. **Add input sanitization** for production
7. **Use environment variables** for all sensitive data
8. **Regular backups** of MongoDB database

## Common Issues

### "Cannot connect to MongoDB"

- Check MongoDB URI in `.env`
- Ensure MongoDB is running (local) or accessible (cloud)
- Check network access for MongoDB Atlas

### "Emails not sending"

- Verify SMTP credentials
- Check "Less secure apps" setting for Gmail
- Use app-specific password for Gmail
- Check email configuration in `src/config/email.js`

### CORS errors

- Verify `FRONTEND_URL` matches your frontend domain
- Check browser console for exact error message

## Next Steps

1. ✅ Update frontend to use API endpoints
2. ✅ Create admin dashboard UI
3. ✅ Set up MongoDB (local or Atlas)
4. ✅ Configure email service
5. ✅ Deploy backend
6. ✅ Test all endpoints

## Support

For issues or questions, contact: info@finbarrconsult.com

---

**FINBARR CONSULT LIMITED** - Strategic Business Consulting Solutions
