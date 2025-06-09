import React, { useEffect, useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Download, 
  RefreshCw,
  Calendar,
  Target,
  Eye,
  Star,
  Package
} from 'lucide-react';
import { format, subDays, startOfWeek, endOfWeek } from 'date-fns';
import toast from 'react-hot-toast';

interface AnalyticsData {
  revenue: {
    total: number;
    growth: number;
    dailyRevenue: Array<{ date: string; revenue: number; orders: number }>;
    monthlyRevenue: Array<{ month: string; revenue: number; profit: number }>;
  };
  orders: {
    total: number;
    growth: number;
    averageValue: number;
    statusBreakdown: Array<{ status: string; count: number; percentage: number }>;
  };
  products: {
    totalSold: number;
    topProducts: Array<{ name: string; sold: number; revenue: number }>;
    categoryPerformance: Array<{ category: string; sales: number; revenue: number }>;
    lowStockAlerts: number;
  };
  customers: {
    total: number;
    newCustomers: number;
    returningCustomers: number;
    customerLifetimeValue: number;
    topCustomers: Array<{ name: string; orders: number; totalSpent: number }>;
  };
  traffic: {
    totalViews: number;
    uniqueVisitors: number;
    conversionRate: number;
    bounceRate: number;
    topPages: Array<{ page: string; views: number; conversions: number }>;
  };
  geographic: {
    topCountries: Array<{ country: string; orders: number; revenue: number }>;
    topCities: Array<{ city: string; orders: number; revenue: number }>;
  };
}

const AdvancedAnalytics: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('7days');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  useEffect(() => {
    fetchAnalyticsData();
  }, [selectedPeriod]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/analytics/advanced?period=${selectedPeriod}`);
      const data = await response.json();
      setAnalyticsData(data);
    } catch (error) {
      toast.error('Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAnalyticsData();
    setRefreshing(false);
    toast.success('Analytics data refreshed');
  };

  const exportReport = async (format: 'pdf' | 'csv' | 'excel') => {
    try {
      const response = await fetch('/api/admin/analytics/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          period: selectedPeriod,
          format,
          metrics: ['revenue', 'orders', 'products', 'customers', 'traffic']
        })
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics-report-${format}-${format(new Date(), 'yyyy-MM-dd')}.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        toast.success(`${format.toUpperCase()} report downloaded`);
      }
    } catch (error) {
      toast.error('Failed to export report');
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No analytics data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Advanced Analytics</h1>
          <p className="text-gray-600">Comprehensive insights into your business performance</p>
        </div>
        
        <div className="flex gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="1year">Last Year</option>
          </select>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>

          <div className="flex gap-1">
            <button
              onClick={() => exportReport('pdf')}
              className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
            >
              PDF
            </button>
            <button
              onClick={() => exportReport('csv')}
              className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
            >
              CSV
            </button>
            <button
              onClick={() => exportReport('excel')}
              className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
            >
              Excel
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${analyticsData.revenue.total.toLocaleString()}</p>
              <p className={`text-sm ${analyticsData.revenue.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {analyticsData.revenue.growth >= 0 ? '+' : ''}{analyticsData.revenue.growth.toFixed(1)}% from last period
              </p>
            </div>
            <DollarSign className="w-12 h-12 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.orders.total.toLocaleString()}</p>
              <p className={`text-sm ${analyticsData.orders.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {analyticsData.orders.growth >= 0 ? '+' : ''}{analyticsData.orders.growth.toFixed(1)}% from last period
              </p>
            </div>
            <ShoppingCart className="w-12 h-12 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.customers.total.toLocaleString()}</p>
              <p className="text-sm text-gray-600">
                {analyticsData.customers.newCustomers} new customers
              </p>
            </div>
            <Users className="w-12 h-12 text-purple-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.traffic.conversionRate.toFixed(2)}%</p>
              <p className="text-sm text-gray-600">
                {analyticsData.traffic.uniqueVisitors.toLocaleString()} unique visitors
              </p>
            </div>
            <Target className="w-12 h-12 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Revenue Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Daily Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={analyticsData.revenue.dailyRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value, name) => [`$${value}`, name]} />
              <Area type="monotone" dataKey="revenue" stroke="#0088FE" fill="#0088FE" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Order Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analyticsData.orders.statusBreakdown}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
                label={({ status, percentage }) => `${status}: ${percentage}%`}
              >
                {analyticsData.orders.statusBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Products & Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Top Selling Products</h3>
          <div className="space-y-3">
            {analyticsData.products.topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{product.name}</p>
                  <p className="text-sm text-gray-600">{product.sold} sold</p>
                </div>
                <p className="font-semibold text-green-600">${product.revenue.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Category Performance</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={analyticsData.products.categoryPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#00C49F" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Customer Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Top Customers</h3>
          <div className="space-y-3">
            {analyticsData.customers.topCustomers.map((customer, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{customer.name}</p>
                  <p className="text-sm text-gray-600">{customer.orders} orders</p>
                </div>
                <p className="font-semibold text-blue-600">${customer.totalSpent.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Geographic Performance</h3>
          <div className="space-y-3">
            <h4 className="font-medium text-gray-700">Top Countries</h4>
            {analyticsData.geographic.topCountries.map((country, index) => (
              <div key={index} className="flex items-center justify-between p-2 border-b">
                <span className="text-gray-900">{country.country}</span>
                <div className="text-right">
                  <p className="text-sm font-medium">{country.orders} orders</p>
                  <p className="text-sm text-gray-600">${country.revenue.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Real-time Metrics */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Real-time Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Eye className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-600">{analyticsData.traffic.totalViews.toLocaleString()}</p>
            <p className="text-sm text-gray-600">Page Views Today</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <Users className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">{analyticsData.traffic.uniqueVisitors.toLocaleString()}</p>
            <p className="text-sm text-gray-600">Unique Visitors</p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <Package className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-yellow-600">{analyticsData.products.lowStockAlerts}</p>
            <p className="text-sm text-gray-600">Low Stock Alerts</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <Star className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-600">{analyticsData.customers.customerLifetimeValue.toFixed(0)}</p>
            <p className="text-sm text-gray-600">Avg. Customer LTV</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedAnalytics;