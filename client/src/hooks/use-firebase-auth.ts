import { useEffect } from 'react';
import { User } from 'firebase/auth';
import { useAppDispatch } from './redux';
import { auth, onAuthStateChanged, signInWithGoogle, signInWithApple, signOutUser } from '@/lib/firebase';
import { loginSuccess, logout, setLoading } from '@/store/slices/authSlice';
import { useToast } from '@/hooks/use-toast';

export const useFirebaseAuth = () => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  useEffect(() => {
    dispatch(setLoading(true));
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
      if (firebaseUser) {
        try {
          // Get Firebase ID token
          const idToken = await firebaseUser.getIdToken();
          
          // Send Firebase user data to backend to sync/create user
          const response = await fetch('/api/auth/firebase-login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              firebaseUID: firebaseUser.uid,
              email: firebaseUser.email,
              name: firebaseUser.displayName || firebaseUser.email?.split('@')[0],
              photoURL: firebaseUser.photoURL,
              idToken: idToken
            })
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error('Backend sync error:', response.status, errorText);
            throw new Error(`Failed to sync user with backend: ${response.status}`);
          }

          const backendUser = await response.json();
          console.log('User synced with backend:', backendUser);

          // Update Redux with backend user data
          dispatch(loginSuccess({
            id: backendUser.id,
            email: backendUser.email,
            name: backendUser.name,
            provider: backendUser.provider || 'google',
            token: idToken
          }));
          
        } catch (error) {
          console.error('Error syncing user with backend:', error);
          // Handle error gracefully - user is still authenticated with Firebase
          // but backend sync failed
        }
      } else {
        dispatch(logout());
      }
      dispatch(setLoading(false));
    });

    return () => unsubscribe();
  }, [dispatch]);

  const handleGoogleSignIn = async () => {
    try {
      dispatch(setLoading(true));
      console.log('Starting Google sign-in...');
      const result = await signInWithGoogle();
      console.log('Google sign-in successful:', result);
      // Auth state change will be handled by the listener above
    } catch (error: any) {
      dispatch(setLoading(false));
      console.error('Google sign in error:', error);
      
      let errorMessage = "Failed to sign in with Google. Please try again.";
      
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = "Sign-in was cancelled.";
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = "Popup was blocked. Please allow popups and try again.";
      } else if (error.code === 'auth/cancelled-popup-request') {
        errorMessage = "Another sign-in popup is already open.";
      } else if (error.code === 'auth/unauthorized-domain') {
        errorMessage = "This domain is not authorized for Google sign-in. Please contact support.";
        console.error('Unauthorized domain. Current domain:', window.location.hostname);
        console.error('Add this domain to Firebase Console: Authentication > Settings > Authorized domains');
      }
      
      toast({
        title: "Sign In Failed",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const handleAppleSignIn = async () => {
    try {
      dispatch(setLoading(true));
      console.log('Starting Apple sign-in...');
      const result = await signInWithApple();
      console.log('Apple sign-in successful:', result);
      // Auth state change will be handled by the listener above
    } catch (error: any) {
      dispatch(setLoading(false));
      console.error('Apple sign in error:', error);
      
      let errorMessage = "Failed to sign in with Apple. Please try again.";
      
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = "Sign-in was cancelled.";
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = "Popup was blocked. Please allow popups and try again.";
      } else if (error.code === 'auth/cancelled-popup-request') {
        errorMessage = "Another sign-in popup is already open.";
      } else if (error.code === 'auth/unauthorized-domain') {
        errorMessage = "This domain is not authorized for Apple sign-in. Please contact support.";
        console.error('Unauthorized domain. Current domain:', window.location.hostname);
      }
      
      toast({
        title: "Apple Sign In Failed",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
      // Auth state change will be handled by the listener above
      toast({
        title: "Signed Out",
        description: "You have been signed out successfully."
      });
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        title: "Sign Out Failed",
        description: "Failed to sign out. Please try again.",
        variant: "destructive"
      });
    }
  };

  return {
    signInWithGoogle: handleGoogleSignIn,
    signInWithApple: handleAppleSignIn,
    signOut: handleSignOut
  };
};