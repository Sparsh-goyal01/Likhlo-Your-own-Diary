# Likhlo - Your Own Diary 📔

A secure, cloud-based notes application built with Firebase and vanilla JavaScript. Create, edit, and manage your personal notes with real-time synchronization.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-ISC-green.svg)
![Firebase](https://img.shields.io/badge/Firebase-12.7.0-orange.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)

## ✨ Features

- 🔐 **Secure Authentication** - Firebase Authentication with email/password
- 📝 **Real-time Notes** - Create, edit, and delete notes instantly
- ☁️ **Cloud Sync** - Your notes are safely stored in Firestore
- 🎨 **Modern UI** - Beautiful, responsive design
- 🔒 **Security Rules** - Firestore security rules to protect your data
- 📱 **Mobile Friendly** - Works seamlessly on all devices
- 🚀 **Fast & Lightweight** - No heavy frameworks, pure JavaScript

## 🚀 Quick Start

### Prerequisites

- Node.js 18 or higher
- Firebase account
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Sparsh-goyal01/Likhlo-Your-own-Diary.git
cd Likhlo-Your-own-Diary
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure Firebase**

Create a `.env` file in the root directory:
```env
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
FIREBASE_MEASUREMENT_ID=your_measurement_id
```

4. **Build configuration**
```bash
npm run build
```

5. **Start the development server**
```bash
npm run dev
```

6. **Open your browser**
```
http://localhost:3000
```

## 📁 Project Structure

```
Likhlo-Your-own-Diary/
├── frontend/
│   ├── index.html          # Login page
│   ├── signup.html         # Registration page
│   ├── dashboard.html      # Main notes dashboard
│   ├── reset.html          # Password reset
│   ├── css/
│   │   └── style.css       # Styles
│   └── js/
│       ├── auth.js         # Authentication logic
│       ├── notes.js        # Notes management
│       ├── firebase-config.js  # Firebase initialization
│       └── utils.js        # Utility functions
├── backend/
│   ├── server.js           # Express server
│   └── routes/
│       └── health.routes.js # Health check endpoint
├── firebase/
│   ├── firebase-config.js  # Firebase config (duplicate)
│   ├── firestore.rules     # Security rules
│   └── firestore.indexes.json # Database indexes
├── public/
│   └── config.js           # Generated config (auto-built)
├── .env                    # Environment variables
├── .env.example            # Environment template
├── firebase.json           # Firebase config
├── vercel.json             # Vercel deployment config
├── package.json            # Node dependencies
└── README.md               # This file
```

## 🔥 Firebase Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add Project"
3. Enter project name: `Likhlo`
4. Enable Google Analytics (optional)

### 2. Enable Authentication

1. Go to Authentication → Sign-in method
2. Enable "Email/Password"
3. Save

### 3. Create Firestore Database

1. Go to Firestore Database
2. Click "Create database"
3. Choose production mode
4. Select location

### 4. Deploy Security Rules

```bash
firebase deploy --only firestore:rules
```

### 5. Get Firebase Config

1. Project Settings → General
2. Scroll to "Your apps"
3. Click Web app (</>) icon
4. Copy configuration values to `.env`

## 🌐 Deployment

### Firebase Hosting (Recommended)

```bash
npm run deploy:firebase
```

Your app will be live at: `https://your-project.web.app`

### Vercel

```bash
vercel --prod
```

### GitHub Pages

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed instructions.

## 🛠️ Development

### Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build configuration from environment variables
- `npm run deploy:firebase` - Deploy to Firebase Hosting

### Environment Variables

| Variable | Description |
|----------|-------------|
| `FIREBASE_API_KEY` | Firebase API key |
| `FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `FIREBASE_PROJECT_ID` | Firebase project ID |
| `FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID |
| `FIREBASE_APP_ID` | Firebase app ID |
| `FIREBASE_MEASUREMENT_ID` | Firebase measurement ID (optional) |
| `PORT` | Server port (default: 3000) |
| `NODE_ENV` | Environment (development/production) |
| `CLIENT_URL` | Frontend URL for CORS |

## 🔒 Security

- ✅ Firebase Authentication for user management
- ✅ Firestore Security Rules to protect user data
- ✅ Environment variables for sensitive configuration
- ✅ CORS configured for API security
- ✅ Input validation and sanitization
- ✅ HTTPS enforced in production

## 📝 Usage

### Creating a Note

1. Log in to your account
2. Click "New Note" button
3. Enter title and content
4. Click "Save"

### Editing a Note

1. Click on any note card
2. Modify title or content
3. Changes save automatically

### Deleting a Note

1. Click on a note
2. Click delete icon
3. Confirm deletion

## 🐛 Troubleshooting

### Firebase Connection Error
- Verify `.env` file has correct credentials
- Run `npm run build` to regenerate config
- Check Firebase project is active

### CORS Issues
- Update `CLIENT_URL` in `.env`
- Check allowed domains in Firebase Console

### Authentication Not Working
- Verify Email/Password is enabled in Firebase
- Clear browser cache and cookies
- Check browser console for errors

See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for more help.

## 📚 Documentation

- [Deployment Guide](DEPLOYMENT_GUIDE.md)
- [Troubleshooting](TROUBLESHOOTING.md)
- [Project Summary](PROJECT_SUMMARY.md)
- [Quick Start](QUICKSTART.md)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👤 Author

**Sparsh Goyal**
- GitHub: [@Sparsh-goyal01](https://github.com/Sparsh-goyal01)

## 🙏 Acknowledgments

- Firebase for backend infrastructure
- Google Fonts for typography
- The open-source community

## 📞 Support

For support, email sparshgoyalvlogs@example.com or open an issue on GitHub.

---

Made with ❤️ by Sparsh Goyal
