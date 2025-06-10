
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
import { useAccountMenu } from "@/hooks/use-account-menu";

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
  const [, setLocation] = useLocation();
  const { data: menuData, isLoading } = useAccountMenu();

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">Loading account...</div>
      </div>
    );
  }

  const menuItems = menuData?.mainServices?.map((item: any) => ({
    ...item,
    icon: iconMap[item.icon] || Package,
  })) || [];

  const quickActions = menuData?.quickActions?.map((item: any) => ({
    ...item,
    icon: iconMap[item.icon] || Settings,
  })) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-black via-gray-800 to-black rounded-full blur-xl opacity-20 scale-110"></div>
            <div className="relative w-20 h-20 bg-gradient-to-br from-black to-gray-800 rounded-full flex items-center justify-center shadow-2xl">
              <User className="w-10 h-10 text-white" />
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Crown className="w-3 h-3 text-white" />
              </div>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl lv-luxury uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-black via-gray-800 to-black mb-3">
            MY LUV VELENCIA Account
          </h1>
          <p className="text-xl text-gray-600 font-medium mb-2">Welcome back, {user?.name}</p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span>Premium Member since 2024</span>
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
          </div>
          
          <div className="w-32 h-1 bg-gradient-to-r from-transparent via-black to-transparent mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Enhanced Profile Section */}
        <div className="relative mb-16">
          <div className="absolute inset-0 bg-gradient-to-r from-black/5 via-transparent to-black/5 rounded-3xl"></div>
          <div className="relative bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-3xl p-8 shadow-xl">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center gap-6 mb-6 md:mb-0">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-black to-gray-700 rounded-full flex items-center justify-center shadow-lg">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="text-left">
                  <h2 className="text-2xl font-bold text-black mb-1">{user?.name}</h2>
                  <p className="text-gray-600 mb-1">{user?.email}</p>
                  <div className="flex items-center gap-2">
                    <div className="px-3 py-1 bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 text-xs font-semibold rounded-full">
                      VIP Member
                    </div>
                    <Sparkles className="w-4 h-4 text-yellow-500" />
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-4">
                <div className="text-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl">
                  <div className="text-2xl font-bold text-black">12</div>
                  <div className="text-xs text-gray-600 uppercase tracking-wide">Orders</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl">
                  <div className="text-2xl font-bold text-black">5</div>
                  <div className="text-xs text-gray-600 uppercase tracking-wide">Saved</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl">
                  <div className="text-2xl font-bold text-black">8.5k</div>
                  <div className="text-xs text-gray-600 uppercase tracking-wide">Points</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Main Features Grid */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-8 lv-luxury uppercase tracking-wider">Main Services</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item: any, index: number) => (
              <div
                key={index}
                onClick={() => setLocation(item.path)}
                className="group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-100"
              >
                <div className={`absolute inset-0 ${item.bgColor} opacity-30`}></div>
                <div className="relative p-6 bg-white/95 backdrop-blur-sm h-full">
                  <div className="grid grid-rows-[auto_1fr_auto] h-full gap-4">
                    {/* Icon Section */}
                    <div className="justify-self-center">
                      <div className={`w-16 h-16 bg-gradient-to-r ${item.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                        <item.icon className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    
                    {/* Content Section */}
                    <div className="text-center">
                      <h3 className="text-base font-bold text-black mb-3 lv-luxury uppercase tracking-wide">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                    
                    {/* Action Section */}
                    <div className="flex items-center justify-center gap-2 text-black font-semibold group-hover:gap-3 transition-all duration-300 pt-2 border-t border-gray-100">
                      <span className="text-sm">Explore</span>
                      <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Quick Actions */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-8 lv-luxury uppercase tracking-wider">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((item: any, index: number) => (
              <div
                key={index}
                onClick={() => setLocation(item.path)}
                className="group p-6 bg-white border border-gray-200 rounded-2xl hover:border-black/20 hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <item.icon className={`w-6 h-6 ${item.iconColor} group-hover:scale-110 transition-transform duration-300`} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-black text-sm uppercase tracking-wider mb-1">
                        {item.title}
                      </h4>
                      <p className="text-xs text-gray-600">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-black group-hover:translate-x-1 transition-all duration-300" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Action Buttons */}
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-black via-gray-800 to-black rounded-3xl opacity-90"></div>
          <div className="relative bg-black rounded-3xl text-white p-8 shadow-2xl">
            <div className="text-center mb-8">
              <Gift className="w-8 h-8 mx-auto mb-4 text-yellow-400" />
              <h3 className="text-2xl font-bold mb-2 lv-luxury uppercase tracking-wider">Premium Services</h3>
              <p className="text-gray-300">Experience luxury shopping like never before</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="secondary"
                className="bg-white text-black hover:bg-gray-100 py-4 text-sm font-semibold rounded-full group transition-all duration-300 hover:scale-105"
                onClick={() => setLocation("/products")}
              >
                <ShoppingBag className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                Continue Shopping
              </Button>
              <Button
                variant="secondary"
                className="bg-white text-black hover:bg-gray-100 py-4 text-sm font-semibold rounded-full group transition-all duration-300 hover:scale-105"
                onClick={() => setLocation("/account/orders")}
              >
                <Package className="w-4 h-4 mr-2 group-hover:bounce transition-all duration-300" />
                Track Order
              </Button>
              <Button
                variant="secondary"
                className="bg-white text-black hover:bg-gray-100 py-4 text-sm font-semibold rounded-full group transition-all duration-300 hover:scale-105"
                onClick={() => setLocation("/account/appointments")}
              >
                <Calendar className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                Book Appointment
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Sign Out */}
        <div className="text-center">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-2 border-gray-300 text-gray-600 hover:border-black hover:bg-black hover:text-white px-8 py-3 rounded-full transition-all duration-300 hover:scale-105 group"
          >
            <LogOut className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
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
