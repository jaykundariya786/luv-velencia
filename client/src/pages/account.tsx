import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { logout } from "@/store/slices/authSlice";
import { Button } from "@/components/ui/button";
import { useLocation, Route, Router } from "wouter";
import {
  User,
  Settings,
  ShoppingBag,
  Heart,
  CreditCard,
  MapPin,
  Bell,
  Package,
  Calendar,
  ChevronRight,
  LogOut,
  Sparkles,
  Crown,
  Star,
  ArrowUpRight,
  Gift,
} from "lucide-react";
// Import the new pages
import Orders from "./account/orders";
import AccountSettings from "./account/settings";
import Addresses from "./account/addresses";
import Wallet from "./account/wallet";
import SavedItems from "./account/saved-items";
import Appointments from "./account/appointments";
import { useEffect } from "react";

// Static menu data
const staticMenuData = {
  mainServices: [
    {
      icon: "Package",
      title: "TRACK YOUR ORDERS",
      description: "Follow your orders every step of the way.",
      path: "/account/orders",
      color: "from-blue-500 to-purple-600",
      bgColor: "bg-gradient-to-br from-blue-50 to-purple-50",
    },
    {
      icon: "CreditCard",
      title: "STREAMLINE CHECKOUT",
      description: "Check out faster with saved addresses and payment methods.",
      path: "/account/wallet",
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-gradient-to-br from-green-50 to-emerald-50",
    },
    {
      icon: "Calendar",
      title: "BOOK AN APPOINTMENT",
      description: "Enjoy priority access to the boutique of your choice at the time and date that suits you.",
      path: "/account/appointments",
      color: "from-orange-500 to-pink-600",
      bgColor: "bg-gradient-to-br from-orange-50 to-pink-50",
    },
  ],
  quickActions: [
    {
      icon: "Settings",
      title: "ACCOUNT SETTINGS",
      description: "Manage your personal information and preferences",
      path: "/account/settings",
      iconColor: "text-gray-600",
    },
    {
      icon: "MapPin",
      title: "ADDRESS BOOK",
      description: "Manage your shipping and billing addresses",
      path: "/account/addresses",
      iconColor: "text-blue-600",
    },
    {
      icon: "Heart",
      title: "SAVED ITEMS",
      description: "View your wishlist and saved products",
      path: "/account/saved-items",
      iconColor: "text-pink-600",
    },
  ],
};

