# Quick Start Guide - 5 Minute Setup

## What You Got

✅ Complete backend API for contact forms & consultation booking  
✅ MongoDB integration  
✅ Email notifications  
✅ Admin dashboard  
✅ Authentication system  
✅ Ready for production deployment

## Files Created

```
backend/
├── src/
│   ├── server.js (Main Express app)
│   ├── config/ (Database & Email config)
│   ├── models/ (ContactForm, Consultation)
│   ├── controllers/ (Business logic)
│   ├── routes/ (API endpoints)
│   └── middleware/ (Authentication)
├── admin-dashboard.html (Admin UI)
├── package.json
├── .env.example
├── README.md
├── SETUP_GUIDE.md
└── DEPLOYMENT.md

frontend/
├── api-integration.js (Frontend API client)
├── FRONTEND_INTEGRATION.md
└── API_DOCUMENTATION.md
```

## 5-Minute Setup

### 1. Install Dependencies (1 min)

```bash
cd backend
npm install
```

### 2. Setup Environment (2 min)

```bash
cp .env.example .env
```

Edit `.env` and add:

- Your MongoDB connection string (get free one at mongodb.com/cloud/atlas)
- Your Gmail credentials (or other email service)

### 3. Start Backend (1 min)

```bash
npm run dev
```

You should see:

```
✅ Server running on port 5000
📧 Frontend URL: https://finbarr-consult.vercel.app
🔐 Environment: development
```

### 4. Test It Works (1 min)

Open your browser and visit:

```
http://localhost:5000/api/health
```

Should see:

```json
{ "success": true, "message": "Server is running" }
```

## Next Steps

1. **Update Frontend** (5 min)
   - Add `<script src="api-integration.js"></script>` to your HTML
   - Change `API_BASE_URL` in `api-integration.js`
   - Replace form submission logic with `initContactFormWithAPI()`

2. **Access Admin Dashboard** (2 min)
   - Open `backend/admin-dashboard.html` in browser
   - Login with: `admin` / `admin123`
   - View all submissions

3. **Deploy Backend** (15 min)
   - Push to GitHub
   - Connect to Vercel or Heroku
   - Set environment variables
   - Deploy

4. **Update Production URL** (2 min)
   - Change `API_BASE_URL` in `api-integration.js` to production
   - Deploy frontend

## Testing Checklist

- [ ] Backend running on localhost:5000
- [ ] /api/health returns success
- [ ] Contact form submits (check browser console)
- [ ] Confirmation email received
- [ ] Admin dashboard accessible
- [ ] Admin can view submissions
- [ ] Can delete/update submissions

## Troubleshooting

### "Cannot find module"

```bash
npm install
```

### "MongoDB connection failed"

- Check MONGODB_URI in .env
- Ensure MongoDB is running or MongoDB Atlas URI is valid

### "Port 5000 already in use"

```bash
# Kill process using port 5000
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -i :5000
kill -9 <PID>
```

### "Emails not sending"

- Verify Gmail app password is 16 characters (with spaces)
- Check spam folder
- Enable "Less secure apps" in Gmail settings

## Environment Variables Reference

```env
# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db

# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=https://finbarr-consult.vercel.app

# Email
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=xxxx xxxx xxxx xxxx
ADMIN_EMAIL=admin@finbarrconsult.com

# Security
JWT_SECRET=your-secret-key-here
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

## API Endpoints

### Public

- `POST /api/contact` - Submit contact form
- `POST /api/consultation` - Request consultation
- `POST /api/auth/login` - Admin login
- `GET /api/health` - Health check

### Admin (Protected)

- `GET /api/contact` - List all contacts
- `GET /api/contact/:id` - Get contact details
- `PUT /api/contact/:id` - Update contact
- `DELETE /api/contact/:id` - Delete contact
- `GET /api/consultation` - List all consultations
- `GET /api/consultation/:id` - Get consultation details
- `PUT /api/consultation/:id` - Update consultation

## Useful Resources

- [MongoDB Atlas Setup](https://www.mongodb.com/cloud/atlas)
- [Gmail App Passwords](https://myaccount.google.com/apppasswords)
- [Vercel Deployment](https://vercel.com/docs)
- [Heroku Deployment](https://devcenter.heroku.com/)
- [Express.js Guide](https://expressjs.com/)

## Support Files

- **README.md** - Complete feature documentation
- **SETUP_GUIDE.md** - Detailed setup instructions
- **DEPLOYMENT.md** - Deployment guide for Vercel/Heroku
- **API_DOCUMENTATION.md** - Complete API reference
- **FRONTEND_INTEGRATION.md** - Frontend integration guide

## What Comes Next?

1. ✅ Test everything locally
2. ✅ Update frontend to use API
3. ✅ Configure email service
4. ✅ Set strong admin password
5. ✅ Deploy backend to production
6. ✅ Deploy frontend with updated API URL
7. ✅ Monitor submissions and respond
8. ✅ Setup automated backups
9. ✅ Add more features (payments, scheduling, etc.)

## Key Features Implemented

✅ Contact form with validation  
✅ Consultation booking system  
✅ Email notifications (admin & client)  
✅ Admin dashboard  
✅ JWT authentication  
✅ Request validation  
✅ Error handling  
✅ Database models  
✅ Production-ready code  
✅ Comprehensive documentation

## Security Notes

- Change default admin password immediately
- Use strong JWT secret in production
- Keep .env file secret (add to .gitignore)
- Enable HTTPS in production
- Regular database backups
- Monitor for suspicious activity

---

**You're all set! Happy consulting! 🎉**

Questions? Check the documentation files or contact support at info@finbarrconsult.com
