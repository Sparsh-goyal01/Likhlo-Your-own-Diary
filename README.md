# 📝 Likhlo - Cloud Notes Application

<div align="center">

![Likhlo Banner](https://img.shields.io/badge/Likhlo-Notes%20App-purple?style=for-the-badge)
[![Firebase](https://img.shields.io/badge/Firebase-12.7.0-orange?style=for-the-badge&logo=firebase)](https://firebase.google.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

**A modern, secure, and beautiful cloud-based notes application built with Firebase**

[Live Demo](#) • [Features](#features) • [Installation](#installation) • [Documentation](#documentation)

</div>

---

## ✨ Features

### 🔐 Authentication
- **Email/Password** - Traditional secure login
- **Google OAuth** - One-click sign-in with Google
- **Password Reset** - Easy password recovery via email

### 📱 Notes Management
- ✅ Create, Read, Update, Delete notes
- ✅ Real-time synchronization with Firebase
- ✅ Optimistic UI updates for instant feedback
- ✅ Search functionality
- ✅ Grid and List view toggle
- ✅ Automatic timestamps (created, updated)

### 🎨 User Interface
- ✅ Modern, clean design with purple gradient theme
- ✅ Glassmorphism effects
- ✅ Smooth animations and transitions
- ✅ Fully responsive (mobile, tablet, desktop)
- ✅ Beautiful notes-themed background patterns
- ✅ Professional footer with developer credits

### 🔒 Security
- ✅ Firestore security rules
- ✅ User authentication required
- ✅ Data isolation (users can only access their own notes)
- ✅ Secure password handling

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Firebase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/likhlo.git
   cd likhlo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password and Google)
   - Create a Firestore database
   - Copy your Firebase config

4. **Configure environment variables**
   - Copy `.env.example` to `.env`
   ```bash
   cp .env.example .env
   ```
   - Fill in your Firebase credentials in `.env`

5. **Deploy Firestore security rules**
   - Go to Firebase Console → Firestore → Rules
   - Copy content from `firebase/firestore.rules`
   - Paste and publish

6. **Run the application**
   ```bash
   npm start
   ```
   - Open http://localhost:3000 in your browser

---

## 🏗️ Project Structure

```
likhlo/
├── backend/
│   ├── server.js                 # Express server
│   └── routes/
│       └── health.routes.js      # Health check endpoints
├── frontend/
│   ├── index.html                # Login page
│   ├── signup.html               # Registration page
│   ├── dashboard.html            # Main dashboard
│   ├── reset.html                # Password reset
│   ├── css/
│   │   ├── style.css            # Main stylesheet
│   │   └── notes-background.png # Background pattern
│   └── js/
│       ├── auth.js               # Authentication logic
│       ├── notes.js              # Notes CRUD operations
│       ├── utils.js              # Utility functions
│       └── firebase-config.js    # Firebase initialization
├── firebase/
│   ├── firestore.rules           # Security rules
│   └── firestore.indexes.json    # Database indexes
├── .env.example                  # Environment variables template
├── .gitignore                    # Git ignore file
├── package.json                  # Dependencies
└── README.md                     # This file
```

---

## 🔧 Configuration

### Environment Variables

Create a `.env` file with:

```env
# Firebase Configuration
FIREBASE_API_KEY=your_api_key_here
FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
FIREBASE_MEASUREMENT_ID=your_measurement_id

# Server Configuration
PORT=3000
NODE_ENV=development
```

### Firebase Setup

1. **Enable Authentication Providers:**
   - Go to Authentication → Sign-in method
   - Enable Email/Password
   - Enable Google

2. **Deploy Firestore Rules:**
   ```bash
   firebase deploy --only firestore:rules
   ```

3. **Database Structure:**
   ```
   users/{userId}/notes/{noteId}
   ├── title: string
   ├── content: string
   ├── createdAt: timestamp
   └── updatedAt: timestamp
   ```

---

## 🎨 Screenshots

### Login Page
Beautiful authentication with Email/Password and Google OAuth

### Dashboard
Modern notes grid with search and view toggle

### Create/Edit Notes
Clean modal interface for note management

---

## 🛠️ Technologies Used

| Technology | Purpose |
|------------|---------|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript |
| **Backend** | Node.js, Express.js |
| **Database** | Firebase Firestore |
| **Authentication** | Firebase Auth |
| **Hosting** | Firebase Hosting (optional) |
| **Styling** | Custom CSS with CSS Variables |
| **Icons** | SVG Icons |

---

## 📚 Documentation

### Key Files

- **`frontend/js/auth.js`** - Handles all authentication logic
- **`frontend/js/notes.js`** - Manages notes CRUD operations
- **`firebase/firestore.rules`** - Database security rules
- **`backend/server.js`** - Express server configuration

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Server health check |
| `/api/health/firebase` | GET | Firebase connection status |

---

## 🚢 Deployment

### Deploy to Firebase Hosting

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**
   ```bash
   firebase login
   ```

3. **Initialize Firebase**
   ```bash
   firebase init hosting
   ```

4. **Deploy**
   ```bash
   firebase deploy
   ```

### Deploy to Vercel/Netlify

See `DEPLOYMENT.md` for detailed deployment instructions.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Developer

**Sparsh Goyal**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/sparshgoyal06)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-black?style=for-the-badge&logo=github)](https://github.com/YOUR_USERNAME)

---

## 🙏 Acknowledgments

- Firebase for the awesome backend platform
- Google Fonts for Inter font family
- The open-source community

---

## 📞 Support

If you have any questions or run into issues, please:
- Open an issue on GitHub
- Contact via [LinkedIn](https://www.linkedin.com/in/sparshgoyal06)

---

<div align="center">

**Made with ❤️ by Sparsh Goyal**

⭐ Star this repo if you find it helpful!

</div>