function AccountHome() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [, setLocation] = useLocation();

  const handleLogout = () => {
    dispatch(logout());
    setLocation("/");
  };

  // Icon mapping
  const iconMap: { [key: string]: any } = {
    Package,
    CreditCard,
    Calendar,
    Settings,
    MapPin,
    Heart,
  };

  const menuItems = staticMenuData.mainServices.map((item: any) => ({
    ...item,
    icon: iconMap[item.icon] || Package,
  }));

  const quickActions = staticMenuData.quickActions.map((item: any) => ({
    ...item,
    icon: iconMap[item.icon] || Settings,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section - Similar to Shopping Bag Page */}
      <div
        className="relative h-[400px] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: user?.photoURL 
            ? `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('${user.photoURL}')`
            : "linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')",
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            {user?.photoURL ? (
              <div className="w-16 h-16 mx-auto mb-6 rounded-full overflow-hidden border-4 border-white/50 shadow-xl">
                <img 
                  src={user.photoURL} 
                  alt={user.name} 
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <User className="w-16 h-16 mx-auto mb-6 text-white/80" />
            )}
            <h1 className="text-3xl md:text-5xl lv-luxury text-white tracking-[0.2em] drop-shadow-md">
              MY ACCOUNT
            </h1>
            <div className="w-24 h-px bg-white/60 mx-auto mb-4 mt-4"></div>
            <p className="text-lg text-white/80 font-light">
              Welcome back, {user?.name}
            </p>
          </div>
        </div>

        {/* Diamond Logo */}
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-r from-[#0b3e27] to-[#197149] rotate-45 flex items-center justify-center">
          <span className="text-white text-lg font-bold transform -rotate-45">
            A
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Profile Summary Card - Similar to Shopping Bag Style */}
        <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-50 overflow-hidden hover:shadow-2xl hover:border-gray-100 transition-all duration-500 mb-8">
          <div className="p-8">
            <div className="flex gap-6">
              {/* User Avatar */}
              <div className="w-20 h-20 rounded-full flex-shrink-0 overflow-hidden shadow-md border-4 border-white">
                {user?.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt={user.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center">
                    <User className="w-10 h-10 text-white" />
                  </div>
                )}
              </div>

              {/* User Details */}
              <div className="flex-1 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="lv-luxury text-2xl font-bold text-gray-900 mb-2">
                      {user?.name}
                    </h2>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-4">
                        <span className="text-gray-500">Email:</span>
                        <span className="text-gray-700 font-medium">{user?.email}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-gray-500">Status:</span>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm font-medium text-green-800">VIP MEMBER</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-gray-500">Member Since:</span>
                        <span className="text-gray-700 font-medium">2024</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">12</div>
                    <div className="text-sm text-gray-500">Orders</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">5</div>
                    <div className="text-sm text-gray-500">Saved Items</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">8.5k</div>
                    <div className="text-sm text-gray-500">Points</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Services Grid */}
        <div className="mb-8">
          <h3 className="text-2xl lv-luxury font-bold text-center mb-8 text-gray-900">Main Services</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item: any, index: number) => (
              <div
                key={index}
                onClick={() => setLocation(item.path)}
                className="bg-white rounded-3xl shadow-xl border-2 border-gray-50 overflow-hidden hover:shadow-2xl hover:border-gray-100 transition-all duration-500 cursor-pointer"
              >
                <div className="p-6">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center mx-auto shadow-md">
                      <item.icon className="w-8 h-8 text-gray-600" />
                    </div>
                    <div>
                      <h4 className="lv-luxury text-lg font-bold text-gray-900 mb-2">
                        {item.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-2xl lv-luxury font-bold text-center mb-8 text-gray-900">Quick Actions</h3>
          <div className="space-y-4">
            {quickActions.map((item: any, index: number) => (
              <div
                key={index}
                onClick={() => setLocation(item.path)}
                className="bg-white rounded-3xl shadow-xl border-2 border-gray-50 overflow-hidden hover:shadow-2xl hover:border-gray-100 transition-all duration-500 cursor-pointer"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center shadow-md">
                        <item.icon className={`w-6 h-6 ${item.iconColor}`} />
                      </div>
                      <div>
                        <h4 className="lv-luxury text-base font-bold text-gray-900 mb-1">
                          {item.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Button
            onClick={() => setLocation("/products")}
            className="lv-luxury font-bold text-primary rounded-full items-center justify-center bg-primary hover:shadow-xl transition-all h-12 uppercase text-sm text-white px-8"
          >
            <ShoppingBag className="w-4 h-4 mr-2" />
            Continue Shopping
          </Button>
          <Button
            onClick={() => setLocation("/account/orders")}
            className="lv-luxury font-bold text-primary rounded-full items-center justify-center bg-primary hover:shadow-xl transition-all h-12 uppercase text-sm text-white px-8"
          >
            <Package className="w-4 h-4 mr-2" />
            Track Orders
          </Button>
          <Button
            onClick={() => setLocation("/account/appointments")}
            className="lv-luxury font-bold text-primary rounded-full items-center justify-center bg-primary hover:shadow-xl transition-all h-12 uppercase text-sm text-white px-8"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Book Appointment
          </Button>
        </div>

        {/* Sign Out */}
        <div className="text-center">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-2 border-gray-300 text-gray-600 hover:border-red-400 hover:bg-red-50 hover:text-red-600 px-8 py-3 rounded-full transition-all duration-300 hover:scale-105"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function Account() {
  const [location, setLocation] = useLocation();
  const { user } = useAppSelector((state) => state.auth);

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (!user) {
      setLocation('/sign-in');
    }
  }, [user, setLocation]);

  if (!user) {
    return null;
  }

  // Handle nested routing for account pages
  if (location === '/account/orders') return <Orders />;
  if (location === '/account/settings') return <AccountSettings />;
  if (location === '/account/addresses') return <Addresses />;
  if (location === '/account/wallet') return <Wallet />;
  if (location === '/account/saved-items') return <SavedItems />;
  if (location === '/account/appointments') return <Appointments />;

  return <AccountHome />;
}
