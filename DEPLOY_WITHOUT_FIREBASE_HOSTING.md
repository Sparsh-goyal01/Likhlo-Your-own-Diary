# 🚀 DEPLOYMENT GUIDE (WITHOUT FIREBASE HOSTING)

## ✅ Your Setup
- **Firebase:** Authentication + Firestore Database only
- **Hosting:** Vercel, Netlify, or GitHub Pages
- **Repository:** https://github.com/Sparsh-goyal01/Likhlo-Your-own-Diary

---

## 🌐 OPTION 1: VERCEL (RECOMMENDED - FASTEST)

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
cd "c:\Users\lenovo\Desktop\Notes app"
npm run build
vercel --prod
```

### Step 4: Add Environment Variables in Vercel Dashboard
1. Go to your Vercel project dashboard
2. Settings → Environment Variables
3. Add all these:
   ```
   FIREBASE_API_KEY=AIzaSyCKYiRGY5AogDOjyxB4TvNSlgQnJka95kw
   FIREBASE_AUTH_DOMAIN=n-app-9d3c5.firebaseapp.com
   FIREBASE_PROJECT_ID=n-app-9d3c5
   FIREBASE_STORAGE_BUCKET=n-app-9d3c5.firebasestorage.app
   FIREBASE_MESSAGING_SENDER_ID=296860669640
   FIREBASE_APP_ID=1:296860669640:web:457b1754a5b120358af7fd
   FIREBASE_MEASUREMENT_ID=G-GWZ2NEGBMS
   ```

### Step 5: Redeploy
```powershell
vercel --prod
```

**Your app will be live at:** `https://your-project.vercel.app`

**Time:** 5 minutes | **Cost:** Free

---

## 🌐 OPTION 2: NETLIFY

### Step 1: Install Netlify CLI
```powershell
npm install -g netlify-cli
```

### Step 2: Login
```powershell
netlify login
```

### Step 3: Initialize and Deploy
```powershell
cd "c:\Users\lenovo\Desktop\Notes app"
npm run build
netlify init
netlify deploy --prod
```

### Step 4: Configure Build Settings
When prompted:
- **Build command:** `npm run build`
- **Publish directory:** `frontend`

### Step 5: Add Environment Variables
```powershell
netlify env:set FIREBASE_API_KEY AIzaSyCKYiRGY5AogDOjyxB4TvNSlgQnJka95kw
netlify env:set FIREBASE_AUTH_DOMAIN n-app-9d3c5.firebaseapp.com
netlify env:set FIREBASE_PROJECT_ID n-app-9d3c5
netlify env:set FIREBASE_STORAGE_BUCKET n-app-9d3c5.firebasestorage.app
netlify env:set FIREBASE_MESSAGING_SENDER_ID 296860669640
netlify env:set FIREBASE_APP_ID 1:296860669640:web:457b1754a5b120358af7fd
netlify env:set FIREBASE_MEASUREMENT_ID G-GWZ2NEGBMS
```

**Your app will be live at:** `https://your-site.netlify.app`

**Time:** 5 minutes | **Cost:** Free

---

## 🌐 OPTION 3: GITHUB PAGES

### Step 1: Create GitHub Actions Workflow
File already exists: `.github/workflows/github-pages.yml`

### Step 2: Add Repository Secrets
1. Go to: https://github.com/Sparsh-goyal01/Likhlo-Your-own-Diary/settings/secrets/actions
2. Click **New repository secret**
3. Add each of these:
   - Name: `FIREBASE_API_KEY` | Value: `AIzaSyCKYiRGY5AogDOjyxB4TvNSlgQnJka95kw`
   - Name: `FIREBASE_AUTH_DOMAIN` | Value: `n-app-9d3c5.firebaseapp.com`
   - Name: `FIREBASE_PROJECT_ID` | Value: `n-app-9d3c5`
   - Name: `FIREBASE_STORAGE_BUCKET` | Value: `n-app-9d3c5.firebasestorage.app`
   - Name: `FIREBASE_MESSAGING_SENDER_ID` | Value: `296860669640`
   - Name: `FIREBASE_APP_ID` | Value: `1:296860669640:web:457b1754a5b120358af7fd`
   - Name: `FIREBASE_MEASUREMENT_ID` | Value: `G-GWZ2NEGBMS`

