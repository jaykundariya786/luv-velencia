import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { logout } from "@/store/slices/authSlice";
import { Button } from "@/components/ui/button";
import { useNavigate, Routes, Route } from "react-router-dom";
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
} from "lucide-react";

// Import the new pages
import Orders from "./account/orders";
import AccountSettings from "./account/settings";
import Addresses from "./account/addresses";
import Wallet from "./account/wallet";
import SavedItems from "./account/saved-items";
import Appointments from "./account/appointments";
import { useEffect } from "react";

function AccountHome() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const menuItems = [
    {
      icon: Package,
      title: "TRACK YOUR ORDERS",
      description: "Follow your orders every step of the way.",
      path: "/account/orders",
    },
    {
      icon: CreditCard,
      title: "STREAMLINE CHECKOUT",
      description: "Check out faster with saved addresses and payment methods.",
      path: "/account/wallet",
    },
    {
      icon: Calendar,
      title: "BOOK AN APPOINTMENT",
      description: "Enjoy priority access to the boutique of your choice at the time and date that suits you.",
      path: "/account/appointments",
    },
    {
      icon: Settings,
      title: "ACCOUNT SETTINGS",
      description: "Manage your personal information and preferences",
      path: "/account/settings",
    },
    {
      icon: MapPin,
      title: "ADDRESS BOOK",
      description: "Manage your shipping and billing addresses",
      path: "/account/addresses",
    },
    {
      icon: Heart,
      title: "SAVED ITEMS",
      description: "View your wishlist and saved products",
      path: "/account/saved-items",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lv-luxury uppercase tracking-wider text-black mb-4">
            MY LUV VELENCIA Account
          </h1>
          <p className="text-gray-600 text-lg">Welcome back, {user?.name}</p>
        </div>

        {/* Profile Section */}
        <div className="bg-gray-50 rounded-2xl p-8 mb-12 text-center">
          <div className="w-24 h-24 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-2xl font-medium text-black mb-2">{user?.name}</h2>
          <p className="text-gray-600 mb-1">{user?.email}</p>
          <p className="text-sm text-gray-500">Member since 2024</p>
        </div>

        {/* Main Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {menuItems.slice(0, 3).map((item, index) => (
            <div
              key={index}
              onClick={() => navigate(item.path)}
              className="group text-center p-8 border-2 border-gray-200 rounded-2xl hover:border-black transition-all duration-300 cursor-pointer hover:shadow-lg"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-black group-hover:text-white transition-all duration-300">
                <item.icon className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-black mb-3 lv-luxury uppercase tracking-wider">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Additional Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {menuItems.slice(3).map((item, index) => (
            <div
              key={index + 3}
              onClick={() => navigate(item.path)}
              className="group p-6 border border-gray-200 rounded-xl hover:border-black transition-colors cursor-pointer hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <item.icon className="w-6 h-6 text-gray-600 group-hover:text-black transition-colors" />
                  <div>
                    <h3 className="font-medium text-black group-hover:text-black text-sm uppercase tracking-wider">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-600 mt-1">
                      {item.description}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-black transition-colors" />
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-black rounded-2xl text-white p-8 text-center">
          <h3 className="text-xl font-bold mb-6 lv-luxury uppercase tracking-wider">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="secondary"
              className="bg-white text-black hover:bg-gray-100 py-3 text-sm font-medium"
              onClick={() => navigate("/products")}
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
            <Button
              variant="secondary"
              className="bg-white text-black hover:bg-gray-100 py-3 text-sm font-medium"
              onClick={() => navigate("/account/orders")}
            >
              <Package className="w-4 h-4 mr-2" />
              Track Order
            </Button>
            <Button
              variant="secondary"
              className="bg-white text-black hover:bg-gray-100 py-3 text-sm font-medium"
              onClick={() => navigate("/account/appointments")}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Book Appointment
            </Button>
          </div>
        </div>

        {/* Sign Out */}
        <div className="text-center mt-12">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-black text-black hover:bg-black hover:text-white px-8 py-3"
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
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/sign-in');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return (
    <Routes>
      <Route path="/" element={<AccountHome />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/settings" element={<AccountSettings />} />
      <Route path="/addresses" element={<Addresses />} />
      <Route path="/wallet" element={<Wallet />} />
      <Route path="/saved-items" element={<SavedItems />} />
      <Route path="/appointments" element={<Appointments />} />
    </Routes>
  );
}