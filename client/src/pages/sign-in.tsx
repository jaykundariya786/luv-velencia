import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { setLoading, loginSuccess, loginFailure, logout } from '@/store/slices/authSlice';
import { useFirebaseAuth } from '@/hooks/use-firebase-auth';
import { useToast } from '@/hooks/use-toast';

export default function SignIn() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const { user, isLoading } = useAppSelector((state) => state.auth);
  const { signInWithGoogle } = useFirebaseAuth();

  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });

  const from = location.state?.from?.pathname || '/';

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Email Authentication Coming Soon",
      description: "Please use Google sign-in for now. Email authentication will be available soon."
    });
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      toast({
        title: "Signed in with Google",
        description: "Welcome to LUV VELENCIA!"
      });
    } catch (error) {
      console.error('Google sign-in error:', error);
    }
  };

  const handleAppleLogin = async () => {
    toast({
      title: "Apple Sign-In Coming Soon",
      description: "Apple authentication will be available in a future update."
    });
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center">
          <button onClick={() => navigate('/')} className="text-2xl font-light tracking-[0.2em] text-black">
            GUCCI
          </button>
        </div>

        {/* Title */}
        <div className="text-center">
          <h1 className="text-xl font-light uppercase tracking-wider text-black mb-8">
            SIGN IN OR CHECK OUT AS A GUEST
          </h1>
        </div>

        {/* Social Login Buttons */}
        <div className="space-y-4">
          <Button
            onClick={handleGoogleLogin}
            variant="outline"
            className="w-full h-12 border-2 border-gray-300 hover:bg-gray-50 text-sm font-medium"
            disabled={isLoading}
          >
            <div className="flex items-center justify-center gap-3">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              CONTINUE WITH GOOGLE
            </div>
          </Button>

          <Button
            onClick={handleAppleLogin}
            variant="outline"
            className="w-full h-12 border-2 border-gray-300 hover:bg-gray-50 text-sm font-medium"
            disabled={isLoading}
          >
            <div className="flex items-center justify-center gap-3">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              CONTINUE WITH APPLE
            </div>
          </Button>
        </div>

        {/* Divider */}
        <div className="text-center">
          <span className="text-sm text-gray-500 bg-white px-4">OR</span>
        </div>

        {/* Email Form */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-lg font-light uppercase tracking-wider text-black">
              CONTINUE WITH EMAIL
            </h2>
            <p className="text-sm text-gray-600 mt-4 leading-relaxed">
              If you already have a MY GUCCI account, you will be asked to sign in. If not, you can continue as a 
              guest and choose to register after checkout.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <Input
                type="text"
                placeholder="Full Name*"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="h-12 bg-gray-50 border-0 placeholder:text-gray-500"
                required
              />
            )}

            <Input
              type="email"
              placeholder="Email*"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="h-12 bg-gray-50 border-0 placeholder:text-gray-500"
              required
            />

            <Input
              type="password"
              placeholder="Password*"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="h-12 bg-gray-50 border-0 placeholder:text-gray-500"
              required
            />

            <Button
              type="submit"
              className="w-full bg-black text-white hover:bg-gray-800 h-12 uppercase tracking-wider text-sm font-medium"
              disabled={isLoading}
            >
              {isLoading ? 'LOADING...' : (isSignUp ? 'CREATE ACCOUNT' : 'PROCEED TO CHECKOUT')}
            </Button>
          </form>

          {/* Toggle Sign Up/Sign In */}
          <div className="text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-gray-600 hover:text-black underline"
              disabled={isLoading}
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}