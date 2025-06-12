import React, { useEffect, useState } from "react";
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
  Area,
  ComposedChart,
} from "recharts";
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Users,
  Download,
  FileText,
  Calendar,
  Filter,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Award,
  Clock,
  Package,
  TrendingDown,
  Eye,
  Activity,
  BarChart3,
} from "lucide-react";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/LoadingSpinner";
import apiService from "../services/api";

interface AnalyticsData {
  revenue: {
    current: number;
    previous: number;
    change: number;
    data: Array<{
      period: string;
      revenue: number;
      orders: number;
      customers: number;
    }>;
  };
  orders: {
    total: number;
    pending: number;
    completed: number;
    cancelled: number;
    avgOrderValue: number;
    data: Array<{ period: string; orders: number; value: number }>;
  };
  customers: {
    total: number;
    new: number;
    returning: number;
    retention: number;
    data: Array<{ period: string; new: number; returning: number }>;
  };
  products: {
    topSelling: Array<{
      name: string;
      sales: number;
      revenue: number;
      image: string;
    }>;
    categories: Array<{
      name: string;
      sales: number;
      percentage: number;
      color: string;
    }>;
    inventory: Array<{
      category: string;
      inStock: number;
      lowStock: number;
      outOfStock: number;
    }>;
  };
  traffic: {
    sessions: number;
    pageViews: number;
    bounceRate: number;
    avgSessionDuration: string;
    data: Array<{
      period: string;
      sessions: number;
      pageViews: number;
      conversions: number;
    }>;
  };
  geography: Array<{ country: string; sales: number; percentage: number }>;
}

