import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchDashboardStats } from '../store/slices/dashboardSlice';
import { 
  TrendingUp, 
  ShoppingCart, 
  Users, 
  Package,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  BarChart3
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { stats, loading, error } = useAppSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  if (loading && !stats) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-lv-cream via-lv-beige to-lv-cream p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-luvvencencia-gradient mb-3 lv-luxury tracking-[0.15em]">
          LUV VELENCIA DASHBOARD
        </h1>
        <p className="text-lv-brown lv-body text-lg font-medium">
          Welcome to your luxury store management center
        </p>
        <div className="flex items-center mt-3 text-lv-brown/70 lv-body">
          <Calendar className="w-4 h-4 mr-2" />
          <span className="font-medium">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </span>
        </div>
      </div>

      {stats && (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div className="stat-card bg-white/90 backdrop-blur-sm border-lv-brown/10 vintage-shadow royal-hover">
              <div className="flex items-center justify-between">
                <div>
                  <p className="stat-card-title text-lv-brown/70 lv-heading">Total Revenue</p>
                  <p className="stat-card-value text-luvvencencia-gradient lv-title">
                    ${stats.totalRevenue?.toLocaleString() || '0'}
                  </p>
                  <div className="stat-card-change positive mt-2">
                    <ArrowUpRight className="w-4 h-4 mr-1" />
                    <span className="lv-body font-semibold">+12.5% from last month</span>
                  </div>
                </div>
                <div className="p-3 bg-lv-gold/20 rounded-xl">
                  <DollarSign className="w-8 h-8 text-lv-brown" />
                </div>
              </div>
            </div>

            <div className="stat-card bg-white/90 backdrop-blur-sm border-lv-brown/10 vintage-shadow royal-hover">
              <div className="flex items-center justify-between">
                <div>
                  <p className="stat-card-title text-lv-brown/70 lv-heading">Total Orders</p>
                  <p className="stat-card-value text-luvvencencia-gradient lv-title">
                    {stats.totalOrders?.toLocaleString() || '0'}
                  </p>
                  <div className="stat-card-change positive mt-2">
                    <ArrowUpRight className="w-4 h-4 mr-1" />
                    <span className="lv-body font-semibold">+8.2% from last month</span>
                  </div>
                </div>
                <div className="p-3 bg-lv-brown/20 rounded-xl">
                  <ShoppingCart className="w-8 h-8 text-lv-brown" />
                </div>
              </div>
            </div>

            <div className="stat-card bg-white/90 backdrop-blur-sm border-lv-brown/10 vintage-shadow royal-hover">
              <div className="flex items-center justify-between">
                <div>
                  <p className="stat-card-title text-lv-brown/70 lv-heading">Total Customers</p>
                  <p className="stat-card-value text-luvvencencia-gradient lv-title">
                    {stats.totalCustomers?.toLocaleString() || '0'}
                  </p>
                  <div className="stat-card-change positive mt-2">
                    <ArrowUpRight className="w-4 h-4 mr-1" />
                    <span className="lv-body font-semibold">+15.3% from last month</span>
                  </div>
                </div>
                <div className="p-3 bg-lv-beige/60 rounded-xl">
                  <Users className="w-8 h-8 text-lv-brown" />
                </div>
              </div>
            </div>

            <div className="stat-card bg-white/90 backdrop-blur-sm border-lv-brown/10 vintage-shadow royal-hover">
              <div className="flex items-center justify-between">
                <div>
                  <p className="stat-card-title text-lv-brown/70 lv-heading">Total Products</p>
                  <p className="stat-card-value text-luvvencencia-gradient lv-title">
                    {stats.totalProducts?.toLocaleString() || '0'}
                  </p>
                  <div className="stat-card-change negative mt-2">
                    <ArrowDownRight className="w-4 h-4 mr-1" />
                    <span className="lv-body font-semibold">-2.1% from last month</span>
                  </div>
                </div>
                <div className="p-3 bg-lv-gold/30 rounded-xl">
                  <Package className="w-8 h-8 text-lv-brown" />
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Recent Orders */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl vintage-shadow border-lv-brown/10 p-8 royal-hover">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-luvvencencia-gradient lv-luxury tracking-[0.1em]">
                  RECENT ORDERS
                </h3>
                <BarChart3 className="w-6 h-6 text-lv-brown" />
              </div>

              <div className="space-y-4">
                {stats.recentOrders?.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-lv-cream/30 rounded-lg border border-lv-brown/10">
                    <div>
                      <p className="font-semibold text-lv-brown lv-body">Order #{order.id}</p>
                      <p className="text-sm text-lv-brown/70 lv-body">{order.customerName}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lv-brown lv-title">${order.total?.toFixed(2)}</p>
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold lv-body ${
                        order.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : order.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl vintage-shadow border-lv-brown/10 p-8 royal-hover">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-luvvencencia-gradient lv-luxury tracking-[0.1em]">
                  TOP PRODUCTS
                </h3>
                <TrendingUp className="w-6 h-6 text-lv-brown" />
              </div>

              <div className="space-y-4">
                {stats.topProducts?.slice(0, 5).map((product, index) => (
                  <div key={product.id} className="flex items-center justify-between p-4 bg-lv-cream/30 rounded-lg border border-lv-brown/10">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-lv-gold/20 rounded-full flex items-center justify-center mr-3">
                        <span className="text-sm font-bold text-lv-brown lv-title">#{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-lv-brown lv-body">{product.name}</p>
                        <p className="text-sm text-lv-brown/70 lv-body">{product.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lv-brown lv-title">${product.price?.toFixed(2)}</p>
                      <p className="text-sm text-lv-brown/70 lv-body">{product.sales} sold</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl vintage-shadow border-lv-brown/10 p-8">
            <h3 className="text-xl font-semibold text-luvvencencia-gradient mb-6 lv-luxury tracking-[0.1em]">
              QUICK ACTIONS
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button className="admin-btn-primary bg-luvvencencia-gradient hover:bg-royal-gradient text-white p-6 rounded-lg lv-body font-semibold tracking-wide luxury-transition text-left">
                <Package className="w-8 h-8 mb-3" />
                <h4 className="font-semibold mb-2 lv-heading">ADD PRODUCT</h4>
                <p className="text-sm opacity-90 lv-body">Create new luxury items</p>
              </button>

              <button className="admin-btn-secondary border-2 border-lv-brown text-lv-brown hover:bg-lv-brown hover:text-white p-6 rounded-lg lv-body font-semibold tracking-wide luxury-transition text-left">
                <Users className="w-8 h-8 mb-3" />
                <h4 className="font-semibold mb-2 lv-heading">MANAGE CUSTOMERS</h4>
                <p className="text-sm opacity-70 lv-body">View customer insights</p>
              </button>

              <button className="admin-btn-gold bg-lv-gold hover:bg-lv-gold/80 text-lv-brown p-6 rounded-lg lv-body font-semibold tracking-wide luxury-transition text-left">
                <BarChart3 className="w-8 h-8 mb-3" />
                <h4 className="font-semibold mb-2 lv-heading">VIEW ANALYTICS</h4>
                <p className="text-sm opacity-70 lv-body">Track performance metrics</p>
              </button>
            </div>
          </div>
        </>
      )}

      {error && (
        <div className="bg-red-50/80 border border-red-200 rounded-lg p-6 vintage-shadow">
          <p className="text-red-600 lv-body font-medium">Error loading dashboard: {error}</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;