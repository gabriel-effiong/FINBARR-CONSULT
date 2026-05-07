# Frontend Integration Guide

## Quick Start

### Step 1: Include the API Integration Script

Add this line to your `index.html` before the closing `</body>` tag:

```html
<script src="api-integration.js"></script>
```

### Step 2: Update the API Base URL

In `api-integration.js`, change:

```javascript
const API_BASE_URL = "http://localhost:5000/api"; // Development
// or
const API_BASE_URL = "https://your-backend-url.com/api"; // Production
```

### Step 3: Update Form Submission

Replace the existing form handlers with API calls:

```javascript
// In your DOMContentLoaded function, replace:
// initContactForm();

// With:
initContactFormWithAPI();
```

## Complete Example

Here's how to update your `index.html` to use the backend:

### Original Code (Before)

```javascript
function initContactForm() {
  const contactForm = document.getElementById("contactForm");
  const consultationForm = document.getElementById("consultationForm");

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      showNotification(
        "Thank you for your message! We will contact you soon.",
        "success",
      );
      this.reset();
    });
  }
  // ... etc
}
```

### Updated Code (After)

```javascript
function initContactForm() {
  initContactFormWithAPI(); // Use API integration
}
```

## Testing

### Local Testing

1. Start backend:

```bash
cd backend
npm run dev
```

2. Open `index.html` in browser

3. Test forms:
   - Fill contact form and submit
   - Check browser console for any errors
   - Check admin dashboard for submission

### Production Testing

1. Update `API_BASE_URL` to production URL
2. Deploy frontend to Vercel
3. Test all forms
4. Monitor server logs

## API Response Examples

### Successful Contact Submission

```json
{
  "success": true,
  "message": "Thank you for your message! We will contact you soon!",
  "contactId": "507f1f77bcf86cd799439011"
}
```

### Successful Consultation Request

```json
{
  "success": true,
  "message": "Consultation scheduled! We will contact you to confirm.",
  "consultationId": "507f1f77bcf86cd799439012"
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error message here",
  "errors": [
    {
      "msg": "Full name is required",
      "param": "fullName"
    }
  ]
}
```

## Troubleshooting

### Forms Not Submitting

**Problem:** Form submits but nothing happens

**Solutions:**

1. Check browser console (F12) for errors
2. Verify API_BASE_URL is correct
3. Ensure backend is running: `curl http://localhost:5000/api/health`
4. Check for CORS errors in console

### Emails Not Sending

**Problem:** Forms submit but no email received

**Solutions:**

1. Check backend server logs
2. Verify SMTP credentials in `.env`
3. Check email junk folder
4. Try different email service

### Admin Dashboard Not Loading

**Problem:** Can't access admin dashboard

**Solutions:**

1. Deploy admin-dashboard.html to backend server
2. Update API_BASE_URL in the dashboard HTML
3. Check authentication token in localStorage

## Advanced Customization

### Custom Form Validation

```javascript
// Add before form submission
const validateForm = (formData) => {
  if (!formData.fullName) throw new Error("Name required");
  if (!formData.email) throw new Error("Email required");
  return true;
};
```

### Custom Notifications

```javascript
// Override notification styling
function showNotification(message, type = "info") {
  // Your custom notification logic
}
```

### Custom Success Handling

```javascript
// After successful submission
submitContactForm(formData).then((success) => {
  if (success) {
    // Redirect user
    window.location.href = "/thank-you.html";
  }
});
```

## Data Handling

### What Data is Stored?

**Contact Form Data:**

- Full Name
- Email
- Company
- Phone
- Service Interest
- Message
- Timestamp
- Read Status

**Consultation Data:**

- Name
- Email
- Company
- Service Interest
- Timestamp
- Status (pending/scheduled/completed)

### GDPR Compliance

1. Add privacy policy link
2. Get explicit consent before storing data
3. Allow users to request data deletion
4. Implement data retention policies

```html
<!-- Add to forms -->
<input type="checkbox" required /> I agree to the privacy policy
```

## Performance Tips

1. **Minimize API Calls:**
   - Batch requests where possible
   - Cache API responses

2. **Error Handling:**
   - Show user-friendly error messages
   - Log errors for debugging

3. **Loading States:**
   - Show loading spinner during submission
   - Disable button to prevent duplicate submissions

## Support

For issues or questions:

- Check browser console for error messages
- Review backend logs
- Test with Postman/Insomnia
- Check documentation
