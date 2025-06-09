import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, OAuthProvider, signOut, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyChtnbeqROM3ApgQGfmmBAS259rqloSQOc",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "brand-f7182.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "brand-f7182",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "brand-f7182.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "965093408272",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:965093408272:web:3a60ebfd5e33f7aeb7d495",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-PD6CWX49KS"
};

// Debug logging in development
if (import.meta.env.DEV) {
  console.log('Firebase Config:', {
    ...firebaseConfig,
    apiKey: firebaseConfig.apiKey ? '***' : 'MISSING'
  });
  console.log('Current domain:', window.location.hostname);
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
  hd: undefined // Allow any domain
});

// Add required scopes
googleProvider.addScope('email');
googleProvider.addScope('profile');

// Apple Auth Provider
const appleProvider = new OAuthProvider('apple.com');
appleProvider.addScope('email');
appleProvider.addScope('name');

export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
export const signInWithApple = () => signInWithPopup(auth, appleProvider);
export const signOutUser = () => signOut(auth);
export { onAuthStateChanged };