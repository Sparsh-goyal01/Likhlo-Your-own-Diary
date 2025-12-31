// Firebase Configuration (Modular SDK v9+)
// This file initializes Firebase for the frontend

import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js';

// Firebase configuration object
// IMPORTANT: Replace these values with your actual Firebase project credentials
const firebaseConfig = {
    apiKey: "AIzaSyCKYiRGY5AogDOjyxB4TvNSlgQnJka95kw",
    authDomain: "n-app-9d3c5.firebaseapp.com",
    projectId: "n-app-9d3c5",
    storageBucket: "n-app-9d3c5.firebasestorage.app",
    messagingSenderId: "296860669640",
    appId: "1:296860669640:web:457b1754a5b120358af7fd",
    measurementId: "G-GWZ2NEGBMS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Firestore Database
export const db = getFirestore(app);

// Export app for other uses
export default app;
