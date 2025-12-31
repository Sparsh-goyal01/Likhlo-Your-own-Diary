# Likhlo - Your Own Diary

A production-grade secure notes application built with Firebase and modern web technologies.

---

## 🏗️ Architecture

### Tech Stack

**Backend:**
- Node.js + Express
- Firebase Admin SDK
- JWT authentication
- Environment-based configuration

**Frontend:**
- Vanilla JavaScript (ES6+)
- HTML5 & CSS3
- Firebase SDK v12.7.0
- Responsive design with custom CSS

**Database & Auth:**
- Firebase Firestore (NoSQL)
- Firebase Authentication
- Real-time data synchronization
- Secure security rules

**Shared:**
- Environment variables for configuration
- Auto-generated Firebase config
- Centralized error handling

---

## 📁 Project Structure

```
Likhlo/
├── backend/
│   ├── routes/              # API route handlers
│   │   └── health.routes.js # Health check endpoint
│   └── server.js            # Express server setup
├── frontend/
│   ├── css/
│   │   └── style.css        # Global styles
│   ├── js/
│   │   ├── auth.js          # Authentication logic
│   │   ├── notes.js         # Notes CRUD operations
│   │   ├── firebase-config.js # Firebase initialization
│   │   └── utils.js         # Utility functions
│   ├── index.html           # Login page
│   ├── signup.html          # Registration page
│   ├── dashboard.html       # Notes dashboard
│   └── reset.html           # Password reset
├── firebase/
│   ├── firestore.rules      # Database security rules
│   └── firestore.indexes.json # Database indexes
├── public/
│   └── config.js            # Auto-generated Firebase config
├── .env                     # Environment variables
├── build-config.js          # Config builder script
└── package.json             # Dependencies and scripts
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0
- Firebase account (free tier works)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Sparsh-goyal01/Likhlo-Your-own-Diary.git
   cd Likhlo-Your-own-Diary
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Firebase project:**
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Create a new project
   - Enable Authentication → Email/Password
   - Enable Authentication → Google (optional)
   - Create Firestore Database

4. **Configure environment variables:**
   
   Create `.env` file in root directory:
   ```env
   FIREBASE_API_KEY=your_api_key_here
   FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
   FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   FIREBASE_APP_ID=your_app_id
   FIREBASE_MEASUREMENT_ID=your_measurement_id
   PORT=3000
   NODE_ENV=development
   CLIENT_URL=http://localhost:3000
   ```

5. **Build configuration:**
   ```bash
   npm run build
   ```

6. **Deploy Firestore security rules:**
   ```bash
   firebase deploy --only firestore:rules
   ```

### Running the Application

**Development mode:**
```bash
npm run dev
```

This will start the server on http://localhost:3000

**Production mode:**
```bash
npm start
```

**Run separately:**
```bash
# Backend only
cd backend
node server.js

# Build config
npm run build
```

---

## 👤 Demo Credentials

Create your own account through the signup page, or use these test steps:

1. Navigate to http://localhost:3000/signup.html
2. Fill in the registration form
3. Login with your credentials

**Google Sign-in:**
- Enable Google provider in Firebase Console
- Add `localhost` to authorized domains
- Click "Continue with Google" button

---

## 🔑 Features

### Core Modules

✅ **User Authentication**
- Email/Password registration and login
- Google OAuth integration
- Password reset via email
- JWT-based session management
- Secure password hashing (handled by Firebase)

✅ **Notes Management**
- Create notes with title and content
- Edit existing notes
- Delete notes with confirmation
- Real-time synchronization across devices
- Automatic save on edit
- Timestamp tracking (created/updated)

✅ **User Interface**
- Clean, modern design
- Responsive layout (mobile-friendly)
- Real-time updates
- Loading states and error handling
- Success/error notifications
- Password visibility toggle

✅ **Security**
- Firestore security rules
- User data isolation
- Environment variable protection
- CORS configuration
- Input validation
- XSS protection

---

## 📡 API Endpoints

### Health Check
- `GET /api/health` - Server health status

**Note:** This is primarily a client-side application. Most operations (auth, CRUD) are handled directly through Firebase SDK on the frontend.

---

## 🔥 Firebase Configuration

### Services Used

**Firebase Authentication:**
- Email/Password provider
- Google OAuth provider
- Password reset emails
- User management

**Firestore Database:**
- NoSQL document database
- Real-time synchronization
- Offline support
- Automatic indexing

### Security Rules

Located in `firebase/firestore.rules`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own notes
    match /users/{userId}/notes/{noteId} {
      allow read, write: if request.auth != null 
                         && request.auth.uid == userId;
    }
  }
}
```

**What this ensures:**
- Only authenticated users can access data
- Users can only see/edit their own notes
- No cross-user data access
- Prevents unauthorized modifications

---

## 🛡️ Security Features

- ✅ Firebase Authentication for user management
- ✅ Firestore Security Rules for data protection
- ✅ Environment variables for sensitive config
- ✅ CORS protection
- ✅ Input validation and sanitization
- ✅ Secure password handling (Firebase)
- ✅ JWT token management
- ✅ User data isolation

---

## 🔧 Development

### Build for Local Testing

```bash
# Generate config from environment
npm run build

# Start development server
npm run dev
```

### Available Scripts

```json
{
  "start": "node backend/server.js",
  "dev": "node --watch backend/server.js",
  "build": "node build-config.js"
}
```

### Code Quality

- Vanilla JavaScript for simplicity
- ES6+ features (async/await, modules)
- Modular file structure
- Consistent naming conventions
- Error handling on all operations
- Console logging for debugging

---

## 📊 Database Schema

### Collections Structure

```
users/{userId}/
  └── notes/{noteId}
      ├── title: string
      ├── content: string
      ├── createdAt: timestamp
      ├── updatedAt: timestamp
      └── userId: string
```

### Data Flow

1. User authenticates via Firebase Auth
2. Frontend gets user ID from auth state
3. All notes stored in `/users/{userId}/notes/` collection
4. Security rules enforce user isolation
5. Real-time listeners update UI automatically

---

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## 📝 Notes

- All Firebase operations use modular SDK (v9+)
- CDN imports for Firebase modules (no build step needed)
- SQLite is NOT used - everything is in Firestore
- Works offline with Firebase's built-in caching
- Auto-generates config from `.env` for security

---

## 🚧 Future Enhancements

- [ ] Note categories and tags
- [ ] Rich text editor (Markdown support)
- [ ] Dark mode toggle
- [ ] Note sharing functionality
- [ ] Export notes (PDF, TXT, JSON)
- [ ] Note search and filtering
- [ ] Note archiving
- [ ] Trash/recycle bin
- [ ] Note templates
- [ ] Collaboration features
- [ ] Email notifications
- [ ] Multi-language support
- [ ] Voice-to-text notes
- [ ] File attachments
- [ ] Note versioning/history

---

Built with ❤️ by Sparsh Goyal
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
