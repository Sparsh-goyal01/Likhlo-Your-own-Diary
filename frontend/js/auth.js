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
        
        // Get form values directly
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        
        const email = emailInput ? emailInput.value.trim() : '';
        const password = passwordInput ? passwordInput.value.trim() : '';

        // Validate required fields
        if (!email || !password) {
            showError('error-message', 'Please enter both email and password.');
            return;
        }

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
        
        // Get form values directly to avoid undefined issues
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirm-password');
        
        const name = nameInput ? nameInput.value.trim() : '';
        const email = emailInput ? emailInput.value.trim() : '';
        const password = passwordInput ? passwordInput.value.trim() : '';
        const confirmPassword = confirmPasswordInput ? confirmPasswordInput.value.trim() : '';

        // Validate required fields
        if (!email || !password || !confirmPassword) {
            showError('error-message', 'Please fill in all required fields.');
            return;
        }

        // Validate password match
        if (password !== confirmPassword) {
            showError('error-message', 'Passwords do not match.');
            return;
        }

        // Validate password length
        if (password.length < 6) {
            showError('error-message', 'Password must be at least 6 characters.');
            return;
        }

        try {
            setLoading(signupBtn, true);
            console.log('Creating account for:', email);
            
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            
            console.log('Account created successfully!');

            // Update user profile with name
            if (name) {
                await updateProfile(userCredential.user, {
                    displayName: name
                });
                console.log('Profile updated with name:', name);
            }

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

async function handleGoogleAuth(buttonElement) {
    const provider = new GoogleAuthProvider();
    
    // Add custom parameters for better UX
    provider.setCustomParameters({
        prompt: 'select_account'
    });

    try {
        if (buttonElement) {
            setLoading(buttonElement, true, 'Signing in with Google...');
        }

        console.log('Initiating Google Sign-in...');
        const result = await signInWithPopup(auth, provider);
        
        console.log('Google Sign-in successful!', result.user.email);
        showSuccess('error-message', 'Signed in successfully! Redirecting...');
        
        // Redirect to dashboard
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 500);
        
    } catch (error) {
        console.error('Google auth error:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        
        let message = 'Google sign-in failed. Please try again.';

        if (error.code === 'auth/popup-closed-by-user') {
            message = 'Sign-in cancelled. Please try again.';
        } else if (error.code === 'auth/popup-blocked') {
            message = 'Popup was blocked. Please allow popups for this site.';
        } else if (error.code === 'auth/account-exists-with-different-credential') {
            message = 'An account already exists with this email using a different sign-in method.';
        } else if (error.code === 'auth/operation-not-allowed') {
            message = 'Google Sign-in is not enabled. Please contact support or enable it in Firebase Console.';
        } else if (error.code === 'auth/unauthorized-domain') {
            message = 'This domain is not authorized for Google Sign-in. Please add it to authorized domains in Firebase Console.';
        }

        showError('error-message', message);
        
        if (buttonElement) {
            setLoading(buttonElement, false);
        }
    }
}

if (googleLoginBtn) {
    googleLoginBtn.addEventListener('click', () => handleGoogleAuth(googleLoginBtn));
}

if (googleSignupBtn) {
    googleSignupBtn.addEventListener('click', () => handleGoogleAuth(googleSignupBtn));
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
            
            // Configure action code settings with proper URL
            const actionCodeSettings = {
                // URL to redirect back to after password reset
                url: window.location.origin + '/index.html',
                handleCodeInApp: false
            };

            await sendPasswordResetEmail(auth, email, actionCodeSettings);

            // Show success modal
            const modal = document.getElementById('success-modal');
            if (modal) {
                modal.style.display = 'flex';
            }

            resetForm.reset();
        } catch (error) {
            console.error('Password reset error:', error);
            console.error('Error code:', error.code);
            console.error('Error message:', error.message);
            
            let message = 'Failed to send reset email. Please try again.';

            if (error.code === 'auth/user-not-found') {
                message = 'No account found with this email.';
            } else if (error.code === 'auth/invalid-email') {
                message = 'Invalid email address.';
            } else if (error.code === 'auth/missing-continue-uri') {
                message = 'Configuration error. Please contact support.';
            } else if (error.code === 'auth/invalid-continue-uri') {
                message = 'Configuration error. Please contact support.';
            } else if (error.code === 'auth/unauthorized-continue-uri') {
                message = 'This domain is not authorized. Please add it to Firebase authorized domains.';
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
