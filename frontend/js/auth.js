// Authentication Logic - Login & Signup
import { auth } from './firebase-config.js';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    sendPasswordResetEmail,
    updateProfile
} from 'https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js';
import { showError, showSuccess, setLoading, getFormData } from './utils.js';

// ===== EMAIL/PASSWORD LOGIN =====
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const loginBtn = document.getElementById('login-btn');
        const { email, password } = getFormData(loginForm);

        try {
            setLoading(loginBtn, true);
            console.log('Attempting login with email:', email);

            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log('Login successful! User:', userCredential.user.email);

            // Redirect to dashboard
            console.log('Redirecting to dashboard...');
            window.location.href = 'dashboard.html';
        } catch (error) {
            console.error('Login error:', error);
            console.error('Error code:', error.code);
            console.error('Error message:', error.message);

            let message = 'Login failed. Please try again.';

            if (error.code === 'auth/user-not-found') {
                message = 'No account found with this email. Please sign up first.';
            } else if (error.code === 'auth/wrong-password') {
                message = 'Incorrect password.';
            } else if (error.code === 'auth/invalid-email') {
                message = 'Invalid email address.';
            } else if (error.code === 'auth/user-disabled') {
                message = 'This account has been disabled.';
            } else if (error.code === 'auth/too-many-requests') {
                message = 'Too many failed attempts. Please try again later.';
            } else if (error.code === 'auth/invalid-credential') {
                message = 'Invalid email or password. Please check your credentials or sign up.';
            } else if (error.code === 'auth/network-request-failed') {
                message = 'Network error. Please check your internet connection.';
            }

            showError('error-message', message);
        } finally {
            setLoading(loginBtn, false);
        }
    });
}

// ===== EMAIL/PASSWORD SIGNUP =====
const signupForm = document.getElementById('signup-form');
if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const signupBtn = document.getElementById('signup-btn');
        const { name, email, password } = getFormData(signupForm);
        const confirmPassword = document.getElementById('confirm-password').value;

        // Validate password match
        if (password !== confirmPassword) {
            showError('error-message', 'Passwords do not match.');
            return;
        }

        try {
            setLoading(signupBtn, true);
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            // Update user profile with name
            await updateProfile(userCredential.user, {
                displayName: name
            });

            // Redirect to dashboard
            window.location.href = 'dashboard.html';
        } catch (error) {
            console.error('Signup error:', error);
            let message = 'Signup failed. Please try again.';

            if (error.code === 'auth/email-already-in-use') {
                message = 'An account with this email already exists.';
            } else if (error.code === 'auth/invalid-email') {
                message = 'Invalid email address.';
            } else if (error.code === 'auth/weak-password') {
                message = 'Password should be at least 6 characters.';
            }

            showError('error-message', message);
        } finally {
            setLoading(signupBtn, false);
        }
    });
}

// ===== GOOGLE OAUTH LOGIN =====
const googleLoginBtn = document.getElementById('google-login');
const googleSignupBtn = document.getElementById('google-signup');

async function handleGoogleAuth() {
    const provider = new GoogleAuthProvider();

    try {
        await signInWithPopup(auth, provider);
        window.location.href = 'dashboard.html';
    } catch (error) {
        console.error('Google auth error:', error);
        let message = 'Google sign-in failed. Please try again.';

        if (error.code === 'auth/popup-closed-by-user') {
            message = 'Sign-in cancelled.';
        } else if (error.code === 'auth/account-exists-with-different-credential') {
            message = 'An account already exists with this email.';
        }

        showError('error-message', message);
    }
}

if (googleLoginBtn) {
    googleLoginBtn.addEventListener('click', handleGoogleAuth);
}

if (googleSignupBtn) {
    googleSignupBtn.addEventListener('click', handleGoogleAuth);
}


// ===== PASSWORD RESET =====
const resetForm = document.getElementById('reset-form');
if (resetForm) {
    resetForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const resetBtn = document.getElementById('reset-btn');
        const { email } = getFormData(resetForm);

        try {
            setLoading(resetBtn, true);
            await sendPasswordResetEmail(auth, email);

            // Show success modal
            const modal = document.getElementById('success-modal');
            if (modal) {
                modal.style.display = 'flex';
            }

            resetForm.reset();
        } catch (error) {
            console.error('Password reset error:', error);
            let message = 'Failed to send reset email. Please try again.';

            if (error.code === 'auth/user-not-found') {
                message = 'No account found with this email.';
            } else if (error.code === 'auth/invalid-email') {
                message = 'Invalid email address.';
            }

            showError('error-message', message);
        } finally {
            setLoading(resetBtn, false);
        }
    });
}

// ===== PASSWORD VISIBILITY TOGGLE =====
document.querySelectorAll('.toggle-password').forEach(button => {
    button.addEventListener('click', () => {
        const input = button.parentElement.querySelector('input');
        const type = input.getAttribute('type');
        input.setAttribute('type', type === 'password' ? 'text' : 'password');
    });
});

// ===== CHECK AUTH STATUS =====
// Redirect to dashboard if already logged in (for login/signup pages)
const publicPages = ['index.html', 'signup.html', 'reset.html', '/', ''];
const currentPage = window.location.pathname.split('/').pop();

auth.onAuthStateChanged((user) => {
    if (user && publicPages.includes(currentPage)) {
        window.location.href = 'dashboard.html';
    }
});
