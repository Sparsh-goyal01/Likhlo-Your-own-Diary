# 🚀 DEPLOYMENT GUIDE - Likhlo Notes App

## 📋 Prerequisites

- Node.js 18+ installed
- Firebase account with project created
- Git installed
- GitHub account (for GitHub Pages/Vercel)

---

## 🔥 FIREBASE DEPLOYMENT (Recommended)

### Step 1: Install Firebase CLI
```powershell
npm install -g firebase-tools
```

### Step 2: Login to Firebase
```powershell
firebase login
```

### Step 3: Initialize Firebase (if not done)
```powershell
firebase init
```
Select:
- ✅ Hosting
- ✅ Firestore
- Choose existing project: `n-app-9d3c5`
- Public directory: `frontend`
- Single-page app: `Yes`

### Step 4: Update Environment Variables
Edit `.env` file with your Firebase credentials:
```env
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### Step 5: Build Configuration
```powershell
npm run build
```

### Step 6: Deploy to Firebase
```powershell
npm run deploy:firebase
```

### 🎉 Your app will be live at:
`https://your-project-id.web.app`

---

## 🌐 VERCEL DEPLOYMENT

### Step 1: Install Vercel CLI
```powershell
npm install -g vercel
```

### Step 2: Login to Vercel
```powershell
vercel login
```

### Step 3: Deploy
```powershell
vercel
```

### Step 4: Add Environment Variables in Vercel Dashboard
Go to: Project Settings → Environment Variables

Add:
- `FIREBASE_API_KEY`
- `FIREBASE_AUTH_DOMAIN`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_STORAGE_BUCKET`
- `FIREBASE_MESSAGING_SENDER_ID`
- `FIREBASE_APP_ID`
- `FIREBASE_MEASUREMENT_ID`

### Step 5: Redeploy
```powershell
vercel --prod
```

---

## 📦 GITHUB PAGES DEPLOYMENT

### Step 1: Create Production Build
```powershell
npm run build
```

### Step 2: Update GitHub Repository
```powershell
git add .
git commit -m "Production build ready"
git push origin main
```

### Step 3: Enable GitHub Pages
1. Go to Repository Settings
2. Pages → Source → `main` branch
3. Folder → `/frontend`
4. Save

### Step 4: Add Secrets for GitHub Actions
Repository Settings → Secrets → New secret

Add all Firebase environment variables as secrets.

### Step 5: Create GitHub Actions Workflow
Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Build config
        env:
          FIREBASE_API_KEY: ${{ secrets.FIREBASE_API_KEY }}
          FIREBASE_AUTH_DOMAIN: ${{ secrets.FIREBASE_AUTH_DOMAIN }}
          FIREBASE_PROJECT_ID: ${{ secrets.FIREBASE_PROJECT_ID }}
          FIREBASE_STORAGE_BUCKET: ${{ secrets.FIREBASE_STORAGE_BUCKET }}
          FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.FIREBASE_MESSAGING_SENDER_ID }}
          FIREBASE_APP_ID: ${{ secrets.FIREBASE_APP_ID }}
          FIREBASE_MEASUREMENT_ID: ${{ secrets.FIREBASE_MEASUREMENT_ID }}
        run: npm run build
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./frontend
```

---

## 🔒 SECURITY CHECKLIST

✅ Firebase Security Rules configured
✅ Environment variables not hardcoded
✅ `.env` file in `.gitignore`
✅ CORS properly configured
✅ HTTPS enabled on deployment

---

## 🛠️ TROUBLESHOOTING

### Firebase API Key Error
- Check `.env` file has correct values
- Run `npm run build` to regenerate config
- Clear browser cache

### CORS Issues
- Update `CLIENT_URL` in `.env`
- Check Firebase Security Rules
- Verify domain is authorized in Firebase Console

### Deployment Failed
- Check Node.js version (18+)
- Verify all dependencies installed: `npm install`
- Check Firebase project ID matches

---

## 📞 SUPPORT

- Firebase Console: https://console.firebase.google.com
- Vercel Dashboard: https://vercel.com/dashboard
- GitHub Pages: https://pages.github.com

---

## 🎯 POST-DEPLOYMENT

1. Test all features:
   - ✅ User Registration
   - ✅ User Login
   - ✅ Create Notes
   - ✅ Edit Notes
   - ✅ Delete Notes
   - ✅ Password Reset

2. Monitor Firebase:
   - Check Authentication logs
   - Monitor Firestore usage
   - Review Security Rules

3. Set up custom domain (optional):
   - Firebase: Project Settings → Hosting → Add custom domain
   - Vercel: Project Settings → Domains
   - GitHub: Repository Settings → Pages → Custom domain
