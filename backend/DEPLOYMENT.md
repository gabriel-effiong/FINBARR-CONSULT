# Deployment Guide

## Option 1: Deploy to Vercel (Recommended - Same as Frontend)

### Prerequisites

- GitHub account
- Vercel account
- Backend code in a Git repository

### Steps

1. **Create a new GitHub repository for your backend**

   ```bash
   cd backend
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/finbarr-backend.git
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to https://vercel.com
   - Click "New Project"
   - Select your GitHub repository
   - Choose "Other" as the framework
   - Set Build Command: `npm install`
   - Set Start Command: `npm start`
   - Set Output Directory: (leave empty)

3. **Add Environment Variables in Vercel**
   - Go to project Settings → Environment Variables
   - Add all variables from your `.env` file:
     - MONGODB_URI
     - SMTP_USER
     - SMTP_PASSWORD
     - ADMIN_EMAIL
     - etc.

4. **Deploy**
   - Click "Deploy"
   - Your backend will be available at `https://your-project.vercel.app`

5. **Update Frontend**
   - Update `API_BASE_URL` in `api-integration.js`:
     ```javascript
     const API_BASE_URL = "https://your-project.vercel.app/api";
     ```

## Option 2: Deploy to Heroku

### Prerequisites

-  

### Steps

1. **Install Heroku CLI**

   ```bash
   npm install -g heroku
   heroku login
   ```

2. **Create Heroku App**

   ```bash
   cd backend
   heroku create your-app-name
   ```

3. **Add MongoDB**

   ```bash
   heroku addons:create mongolab:sandbox
   ```

4. **Set Environment Variables**

   ```bash
   heroku config:set MONGODB_URI=your-atlas-uri
   heroku config:set SMTP_USER=your-email@gmail.com
   heroku config:set SMTP_PASSWORD=your-app-password
   heroku config:set ADMIN_EMAIL=admin@finbarrconsult.com
   heroku config:set JWT_SECRET=your-secret-key
   heroku config:set FRONTEND_URL=https://finbarr-consult.vercel.app
   ```

5. **Deploy**

   ```bash
   git push heroku main
   ```

6. **View Logs**
   ```bash
   heroku logs --tail
   ```

## Option 3: Deploy to DigitalOcean App Platform

### Steps

1. **Push code to GitHub**
   (Same as Vercel step 1)

2. **Connect DigitalOcean**
   - Go to DigitalOcean Dashboard
   - Click "Create" → "Apps"
   - Connect GitHub repository
   - Select your backend repo

3. **Configure**
   - Set start command: `npm start`
   - Set environment variables
   - Add MongoDB database

4. **Deploy**
   - Click "Create Resources"
   - Wait for deployment to complete

## Post-Deployment Checklist

- [ ] Test all API endpoints
- [ ] Verify CORS settings work with frontend
- [ ] Test contact form submissions
- [ ] Test consultation booking
- [ ] Test admin login
- [ ] Verify emails are sending
- [ ] Check admin dashboard functionality
- [ ] Monitor server logs for errors
- [ ] Setup automated backups for database
- [ ] Enable HTTPS/SSL
- [ ] Set up monitoring and alerts

## Environment Variables for Production

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/finbarr-consult
PORT=5000
FRONTEND_URL=https://finbarr-consult.vercel.app
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
ADMIN_EMAIL=admin@finbarrconsult.com
JWT_SECRET=generate-a-strong-secret-key-here
JWT_EXPIRE=7d
ADMIN_USERNAME=admin
ADMIN_PASSWORD=change-this-strong-password
```

## Generate Strong JWT Secret

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Monitoring

### Key Metrics to Monitor

- API response times
- Database query times
- Email delivery success rate
- Error rates
- Server uptime

### Recommended Tools

- LogRocket
- Sentry (error tracking)
- New Relic
- DataDog

## Security Checklist

- [ ] Change default admin password
- [ ] Use strong JWT secret
- [ ] Enable HTTPS only
- [ ] Configure CORS properly
- [ ] Add rate limiting
- [ ] Implement request validation
- [ ] Use environment variables for secrets
- [ ] Regular database backups
- [ ] Monitor for suspicious activity
- [ ] Update dependencies regularly
