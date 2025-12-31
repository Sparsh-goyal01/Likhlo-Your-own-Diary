# Configure Password Reset Email

## Issues Fixed in Code
✅ Added `actionCodeSettings` parameter to `sendPasswordResetEmail()`
✅ Added proper error handling for authorization issues
✅ Added logging for debugging

## Firebase Console Configuration Required

### Step 1: Add Authorized Domains
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **n-app-9d3c5**
3. Go to **Authentication** → **Settings** → **Authorized domains**
4. Add your domains:
   - `localhost` (for local development)
   - `n-app-9d3c5.firebaseapp.com` (your Firebase hosting domain)
   - Your custom domain if you have one (e.g., `your-app.vercel.app`)

### Step 2: Customize Email Templates (Optional but Recommended)
1. In Firebase Console, go to **Authentication** → **Templates**
2. Click on **Password reset** template
3. Customize:
   - **From name**: Likhlo
   - **Reply-to email**: Your support email
   - **Subject**: Reset your Likhlo password
   - **Email body**: Customize the message

### Step 3: Verify Email Provider is Enabled
1. Go to **Authentication** → **Sign-in method**
2. Make sure **Email/Password** is enabled
3. If not, click on it and toggle **Enable**

### Step 4: Check SMTP Settings (If Using Custom Domain)
If you're using a custom email domain:
1. Go to **Project Settings** → **Service accounts**
2. Verify that Firebase has permission to send emails

## Testing the Password Reset

1. Make sure your app is running on an authorized domain
2. Enter a valid registered email address
3. Click "Send Reset Link"
4. Check the email inbox (including spam folder)
5. Click the reset link in the email
6. You should be redirected back to your login page

## Common Issues & Solutions

### Issue: "unauthorized-continue-uri" error
**Solution**: Add your domain to Firebase authorized domains (see Step 1)

### Issue: Email not received
**Solutions**:
- Check spam/junk folder
- Verify the email address is registered in your app
- Check Firebase Console → Authentication → Users to verify the account exists
- Wait a few minutes (email delivery can be delayed)

### Issue: "auth/invalid-email" error
**Solution**: Ensure the email format is valid (contains @ and domain)

### Issue: "auth/user-not-found" error
**Solution**: The email address is not registered. User needs to sign up first.

## Local Development vs Production

### For Local Development (localhost):
- Domain: `http://localhost` or `http://127.0.0.1`
- Port doesn't matter (e.g., `http://localhost:3000`)
- Make sure `localhost` is in authorized domains

### For Production (Vercel/Firebase Hosting):
- Add your production URL to authorized domains
- Format: `your-app.vercel.app` (without http/https)
- Update the `actionCodeSettings.url` if needed

## Verify Configuration

After making changes, check browser console for errors:
- Open DevTools (F12)
- Click "Send Reset Link"
- Look for any error codes in console
- Common codes: `auth/unauthorized-continue-uri`, `auth/invalid-continue-uri`

## Current Configuration in Code

The code now uses:
```javascript
const actionCodeSettings = {
    url: window.location.origin + '/index.html',
    handleCodeInApp: false
};
```

This automatically uses your current domain + `/index.html` as the redirect URL after password reset.
