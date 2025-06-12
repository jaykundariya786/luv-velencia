
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, OAuthProvider, signOut, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Debug logging in development
console.log('Firebase Config Debug:', {
  apiKey: firebaseConfig.apiKey ? `${firebaseConfig.apiKey.substring(0, 10)}...` : 'MISSING',
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  fullConfig: firebaseConfig
});
console.log('Current domain:', window.location.hostname);
console.log('Current URL:', window.location.href);

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Configure auth settings
auth.useDeviceLanguage();

// Google Auth Provider with proper configuration
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
  hd: undefined // Allow any domain
});

// Add required scopes for Google
googleProvider.addScope('email');
googleProvider.addScope('profile');
googleProvider.addScope('openid');

// Apple Auth Provider with proper configuration
const appleProvider = new OAuthProvider('apple.com');
appleProvider.addScope('email');
appleProvider.addScope('name');

export const signInWithGoogle = async () => {
  try {
    console.log('Starting Google sign-in...');
    console.log('Auth domain check:', firebaseConfig.authDomain);
    console.log('Current origin:', window.location.origin);
    
    // Clear any existing auth state
    if (auth.currentUser) {
      await signOut(auth);
    }

    const result = await signInWithPopup(auth, googleProvider);
    console.log('Google sign-in successful:', {
      uid: result.user.uid,
      email: result.user.email,
      displayName: result.user.displayName
    });
    
    return result;
  } catch (error: any) {
    console.error('Google sign-in error details:', {
      code: error.code,
      message: error.message,
      email: error.email,
      credential: error.credential,
      customData: error.customData,
      stack: error.stack
    });

    // Handle specific error cases
    if (error.code === 'auth/popup-blocked') {
      throw new Error('Popup was blocked by browser. Please allow popups and try again.');
    } else if (error.code === 'auth/popup-closed-by-user') {
      throw new Error('Sign-in was cancelled.');
    } else if (error.code === 'auth/cancelled-popup-request') {
      throw new Error('Another sign-in request is already in progress.');
    } else if (error.code === 'auth/unauthorized-domain') {
      throw new Error('This domain is not authorized for Google sign-in. Please contact support.');
    } else if (error.code === 'auth/operation-not-allowed') {
      throw new Error('Google sign-in is not enabled. Please contact support.');
    } else {
      throw new Error(error.message || 'Google sign-in failed. Please try again.');
    }
  }
};

export const signInWithApple = async () => {
  try {
    console.log('Starting Apple sign-in...');
    
    // Clear any existing auth state
    if (auth.currentUser) {
      await signOut(auth);
    }

    const result = await signInWithPopup(auth, appleProvider);
    console.log('Apple sign-in successful:', {
      uid: result.user.uid,
      email: result.user.email,
      displayName: result.user.displayName
    });
    
    return result;
  } catch (error: any) {
    console.error('Apple sign-in error details:', {
      code: error.code,
      message: error.message,
      email: error.email,
      credential: error.credential
    });

    // Handle specific error cases
    if (error.code === 'auth/popup-blocked') {
      throw new Error('Popup was blocked by browser. Please allow popups and try again.');
    } else if (error.code === 'auth/popup-closed-by-user') {
      throw new Error('Sign-in was cancelled.');
    } else if (error.code === 'auth/cancelled-popup-request') {
      throw new Error('Another sign-in request is already in progress.');
    } else if (error.code === 'auth/unauthorized-domain') {
      throw new Error('This domain is not authorized for Apple sign-in. Please contact support.');
    } else if (error.code === 'auth/operation-not-allowed') {
      throw new Error('Apple sign-in is not enabled. Please contact support.');
    } else {
      throw new Error(error.message || 'Apple sign-in failed. Please try again.');
    }
  }
};

export const signOutUser = () => signOut(auth);
export { onAuthStateChanged };
