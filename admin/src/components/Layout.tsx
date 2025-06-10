
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { logout } from '../store/slices/authSlice';
import {
  Users,
  Package,
  ShoppingCart,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  Home,
  MessageSquare,
  Percent,
  CreditCard,
  ChevronDown,
  User,
  Shield,
  HelpCircle,
  Shirt
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const navigationItems = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Products', href: '/products', icon: Package },
    { name: 'Orders', href: '/orders', icon: ShoppingCart },
    { name: 'Users', href: '/users', icon: Users },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Messages', href: '/contact-messages', icon: MessageSquare },
    { name: 'Discounts', href: '/discounts', icon: Percent },
    { name: 'Currency', href: '/currency', icon: CreditCard },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 sm:w-72 transform bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex h-full flex-col overflow-hidden">
          {/* Logo */}
          <div className="flex h-16 sm:h-20 items-center justify-between px-3 sm:px-6 border-b border-slate-700/50 flex-shrink-0">
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
              <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg flex-shrink-0">
                <Shirt className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-base sm:text-xl font-bold text-white tracking-tight truncate">LUV VELENCIA</h1>
                <p className="text-xs text-slate-400 font-medium hidden sm:block">Admin Dashboard</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-slate-400 hover:text-white transition-colors duration-200 p-1"
            >
              <X className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 sm:px-4 py-4 sm:py-6 space-y-1 sm:space-y-2 overflow-y-auto">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const active = isActivePath(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`group flex items-center px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium rounded-xl transition-all duration-300 ${
                    active
                      ? 'bg-gradient-to-r from-emerald-500/20 to-emerald-600/10 text-emerald-400 border-r-2 border-emerald-400 shadow-lg'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <Icon className={`mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 transition-colors duration-200 ${
                    active ? 'text-emerald-400' : 'text-slate-400 group-hover:text-white'
                  }`} />
                  <span className="truncate">{item.name}</span>
                  {active && (
                    <div className="ml-auto w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-400 rounded-full animate-pulse flex-shrink-0" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="border-t border-slate-700/50 p-2 sm:p-4 flex-shrink-0">
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="w-full flex items-center px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-xl transition-all duration-200"
              >
                <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg mr-2 sm:mr-3 flex-shrink-0">
                  <User className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <p className="font-semibold truncate">{user?.name || 'Admin'}</p>
                  <p className="text-xs text-slate-400 hidden sm:block">Administrator</p>
                </div>
                <ChevronDown className={`h-3 w-3 sm:h-4 sm:w-4 transition-transform duration-200 flex-shrink-0 ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {userMenuOpen && (
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-slate-800 rounded-xl border border-slate-700 shadow-xl backdrop-blur-sm">
                  <div className="py-2">
                    <button className="w-full flex items-center px-3 sm:px-4 py-2 text-xs sm:text-sm text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors duration-200">
                      <User className="h-3 w-3 sm:h-4 sm:w-4 mr-2 sm:mr-3" />
                      Profile
                    </button>
                    <button className="w-full flex items-center px-3 sm:px-4 py-2 text-xs sm:text-sm text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors duration-200">
                      <Shield className="h-3 w-3 sm:h-4 sm:w-4 mr-2 sm:mr-3" />
                      Security
                    </button>
                    <button className="w-full flex items-center px-3 sm:px-4 py-2 text-xs sm:text-sm text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors duration-200">
                      <HelpCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-2 sm:mr-3" />
                      Help
                    </button>
                    <div className="border-t border-slate-700 my-1" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-3 sm:px-4 py-2 text-xs sm:text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors duration-200"
                    >
                      <LogOut className="h-3 w-3 sm:h-4 sm:w-4 mr-2 sm:mr-3" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 xl:pl-72">
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200">
          <div className="flex h-14 sm:h-16 items-center justify-between px-3 sm:px-4 lg:px-6 xl:px-8">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-1.5 sm:p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all duration-200"
              >
                <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
              
              <div className="hidden md:flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="pl-10 pr-4 py-2 w-48 lg:w-64 border border-slate-200 rounded-lg bg-white/50 backdrop-blur-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Mobile search */}
              <button className="md:hidden p-1.5 sm:p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all duration-200">
                <Search className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              
              <button className="relative p-1.5 sm:p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all duration-200">
                <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="absolute -top-1 -right-1 h-3 w-3 sm:h-4 sm:w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  3
                </span>
              </button>
              
              <div className="hidden sm:flex items-center space-x-3 pl-3 sm:pl-4 border-l border-slate-200">
                <div className="text-right hidden lg:block">
                  <p className="text-sm font-semibold text-slate-900">{user?.name || 'Admin'}</p>
                  <p className="text-xs text-slate-500">Administrator</p>
                </div>
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <User className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-3 sm:p-4 lg:p-6 xl:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