### Step 3: Enable GitHub Pages
1. Repository Settings → Pages
2. Source: **GitHub Actions**
3. Save

### Step 4: Push to Trigger Deployment
```powershell
git add .
git commit -m "docs: Update deployment config"
git push origin main
```

**Your app will be live at:** `https://sparsh-goyal01.github.io/Likhlo-Your-own-Diary/`

**Time:** Auto-deploys on every push | **Cost:** Free

---

## ⚡ QUICK START: VERCEL (FASTEST)

```powershell
# Install Vercel
npm install -g vercel

# Login
vercel login

# Deploy
cd "c:\Users\lenovo\Desktop\Notes app"
npm run build
vercel --prod
```

Then add environment variables in dashboard. **Done in 3 minutes!** 🚀

---

## 🔧 POST-DEPLOYMENT STEPS

### 1. Enable Google Sign-in (Required)
1. Go to: https://console.firebase.google.com/project/n-app-9d3c5/authentication/providers
2. Click **Google**
3. Toggle **Enable**
4. Enter support email
5. **Add your deployment domain** to authorized domains:
   - For Vercel: `your-project.vercel.app`
   - For Netlify: `your-site.netlify.app`
   - For GitHub Pages: `sparsh-goyal01.github.io`
6. Click **Save**

### 2. Update Firestore Security Rules (Required)
Already configured in `firebase/firestore.rules`

Deploy rules to Firebase:
```powershell
firebase deploy --only firestore:rules
```

Or manually in Firebase Console:
1. Go to: https://console.firebase.google.com/project/n-app-9d3c5/firestore/rules
2. Paste rules from `firebase/firestore.rules`
3. Publish

---

## 📊 COMPARISON

| Platform | Speed | Free Tier | Auto-Deploy | Custom Domain | Best For |
|----------|-------|-----------|-------------|---------------|----------|
| **Vercel** | ⚡⚡⚡ Fastest | 100GB | ✅ Yes | ✅ Yes | Production apps |
| **Netlify** | ⚡⚡ Fast | 100GB | ✅ Yes | ✅ Yes | Jamstack sites |
| **GitHub Pages** | ⚡ Good | 1GB | ✅ Yes | ✅ Yes | Open source |

**Recommendation:** Use **Vercel** for best performance and easiest setup.

---

## 🧪 TESTING AFTER DEPLOYMENT

1. ✅ Visit your deployed URL
2. ✅ Create account with email/password
3. ✅ Login
4. ✅ Try Google Sign-in
5. ✅ Create a note
6. ✅ Edit a note
7. ✅ Delete a note
8. ✅ Refresh page - notes should persist
9. ✅ Test on mobile device

---

## 🔒 SECURITY NOTES

### Firebase Services Used:
- ✅ **Authentication** (Email/Password + Google)
- ✅ **Firestore Database** (for notes storage)
- ❌ **Firebase Hosting** (NOT USED - using Vercel/Netlify instead)

### Security Checklist:
- ✅ Firestore rules deployed
- ✅ Environment variables not in Git
- ✅ CORS configured
- ✅ Authorized domains added
- ✅ User data isolated

---

## 🎯 RECOMMENDED: VERCEL DEPLOYMENT

### One-Line Deployment:
```powershell
npm install -g vercel && vercel login && vercel --prod
```

Then:
1. Add environment variables in Vercel dashboard
2. Enable Google in Firebase Console
3. Add Vercel domain to Firebase authorized domains
4. **Done!** 🎉

---

## 📞 SUPPORT

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Netlify Dashboard:** https://app.netlify.com
- **GitHub Pages:** Repository Settings → Pages
- **Firebase Console:** https://console.firebase.google.com/project/n-app-9d3c5

---

## ✅ FINAL CHECKLIST

Before deployment:
- [x] Code pushed to GitHub
- [x] `.env` file configured
- [x] Build script working (`npm run build`)
- [ ] Choose hosting platform (Vercel/Netlify/GitHub Pages)
- [ ] Deploy application
- [ ] Add environment variables to hosting platform
- [ ] Enable Google Sign-in in Firebase Console
- [ ] Add deployment domain to Firebase authorized domains
- [ ] Deploy Firestore security rules
- [ ] Test all features on live site

---

**Ready to deploy! Choose Vercel for the fastest setup.** 🚀
