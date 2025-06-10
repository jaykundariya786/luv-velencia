
import { auth, signInWithGoogle, signInWithApple, signOutUser, onAuthStateChanged } from '@/lib/firebase';
import { User } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { useAppDispatch } from './redux';
import { setUser, clearUser } from '@/store/slices/authSlice';

export const useFirebaseAuth = () => {
  const [user, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();

  // Function to register/update user in backend
  const registerUserInBackend = async (firebaseUser: User) => {
    try {
      const idToken = await firebaseUser.getIdToken();

      const response = await fetch('/api/auth/firebase-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firebaseUID: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          idToken,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to register user in backend');
      }

      const userData = await response.json();
      console.log('User registered/updated in backend:', userData);
      return userData;
    } catch (error) {
      console.error('Error registering user in backend:', error);
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed:', user ? `User: ${user.email}` : 'No user');
      setCurrentUser(user);
      
      if (user) {
        try {
          // Register/update user in backend database
          await registerUserInBackend(user);

          dispatch(setUser({
            id: user.uid,
            email: user.email || '',
            name: user.displayName || '',
            provider: 'google',
            firebaseUID: user.uid,
            photoURL: user.photoURL || '',
          }));
        } catch (error) {
          console.error('Error handling user authentication:', error);
        }
      } else {
        dispatch(clearUser());
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [dispatch]);

  const signInGoogle = async () => {
    try {
      console.log('Initiating Google sign-in...');
      setLoading(true);
      const result = await signInWithGoogle();
      console.log('Google sign-in hook completed successfully');
      // User registration will be handled automatically by onAuthStateChanged
      return result;
    } catch (error: any) {
      console.error('Google sign-in hook error:', error);
      setLoading(false);
      throw error;
    }
  };

  const signInApple = async () => {
    try {
      console.log('Initiating Apple sign-in...');
      setLoading(true);
      const result = await signInWithApple();
      console.log('Apple sign-in hook completed successfully');
      // User registration will be handled automatically by onAuthStateChanged
      return result;
    } catch (error: any) {
      console.error('Apple sign-in hook error:', error);
      setLoading(false);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await signOutUser();
      dispatch(clearUser());
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  return {
    user,
    loading,
    signInGoogle,
    signInApple,
    signOut,
  };
};
