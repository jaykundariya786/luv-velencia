
import { useState } from "react";
import * as React from "react";
import {
  CircleUserRound,
  Package,
  Settings,
  MapPin,
  CreditCard,
  Heart,
  Calendar,
  LogOut,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { RootState } from "@/store";
import { login, logout } from "@/store/slices/authSlice";
import { useToast } from "@/hooks/use-toast";
import { useFirebaseAuth } from "@/hooks/use-firebase-auth";

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AccountModal({ isOpen, onClose }: AccountModalProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, isLoading } = useAppSelector((state: RootState) => state.auth);
  const { toast } = useToast();
  const { signInGoogle, signInApple, signOut } = useFirebaseAuth();

  const [isSignUp, setIsSignUp] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isAppleLoading, setIsAppleLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    holderName: "",
    billingAddress: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const mockUser = {
        id: isSignUp ? Date.now().toString() : "1",
        email: formData.email,
        name: isSignUp ? formData.name : formData.email.split("@")[0],
        provider: "email" as const,
      };

      dispatch(login(mockUser));

      toast({
        title: isSignUp
          ? "Account created successfully"
          : "Signed in successfully",
        description: isSignUp ? "Welcome to LUV VELENCIA!" : "Welcome back!",
      });

      setFormData({ email: "", password: "", name: "" });
      onClose();
    } catch (error) {
      toast({
        variant: "destructive",
        title: isSignUp ? "Signup failed" : "Login failed",
        description: "Please try again.",
      });
    }
  };

  const handleGoogleLogin = async () => {
    if (isGoogleLoading || isAppleLoading) return;
    
    setIsGoogleLoading(true);
    try {
      console.log('Account modal: Starting Google login...');
      await signInGoogle();
      console.log('Account modal: Google login successful');
      toast({
        title: "Success",
        description: "Successfully signed in with Google!",
      });
      onClose();
    } catch (error: any) {
      console.error('Account modal: Google sign-in error:', error);
      toast({
        variant: "destructive",
        title: "Google Sign-in Failed",
        description: error.message || "Please try again or use a different sign-in method.",
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleAppleLogin = async () => {
    if (isAppleLoading || isGoogleLoading) return;
    
    setIsAppleLoading(true);
    try {
      console.log('Account modal: Starting Apple login...');
      await signInApple();
      console.log('Account modal: Apple login successful');
      toast({
        title: "Success",
        description: "Successfully signed in with Apple!",
      });
      onClose();
    } catch (error: any) {
      console.error('Account modal: Apple sign-in error:', error);
      toast({
        variant: "destructive",
        title: "Apple Sign-in Failed",
        description: error.message || "Please try again or use a different sign-in method.",
      });
    } finally {
      setIsAppleLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      dispatch(logout());
      navigate("/");
      onClose();
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        variant: "destructive",
        title: "Sign out failed",
        description: "Please try again.",
      });
    }
  };

  const handleNavigation = (path: string) => {
    onClose();
    setTimeout(() => navigate(path), 100);
  };

  const handleSavePayment = (e: React.FormEvent) => {
    e.preventDefault();

    toast({
      title: "Payment method added",
      description: "Your payment method has been saved successfully.",
    });

    setPaymentData({
      cardNumber: "",
      expiryMonth: "",
      expiryYear: "",
      cvv: "",
      holderName: "",
      billingAddress: "",
      city: "",
      state: "",
      zipCode: "",
      country: "United States",
    });
    setShowWalletModal(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-[400px] max-w-[90%] bg-white rounded-3xl overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="lv-luxury text-lg font-bold text-black">
              {user ? "MY ACCOUNT" : "SIGN IN"}
            </h2>
            <Button variant="ghost" size="sm" onClick={onClose} className="p-2">
              <X className="w-6 h-6" />
            </Button>
          </div>

          {user ? (
            // Logged in user menu
            <div className="space-y-1">
              <div
                onClick={() => handleNavigation("/account")}
                className="mb-6 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <CircleUserRound className="w-8 h-8" />
                  <div>
                    <p className="font-medium text-black">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleNavigation("/account/orders")}
                className="w-full flex items-center gap-3 p-3 text-left hover:bg-primary/10 rounded-xl lv-transition"
              >
                <Package className="w-4 h-4" />
                <span className="lv-body text-sm font-medium text-black">
                  MY ORDERS
                </span>
              </button>

              <button
                onClick={() => handleNavigation("/account/settings")}
                className="w-full flex items-center gap-3 p-3 text-left hover:bg-primary/10 rounded-xl lv-transition"
              >
                <Settings className="w-4 h-4" />
                <span className="lv-body text-sm font-medium text-black">
                  ACCOUNT SETTINGS
                </span>
              </button>

              <button
                onClick={() => handleNavigation("/account/addresses")}
                className="w-full flex items-center gap-3 p-3 text-left hover:bg-primary/10 rounded-xl lv-transition"
              >
                <MapPin className="w-4 h-4" />
                <span className="lv-body text-sm font-medium text-black">
                  ADDRESS BOOK
                </span>
              </button>

              <button
                onClick={() => handleNavigation("/account/wallet")}
                className="w-full flex items-center gap-3 p-3 text-left hover:bg-primary/10 rounded-xl lv-transition"
              >
                <CreditCard className="w-4 h-4" />
                <span className="lv-body text-sm font-medium text-black">
                  WALLET
                </span>
              </button>

              <button
                onClick={() => handleNavigation("/account/saved-items")}
                className="w-full flex items-center gap-3 p-3 text-left hover:bg-primary/10 rounded-xl lv-transition"
              >
                <Heart className="w-4 h-4" />
                <span className="lv-body text-sm font-medium text-black">
                  SAVED ITEMS
                </span>
              </button>

              <button
                onClick={() => handleNavigation("/book-appointment")}
                className="w-full flex items-center gap-3 p-3 text-left hover:bg-primary/10 rounded-xl lv-transition"
              >
                <Calendar className="w-4 h-4" />
                <span className="lv-body text-sm font-medium text-black">
                  MY APPOINTMENTS
                </span>
              </button>

              <div className="border-t border-gray-200 my-4"></div>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 p-3 text-left hover:bg-red-50 rounded-xl lv-transition"
              >
                <LogOut className="w-4 h-4" />
                <span className="lv-body text-sm font-medium text-black underline">
                  SIGN OUT
                </span>
              </button>
            </div>
          ) : (
            // Sign in form
            <div className="space-y-4">
              {/* Social Login Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handleGoogleLogin}
                  variant="outline"
                  className="w-full h-10 border-2 lv-luxury text-md rounded-full border-primary hover:bg-gray-50 text-xs font-medium"
                  disabled={isLoading || isGoogleLoading || isAppleLoading}
                >
                  <div className="flex items-center justify-center gap-2">
                    {isGoogleLoading ? (
                      <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-800 rounded-full animate-spin" />
                    ) : (
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                    )}
                    <span>{isGoogleLoading ? 'SIGNING IN...' : 'GOOGLE'}</span>
                  </div>
                </Button>
                
                <div className="flex items-center my-4">
                  <div className="flex-1 border-t border-gray-300"></div>
                  <span className="px-4 text-xs text-gray-500 bg-white">OR</span>
                  <div className="flex-1 border-t border-gray-300"></div>
                </div>
                
                <Button
                  onClick={handleAppleLogin}
                  variant="outline"
                  className="w-full h-10 border-2 lv-luxury text-md rounded-full border-primary hover:bg-gray-50 text-xs font-medium"
                  disabled={isLoading || isGoogleLoading || isAppleLoading}
                >
                  <div className="flex items-center justify-center gap-2">
                    {isAppleLoading ? (
                      <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-800 rounded-full animate-spin" />
                    ) : (
                      <svg
                        className="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                      </svg>
                    )}
                    <span>{isAppleLoading ? 'SIGNING IN...' : 'APPLE'}</span>
                  </div>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Wallet Modal */}
      {showWalletModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50">
          <div className="w-[600px] max-w-[95%] max-h-[90vh] bg-white rounded-3xl overflow-hidden">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="lv-luxury text-xl font-bold text-black uppercase tracking-wider">
                  NEW PAYMENT METHOD
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowWalletModal(false)}
                  className="p-2"
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>

              <form onSubmit={handleSavePayment} className="space-y-6">
                {/* Card Information */}
                <div className="space-y-4">
                  <div>
                    <Label className="text-xs font-medium text-gray-700 uppercase tracking-wider">
                      CARD NUMBER *
                    </Label>
                    <Input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={paymentData.cardNumber}
                      onChange={(e) =>
                        setPaymentData({
                          ...paymentData,
                          cardNumber: e.target.value,
                        })
                      }
                      className="mt-1 h-12 bg-gray-50 border-0 placeholder:text-gray-500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs font-medium text-gray-700 uppercase tracking-wider">
                        EXPIRY MONTH *
                      </Label>
                      <Select
                        value={paymentData.expiryMonth}
                        onValueChange={(value) =>
                          setPaymentData({ ...paymentData, expiryMonth: value })
                        }
                      >
                        <SelectTrigger className="mt-1 h-12 bg-gray-50 border-0">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 12 }, (_, i) => i + 1).map(
                            (month) => (
                              <SelectItem
                                key={month}
                                value={month.toString().padStart(2, "0")}
                              >
                                {month.toString().padStart(2, "0")}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-xs font-medium text-gray-700 uppercase tracking-wider">
                        EXPIRY YEAR *
                      </Label>
                      <Select
                        value={paymentData.expiryYear}
                        onValueChange={(value) =>
                          setPaymentData({ ...paymentData, expiryYear: value })
                        }
                      >
                        <SelectTrigger className="mt-1 h-12 bg-gray-50 border-0">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from(
                            { length: 10 },
                            (_, i) => new Date().getFullYear() + i,
                          ).map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs font-medium text-gray-700 uppercase tracking-wider">
                        CVV *
                      </Label>
                      <Input
                        type="text"
                        placeholder="123"
                        value={paymentData.cvv}
                        onChange={(e) =>
                          setPaymentData({
                            ...paymentData,
                            cvv: e.target.value,
                          })
                        }
                        className="mt-1 h-12 bg-gray-50 border-0 placeholder:text-gray-500"
                        maxLength={4}
                        required
                      />
                    </div>

                    <div>
                      <Label className="text-xs font-medium text-gray-700 uppercase tracking-wider">
                        CARDHOLDER NAME *
                      </Label>
                      <Input
                        type="text"
                        placeholder="John Doe"
                        value={paymentData.holderName}
                        onChange={(e) =>
                          setPaymentData({
                            ...paymentData,
                            holderName: e.target.value,
                          })
                        }
                        className="mt-1 h-12 bg-gray-50 border-0 placeholder:text-gray-500"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Billing Address */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wider">
                    BILLING ADDRESS
                  </h3>

                  <div>
                    <Label className="text-xs font-medium text-gray-700 uppercase tracking-wider">
                      COUNTRY, REGION *
                    </Label>
                    <Select
                      value={paymentData.country}
                      onValueChange={(value) =>
                        setPaymentData({ ...paymentData, country: value })
                      }
                    >
                      <SelectTrigger className="mt-1 h-12 bg-gray-50 border-0">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="United States">
                          United States
                        </SelectItem>
                        <SelectItem value="Canada">Canada</SelectItem>
                        <SelectItem value="United Kingdom">
                          United Kingdom
                        </SelectItem>
                        <SelectItem value="Australia">Australia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-xs font-medium text-gray-700 uppercase tracking-wider">
                      ADDRESS LINE 1 *
                    </Label>
                    <Input
                      type="text"
                      value={paymentData.billingAddress}
                      onChange={(e) =>
                        setPaymentData({
                          ...paymentData,
                          billingAddress: e.target.value,
                        })
                      }
                      className="mt-1 h-12 bg-gray-50 border-0 placeholder:text-gray-500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label className="text-xs font-medium text-gray-700 uppercase tracking-wider">
                        CITY *
                      </Label>
                      <Input
                        type="text"
                        value={paymentData.city}
                        onChange={(e) =>
                          setPaymentData({
                            ...paymentData,
                            city: e.target.value,
                          })
                        }
                        className="mt-1 h-12 bg-gray-50 border-0 placeholder:text-gray-500"
                        required
                      />
                    </div>

                    <div>
                      <Label className="text-xs font-medium text-gray-700 uppercase tracking-wider">
                        STATE
                      </Label>
                      <Select
                        value={paymentData.state}
                        onValueChange={(value) =>
                          setPaymentData({ ...paymentData, state: value })
                        }
                      >
                        <SelectTrigger className="mt-1 h-12 bg-gray-50 border-0">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CA">California</SelectItem>
                          <SelectItem value="NY">New York</SelectItem>
                          <SelectItem value="TX">Texas</SelectItem>
                          <SelectItem value="FL">Florida</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-xs font-medium text-gray-700 uppercase tracking-wider">
                        ZIP CODE *
                      </Label>
                      <Input
                        type="text"
                        value={paymentData.zipCode}
                        onChange={(e) =>
                          setPaymentData({
                            ...paymentData,
                            zipCode: e.target.value,
                          })
                        }
                        className="mt-1 h-12 bg-gray-50 border-0 placeholder:text-gray-500"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-center pt-4">
                  <Button
                    type="submit"
                    className="bg-black text-white hover:bg-gray-800 px-12 py-3 uppercase tracking-wider text-sm font-medium"
                  >
                    SAVE
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
