
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { User, Settings, ShoppingBag, Heart, CreditCard, MapPin, Bell, Package, Calendar } from 'lucide-react';

// Import the new pages
import Orders from './account/orders';
import AccountSettings from './account/settings';
import Addresses from './account/addresses';
import Wallet from './account/wallet';
import SavedItems from './account/saved-items';
import Appointments from './account/appointments';

function AccountHome() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    {
      icon: Package,
      title: 'My Orders',
      description: 'View your past orders and track shipments',
      href: '/account/orders'
    },
    {
      icon: Settings,
      title: 'Account Settings',
      description: 'Privacy and security settings',
      href: '/account/settings'
    },
    {
      icon: MapPin,
      title: 'Address Book',
      description: 'Manage shipping and billing addresses',
      href: '/account/addresses'
    },
    {
      icon: CreditCard,
      title: 'Wallet',
      description: 'Manage your payment options',
      href: '/account/wallet'
    },
    {
      icon: Heart,
      title: 'Saved Items',
      description: 'Items you want to keep track of',
      href: '/account/saved-items'
    },
    {
      icon: Calendar,
      title: 'My Appointments',
      description: 'Book and manage store appointments',
      href: '/account/appointments'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-light uppercase tracking-wider text-black">
                My Account
              </h1>
              <p className="text-gray-600 mt-2">
                Welcome back, {user?.name}
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex gap-4">
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                className="border-black text-black hover:bg-gray-50"
              >
                Continue Shopping
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* User Info Card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center text-white text-lg font-medium">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-lg font-medium text-black">{user?.name}</h2>
              <p className="text-gray-600">{user?.email}</p>
              <p className="text-sm text-gray-500 mt-1">
                Signed in with {user?.provider === 'email' ? 'Email' : user?.provider === 'google' ? 'Google' : 'Apple'}
              </p>
            </div>
          </div>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <button
              key={item.href}
              onClick={() => navigate(item.href)}
              className="text-left p-6 border border-gray-200 rounded-lg hover:border-black hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start gap-4">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <item.icon className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-medium text-black mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-12 bg-black text-white rounded-lg p-8 text-center">
          <h3 className="text-xl font-light uppercase tracking-wider mb-4">
            Exclusive Member Benefits
          </h3>
          <p className="text-gray-300 mb-6">
            Enjoy complimentary shipping, early access to new collections, and personalized styling services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate('/shopping-bag')}
              className="bg-white text-black hover:bg-gray-100"
            >
              View Shopping Bag
            </Button>
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-black"
            >
              Explore Collections
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Account() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/sign-in');
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
