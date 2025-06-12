import React, { useEffect, useState } from "react";
import {
  TrendingUp,
  ShoppingCart,
  Users,
  Package,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  BarChart3,
  Plus,
  Eye,
  RefreshCw,
  Star,
  Clock,
  Filter,
  Download,
  Bell,
  Activity,
  TrendingDown,
  Award,
  Target,
} from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";
import { Link } from "react-router-dom";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import apiService from "../services/api";

interface DashboardData {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  revenueChange: number;
  ordersChange: number;
  customersChange: number;
  productsChange: number;
  recentOrders: any[];
  topProducts: any[];
  monthlyRevenue: any[];
  ordersByStatus: any[];
  salesByCategory: any[];
}

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    revenueChange: 0,
    ordersChange: 0,
    customersChange: 0,
    productsChange: 0,
    recentOrders: [],
    topProducts: [],
    monthlyRevenue: [],
    ordersByStatus: [],
    salesByCategory: [],
  });

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      try {
        // Fetch real data from LV Backend API
        const response = await apiService.getDashboardData();

        if (response.success && response.data) {
          const apiData = response.data;

          // Transform API data to match component interface
          const transformedData: DashboardData = {
            totalRevenue: apiData.overview.totalRevenue,
            totalOrders: apiData.overview.totalOrders,
            totalCustomers: apiData.overview.totalUsers,
            totalProducts: apiData.overview.totalProducts,
            revenueChange: 0, // Calculate based on previous period data
            ordersChange: 0, // Calculate based on previous period data
            customersChange: 0, // Calculate based on previous period data
            productsChange: 0, // Calculate based on previous period data
            recentOrders: apiData.recentOrders.map((order: any) => ({
              id: order._id || order.orderNumber,
              customer:
                `${order.user?.firstName || ""} ${
                  order.user?.lastName || ""
                }`.trim() || "Unknown Customer",
              email: order.user?.email || "",
              total: order.total,
              status: order.status,
              date: new Date(order.createdAt).toISOString().split("T")[0],
              items: order.items?.length || 0,
            })),
            topProducts: apiData.topProducts.map((product: any) => ({
              id: product._id,
              name: product.name,
              sales: product.totalSold,
              revenue: product.totalRevenue,
              image:
                product.product?.images?.[0] ||
                "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100&h=100&fit=crop",
            })),
            monthlyRevenue: [], // Will be populated from analytics API
            ordersByStatus: [
              {
                name: "Pending",
                value: apiData.orderStatus.pending,
                color: "#F59E0B",
              },
              {
                name: "Confirmed",
                value: apiData.orderStatus.confirmed,
                color: "#3B82F6",
              },
              {
                name: "Shipped",
                value: apiData.orderStatus.shipped,
                color: "#8B5CF6",
              },
              {
                name: "Delivered",
                value: apiData.orderStatus.delivered,
                color: "#10B981",
              },
              {
                name: "Cancelled",
                value: apiData.orderStatus.cancelled,
                color: "#EF4444",
              },
            ],
            salesByCategory: [], // Will be populated from analytics API
          };

          setDashboardData(transformedData);
        } else {
          throw new Error(response.message || "Failed to fetch dashboard data");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load dashboard data"
        );
      } finally {
        setLoading(false);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load dashboard data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

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
      bgColor: isPositive ? "bg-green-50" : "bg-red-50",
    };
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      delivered: {
        bg: "bg-green-100",
        text: "text-green-800",
        dot: "bg-green-500",
      },
      processing: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        dot: "bg-yellow-500",
      },
      shipped: { bg: "bg-blue-100", text: "text-blue-800", dot: "bg-blue-500" },
      pending: { bg: "bg-red-100", text: "text-red-800", dot: "bg-red-500" },
    };
    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${config.dot} mr-1.5`}
        ></span>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <div className="text-red-600 text-lg font-medium text-center px-4">
          {error}
        </div>
        <button
          onClick={loadDashboardData}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Retry</span>
        </button>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Revenue",
      value: formatCurrency(dashboardData.totalRevenue),
      change: dashboardData.revenueChange,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
      description: "Total sales revenue",
    },
    {
      title: "Total Orders",
      value: dashboardData.totalOrders.toLocaleString(),
      change: dashboardData.ordersChange,
      icon: ShoppingCart,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      description: "Orders this month",
    },
    {
      title: "Total Customers",
      value: dashboardData.totalCustomers.toLocaleString(),
      change: dashboardData.customersChange,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      description: "Active customers",
    },
    {
      title: "Total Products",
      value: dashboardData.totalProducts.toLocaleString(),
      change: dashboardData.productsChange,
      icon: Package,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      description: "Products in catalog",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                LUV VALENCIA DASHBOARD
              </h1>
              <p className="mt-2 text-sm sm:text-base text-gray-600">
                Welcome to your luxury store management center
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <button
                onClick={loadDashboardData}
                className="flex items-center space-x-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {statCards.map((stat, index) => {
            const changeData = formatPercentage(stat.change);
            const Icon = stat.icon;
            const ChangeIcon = changeData.icon;

            return (
              <div
                key={stat.title}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide">
                      {stat.title}
                    </p>
                    <p className="mt-2 text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                    <div
                      className={`mt-2 flex items-center space-x-1 text-xs sm:text-sm ${changeData.color}`}
                    >
                      <ChangeIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="font-medium">{changeData.value}%</span>
                      <span className="text-gray-500">from last month</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {stat.description}
                    </p>
                  </div>
                  <div className={`p-2 sm:p-3 rounded-full ${stat.bgColor}`}>
                    <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.color}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Revenue Trend
                </h3>
                <p className="text-sm text-gray-500">
                  Monthly revenue overview
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium text-green-600">
                  +12.5%
                </span>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dashboardData.monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="month" className="text-sm" />
                  <YAxis className="text-sm" />
                  <Tooltip
                    formatter={(value) => [
                      formatCurrency(Number(value)),
                      "Revenue",
                    ]}
                    labelStyle={{ color: "#374151" }}
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#8B5CF6"
                    fill="url(#colorRevenue)"
                    strokeWidth={2}
                  />
                  <defs>
                    <linearGradient
                      id="colorRevenue"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                      <stop
                        offset="95%"
                        stopColor="#8B5CF6"
                        stopOpacity={0.05}
                      />
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Orders by Status */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Orders by Status
                </h3>
                <p className="text-sm text-gray-500">
                  Current order distribution
                </p>
              </div>
              <Activity className="h-5 w-5 text-blue-500" />
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dashboardData.ordersByStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {dashboardData.ordersByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {dashboardData.ordersByStatus.map((status, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: status.color }}
                  ></div>
                  <span className="text-sm text-gray-600">{status.name}</span>
                  <span className="text-sm font-medium text-gray-900">
                    {status.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Orders */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Recent Orders
                  </h3>
                  <p className="text-sm text-gray-500">
                    Latest customer orders
                  </p>
                </div>
                <Link
                  to="/orders"
                  className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  <span>View all</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {dashboardData.recentOrders.map((order, index) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {order.customer
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {order.customer}
                        </p>
                        <p className="text-sm text-gray-500">{order.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(order.total)}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        {getStatusBadge(order.status)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Top Products
                  </h3>
                  <p className="text-sm text-gray-500">Best selling items</p>
                </div>
                <Award className="h-5 w-5 text-yellow-500" />
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {dashboardData.topProducts.map((product, index) => (
                  <div key={index} className="flex items-center space-x-4">
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
                        {product.sales} sales
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
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Link
              to="/products/new"
              className="flex flex-col items-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg hover:from-blue-100 hover:to-blue-200 transition-all duration-200"
            >
              <Plus className="h-8 w-8 text-blue-600 mb-2" />
              <span className="text-sm font-medium text-blue-900">
                Add Product
              </span>
            </Link>
            <Link
              to="/orders"
              className="flex flex-col items-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg hover:from-green-100 hover:to-green-200 transition-all duration-200"
            >
              <Eye className="h-8 w-8 text-green-600 mb-2" />
              <span className="text-sm font-medium text-green-900">
                View Orders
              </span>
            </Link>
            <Link
              to="/users"
              className="flex flex-col items-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg hover:from-purple-100 hover:to-purple-200 transition-all duration-200"
            >
              <Users className="h-8 w-8 text-purple-600 mb-2" />
              <span className="text-sm font-medium text-purple-900">
                Manage Users
              </span>
            </Link>
            <Link
              to="/analytics"
              className="flex flex-col items-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg hover:from-orange-100 hover:to-orange-200 transition-all duration-200"
            >
              <BarChart3 className="h-8 w-8 text-orange-600 mb-2" />
              <span className="text-sm font-medium text-orange-900">
                Analytics
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