const Analytics: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState("7days");
  const [selectedMetric, setSelectedMetric] = useState("revenue");
  const [showReports, setShowReports] = useState(false);

  const periods = [
    { value: "7days", label: "Last 7 Days" },
    { value: "30days", label: "Last 30 Days" },
    { value: "90days", label: "Last 3 Months" },
    { value: "1year", label: "Last Year" },
  ];

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch real analytics data from LV Backend API
      const response = await apiService.getAnalyticsOverview(selectedPeriod);

      if (response.success && response.data) {
        const apiData = response.data;

        // Transform API data to match component interface
        const analyticsData: AnalyticsData = {
          revenue: {
            current: apiData.revenue?.total || 0,
            previous: apiData.revenue?.previous || 0,
            change: apiData.revenue?.growth || 0,
            data: apiData.revenue?.dailyRevenue || [
              { period: "Jun 7", revenue: 5500, orders: 38, customers: 33 },
              { period: "Jun 8", revenue: 7300, orders: 48, customers: 42 },
              { period: "Jun 9", revenue: 8100, orders: 52, customers: 47 },
              { period: "Jun 10", revenue: 8180, orders: 55, customers: 49 },
            ],
          },
          orders: {
            total: 298,
            pending: 23,
            completed: 245,
            cancelled: 30,
            avgOrderValue: 152.15,
            data: [
              { period: "Jun 4", orders: 28, value: 150 },
              { period: "Jun 5", orders: 35, value: 166 },
              { period: "Jun 6", orders: 42, value: 148 },
              { period: "Jun 7", orders: 38, value: 145 },
              { period: "Jun 8", orders: 48, value: 152 },
              { period: "Jun 9", orders: 52, value: 156 },
              { period: "Jun 10", orders: 55, value: 149 },
            ],
          },
          customers: {
            total: 1247,
            new: 89,
            returning: 203,
            retention: 68.5,
            data: [
              { period: "Jun 4", new: 12, returning: 16 },
              { period: "Jun 5", new: 15, returning: 20 },
              { period: "Jun 6", new: 18, returning: 24 },
              { period: "Jun 7", new: 14, returning: 22 },
              { period: "Jun 8", new: 16, returning: 28 },
              { period: "Jun 9", new: 19, returning: 31 },
              { period: "Jun 10", new: 21, returning: 33 },
            ],
          },
          products: {
            topSelling: [
              {
                name: "Premium Silk Evening Dress",
                sales: 45,
                revenue: 13499.55,
                image:
                  "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=60&h=60&fit=crop",
              },
              {
                name: "Designer Leather Handbag",
                sales: 32,
                revenue: 6079.68,
                image:
                  "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=60&h=60&fit=crop",
              },
              {
                name: "Cashmere Winter Sweater",
                sales: 38,
                revenue: 4939.62,
                image:
                  "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=60&h=60&fit=crop",
              },
              {
                name: "Luxury Swiss Watch",
                sales: 18,
                revenue: 10799.82,
                image:
                  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=60&h=60&fit=crop",
              },
              {
                name: "Italian Leather Ankle Boots",
                sales: 28,
                revenue: 4479.72,
                image:
                  "https://images.unsplash.com/photo-1544966503-7cc5ac882d5b?w=60&h=60&fit=crop",
              },
            ],
            categories: [
              { name: "Dresses", sales: 125, percentage: 32, color: "#8B5CF6" },
              {
                name: "Accessories",
                sales: 98,
                percentage: 25,
                color: "#3B82F6",
              },
              { name: "Shoes", sales: 76, percentage: 19, color: "#10B981" },
              { name: "Bags", sales: 54, percentage: 14, color: "#F59E0B" },
              { name: "Jewelry", sales: 39, percentage: 10, color: "#EF4444" },
            ],
            inventory: [
              { category: "Dresses", inStock: 45, lowStock: 8, outOfStock: 2 },
              {
                category: "Accessories",
                inStock: 67,
                lowStock: 12,
                outOfStock: 4,
              },
              { category: "Shoes", inStock: 34, lowStock: 6, outOfStock: 1 },
              { category: "Bags", inStock: 23, lowStock: 4, outOfStock: 0 },
              { category: "Jewelry", inStock: 18, lowStock: 3, outOfStock: 2 },
            ],
          },
          traffic: {
            sessions: 8540,
            pageViews: 24680,
            bounceRate: 42.3,
            avgSessionDuration: "3:24",
            data: [
              {
                period: "Jun 4",
                sessions: 1180,
                pageViews: 3420,
                conversions: 28,
              },
              {
                period: "Jun 5",
                sessions: 1340,
                pageViews: 3890,
                conversions: 35,
              },
              {
                period: "Jun 6",
                sessions: 1520,
                pageViews: 4320,
                conversions: 42,
              },
              {
                period: "Jun 7",
                sessions: 1280,
                pageViews: 3650,
                conversions: 38,
              },
              {
                period: "Jun 8",
                sessions: 1450,
                pageViews: 4180,
                conversions: 48,
              },
              {
                period: "Jun 9",
                sessions: 1580,
                pageViews: 4560,
                conversions: 52,
              },
              {
                period: "Jun 10",
                sessions: 1640,
                pageViews: 4660,
                conversions: 55,
              },
            ],
          },
          geography: [
            { country: "United States", sales: 1250, percentage: 45.2 },
            { country: "Canada", sales: 420, percentage: 15.2 },
            { country: "United Kingdom", sales: 380, percentage: 13.7 },
            { country: "Australia", sales: 290, percentage: 10.5 },
            { country: "Germany", sales: 245, percentage: 8.8 },
            { country: "France", sales: 180, percentage: 6.5 },
          ],
        };
      }

      setAnalytics(analytics);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, [selectedPeriod]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    const isPositive = value >= 0;
    return {
      value: Math.abs(value).toFixed(1),
      isPositive,
      icon: isPositive ? ArrowUpRight : ArrowDownRight,
      color: isPositive ? "text-green-600" : "text-red-600",
    };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-red-600 text-lg font-medium mb-4">
          {error || "No data available"}
        </p>
        <button
          onClick={loadAnalytics}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  const revenueChange = formatPercentage(analytics.revenue.change);
  const RevenueIcon = revenueChange.icon;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Analytics Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Track performance and insights for your business
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {periods.map((period) => (
                <option key={period.value} value={period.value}>
                  {period.label}
                </option>
              ))}
            </select>
            <button
              onClick={loadAnalytics}
              className="flex items-center space-x-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {formatCurrency(analytics.revenue.current)}
              </p>
              <div
                className={`flex items-center mt-2 text-sm ${revenueChange.color}`}
              >
                <RevenueIcon className="h-4 w-4 mr-1" />
                <span className="font-medium">{revenueChange.value}%</span>
                <span className="text-gray-500 ml-1">vs last period</span>
              </div>
            </div>
            <div className="p-3 bg-green-50 rounded-full">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {analytics.orders.total}
              </p>
              <div className="flex items-center mt-2 text-sm">
                <span className="text-green-600 font-medium">
                  {analytics.orders.completed}
                </span>
                <span className="text-gray-500 ml-1">completed</span>
              </div>
            </div>
            <div className="p-3 bg-blue-50 rounded-full">
              <ShoppingCart className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">
                Total Customers
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {analytics.customers.total}
              </p>
              <div className="flex items-center mt-2 text-sm">
                <span className="text-green-600 font-medium">
                  {analytics.customers.new}
                </span>
                <span className="text-gray-500 ml-1">new this period</span>
              </div>
            </div>
            <div className="p-3 bg-purple-50 rounded-full">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">
                Avg Order Value
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {formatCurrency(analytics.orders.avgOrderValue)}
              </p>
              <div className="flex items-center mt-2 text-sm">
                <span className="text-green-600 font-medium">
                  {analytics.customers.retention}%
                </span>
                <span className="text-gray-500 ml-1">retention rate</span>
              </div>
            </div>
            <div className="p-3 bg-orange-50 rounded-full">
              <Target className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Revenue Overview
              </h3>
              <p className="text-sm text-gray-500">
                Daily revenue and order trends
              </p>
            </div>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={analytics.revenue.data}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="period" className="text-sm" />
                <YAxis yAxisId="left" className="text-sm" />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  className="text-sm"
                />
                <Tooltip
                  formatter={(value, name) => [
                    name === "revenue" ? formatCurrency(Number(value)) : value,
                    name === "revenue"
                      ? "Revenue"
                      : name === "orders"
                      ? "Orders"
                      : "Customers",
                  ]}
                  labelStyle={{ color: "#374151" }}
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue"
                  fill="url(#colorRevenue)"
                  stroke="#8B5CF6"
                  strokeWidth={2}
                />
                <Bar yAxisId="right" dataKey="orders" fill="#3B82F6" />
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Sales */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Sales by Category
              </h3>
              <p className="text-sm text-gray-500">
                Product category performance
              </p>
            </div>
            <BarChart3 className="h-5 w-5 text-blue-500" />
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.products.categories}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="sales"
                >
                  {analytics.products.categories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value, "Sales"]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            {analytics.products.categories.map((category, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: category.color }}
                ></div>
                <span className="text-sm text-gray-600">{category.name}</span>
                <span className="text-sm font-medium text-gray-900">
                  {category.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Top Products
              </h3>
              <p className="text-sm text-gray-500">Best performing products</p>
            </div>
            <Award className="h-5 w-5 text-yellow-500" />
          </div>
          <div className="space-y-4">
            {analytics.products.topSelling.map((product, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      #{index + 1}
                    </span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {product.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {product.sales} units sold
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {formatCurrency(product.revenue)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic Analytics */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Website Traffic
              </h3>
              <p className="text-sm text-gray-500">
                Visitor engagement metrics
              </p>
            </div>
            <Activity className="h-5 w-5 text-green-500" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Eye className="h-5 w-5 text-blue-500" />
                <span className="text-sm font-medium text-gray-700">
                  Sessions
                </span>
              </div>
              <span className="font-semibold text-gray-900">
                {analytics.traffic.sessions.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium text-gray-700">
                  Page Views
                </span>
              </div>
              <span className="font-semibold text-gray-900">
                {analytics.traffic.pageViews.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <TrendingDown className="h-5 w-5 text-red-500" />
                <span className="text-sm font-medium text-gray-700">
                  Bounce Rate
                </span>
              </div>
              <span className="font-semibold text-gray-900">
                {analytics.traffic.bounceRate}%
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-purple-500" />
                <span className="text-sm font-medium text-gray-700">
                  Avg Session
                </span>
              </div>
              <span className="font-semibold text-gray-900">
                {analytics.traffic.avgSessionDuration}
              </span>
            </div>
          </div>
        </div>

        {/* Geographic Sales */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Sales by Country
              </h3>
              <p className="text-sm text-gray-500">Geographic distribution</p>
            </div>
            <div className="h-5 w-5 bg-blue-500 rounded"></div>
          </div>
          <div className="space-y-3">
            {analytics.geography.map((country, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      {country.country}
                    </span>
                    <span className="text-sm text-gray-500">
                      {country.percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${country.percentage}%` }}
                    ></div>
                  </div>
                </div>
                <span className="ml-3 text-sm font-semibold text-gray-900">
                  {country.sales}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Inventory Status */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Inventory Status
            </h3>
            <p className="text-sm text-gray-500">
              Stock levels across categories
            </p>
          </div>
          <Package className="h-5 w-5 text-orange-500" />
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analytics.products.inventory}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="category" className="text-sm" />
              <YAxis className="text-sm" />
              <Tooltip />
              <Bar
                dataKey="inStock"
                stackId="a"
                fill="#10B981"
                name="In Stock"
              />
              <Bar
                dataKey="lowStock"
                stackId="a"
                fill="#F59E0B"
                name="Low Stock"
              />
              <Bar
                dataKey="outOfStock"
                stackId="a"
                fill="#EF4444"
                name="Out of Stock"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
