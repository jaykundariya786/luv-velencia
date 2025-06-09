
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { 
  fetchSalesAnalytics, 
  fetchReports, 
  generateReport, 
  downloadReport,
  deleteReport,
  clearError 
} from '../store/slices/analyticsSlice';
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
  Line
} from 'recharts';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Download, 
  FileText,
  Calendar,
  Filter,
  RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

const Analytics: React.FC = () => {
  const dispatch = useAppDispatch();
  const { salesAnalytics, reports, loading, reportGenerating, error } = useAppSelector((state) => state.analytics);

  const [selectedPeriod, setSelectedPeriod] = useState('7days');
  const [reportType, setReportType] = useState('sales');
  const [reportFormat, setReportFormat] = useState('pdf');

  useEffect(() => {
    dispatch(fetchSalesAnalytics({ period: selectedPeriod }));
    dispatch(fetchReports());
  }, [dispatch, selectedPeriod]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleGenerateReport = async () => {
    try {
      await dispatch(generateReport({
        type: reportType,
        period: selectedPeriod,
        format: reportFormat,
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
      })).unwrap();
      toast.success('Report generation started');
    } catch (err: any) {
      toast.error(err || 'Failed to generate report');
    }
  };

  const handleDownloadReport = async (id: string) => {
    try {
      await dispatch(downloadReport(id)).unwrap();
      toast.success('Report download started');
    } catch (err: any) {
      toast.error(err || 'Failed to download report');
    }
  };

  const handleDeleteReport = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      try {
        await dispatch(deleteReport(id)).unwrap();
        toast.success('Report deleted successfully');
      } catch (err: any) {
        toast.error(err || 'Failed to delete report');
      }
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (loading && !salesAnalytics) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-lv-cream to-lv-beige p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-luvvencencia-gradient mb-3 lv-luxury tracking-[0.15em]">
            SALES ANALYTICS & REPORTS
          </h1>
          <p className="text-lv-brown lv-body text-lg font-medium">
            Track performance and generate detailed reports with luxury insights
          </p>
        </div>
        <div className="flex gap-4 mt-4 sm:mt-0">
          <select
            className="admin-input border-lv-brown/20 focus:border-lv-gold focus:ring-lv-gold/20 bg-white/90 backdrop-blur-sm lv-body font-semibold"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="1year">Last Year</option>
          </select>
          <button
            onClick={() => dispatch(fetchSalesAnalytics({ period: selectedPeriod }))}
            className="admin-btn-primary bg-luvvencencia-gradient hover:bg-royal-gradient text-white px-6 py-3 rounded-lg flex items-center gap-2 lv-body font-semibold tracking-wide luxury-transition"
          >
            <RefreshCw className="w-4 h-4" />
            REFRESH
          </button>
        </div>
      </div>

      {salesAnalytics && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="stat-card bg-white/90 backdrop-blur-sm border-lv-brown/10 vintage-shadow royal-hover">
              <div className="flex items-center">
                <div className="p-3 bg-lv-gold/20 rounded-xl">
                  <DollarSign className="w-8 h-8 text-lv-brown" />
                </div>
                <div className="ml-4">
                  <p className="stat-card-title text-lv-brown/70 lv-heading">Total Sales</p>
                  <p className="stat-card-value text-luvvencencia-gradient lv-title">
                    ${salesAnalytics.summary.totalSales.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="stat-card bg-white/90 backdrop-blur-sm border-lv-brown/10 vintage-shadow royal-hover">
              <div className="flex items-center">
                <div className="p-3 bg-lv-brown/20 rounded-xl">
                  <ShoppingCart className="w-8 h-8 text-lv-brown" />
                </div>
                <div className="ml-4">
                  <p className="stat-card-title text-lv-brown/70 lv-heading">Total Orders</p>
                  <p className="stat-card-value text-luvvencencia-gradient lv-title">
                    {salesAnalytics.summary.totalOrders.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="stat-card bg-white/90 backdrop-blur-sm border-lv-brown/10 vintage-shadow royal-hover">
              <div className="flex items-center">
                <div className="p-3 bg-lv-beige/60 rounded-xl">
                  <Users className="w-8 h-8 text-lv-brown" />
                </div>
                <div className="ml-4">
                  <p className="stat-card-title text-lv-brown/70 lv-heading">Total Customers</p>
                  <p className="stat-card-value text-luvvencencia-gradient lv-title">
                    {salesAnalytics.summary.totalCustomers.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="stat-card bg-white/90 backdrop-blur-sm border-lv-brown/10 vintage-shadow royal-hover">
              <div className="flex items-center">
                <div className="p-3 bg-lv-gold/30 rounded-xl">
                  <TrendingUp className="w-8 h-8 text-lv-brown" />
                </div>
                <div className="ml-4">
                  <p className="stat-card-title text-lv-brown/70 lv-heading">Avg Order Value</p>
                  <p className="stat-card-value text-luvvencencia-gradient lv-title">
                    ${salesAnalytics.summary.averageOrderValue.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Sales by Period */}
            <div className="bg-white/90 backdrop-blur-sm p-8 rounded-xl vintage-shadow border-lv-brown/10 royal-hover">
              <h3 className="text-xl font-semibold text-luvvencencia-gradient mb-6 lv-luxury tracking-[0.1em]">SALES TREND</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesAnalytics.salesByPeriod}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="sales" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Category Breakdown */}
            <div className="bg-white/90 backdrop-blur-sm p-8 rounded-xl vintage-shadow border-lv-brown/10 royal-hover">
              <h3 className="text-xl font-semibold text-luvvencencia-gradient mb-6 lv-luxury tracking-[0.1em]">SALES BY CATEGORY</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={salesAnalytics.categoryBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name} ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="sales"
                  >
                    {salesAnalytics.categoryBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Selling Products */}
          <div className="admin-table bg-white/90 backdrop-blur-sm vintage-shadow border-lv-brown/10 mb-8">
            <div className="p-8 border-b border-lv-brown/10">
              <h3 className="text-xl font-semibold text-luvvencencia-gradient lv-luxury tracking-[0.1em]">TOP SELLING PRODUCTS</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-lv-brown/10">
                <thead className="bg-lv-cream/50">
                  <tr>
                    <th className="px-8 py-4 text-left text-xs font-semibold text-lv-brown uppercase tracking-[0.15em] lv-heading">
                      Product
                    </th>
                    <th className="px-8 py-4 text-left text-xs font-semibold text-lv-brown uppercase tracking-[0.15em] lv-heading">
                      Category
                    </th>
                    <th className="px-8 py-4 text-left text-xs font-semibold text-lv-brown uppercase tracking-[0.15em] lv-heading">
                      Units Sold
                    </th>
                    <th className="px-8 py-4 text-left text-xs font-semibold text-lv-brown uppercase tracking-[0.15em] lv-heading">
                      Revenue
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white/50 divide-y divide-lv-brown/10">
                  {salesAnalytics.topSellingProducts.map((product) => (
                    <tr key={product.productId} className="hover:bg-lv-cream/30 luxury-transition">
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="text-sm font-semibold text-lv-brown lv-body">
                          {product.productName}
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="text-sm text-lv-brown/70 capitalize lv-body font-medium">
                          {product.category}
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="text-sm text-lv-brown font-semibold lv-body">
                          {product.unitsSold}
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="text-sm text-lv-brown font-bold lv-title">
                          ${product.revenue.toLocaleString()}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Customer Order History */}
          <div className="admin-table bg-white/90 backdrop-blur-sm vintage-shadow border-lv-brown/10 mb-8">
            <div className="p-8 border-b border-lv-brown/10">
              <h3 className="text-xl font-semibold text-luvvencencia-gradient lv-luxury tracking-[0.1em]">TOP CUSTOMERS</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-lv-brown/10">
                <thead className="bg-lv-cream/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Orders
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Spent
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Avg Order Value
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Order
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {salesAnalytics.userOrderHistory.map((user) => (
                    <tr key={user.userId}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {user.userName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {user.totalOrders}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          ${user.totalSpent.toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          ${user.averageOrderValue.toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(user.lastOrderDate).toLocaleDateString()}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Reports Section */}
      <div className="admin-table bg-white/90 backdrop-blur-sm vintage-shadow border-lv-brown/10">
        <div className="p-8 border-b border-lv-brown/10">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-luvvencencia-gradient lv-luxury tracking-[0.1em]">REPORTS</h3>
            <div className="flex gap-4">
              <select
                className="admin-input border-lv-brown/20 focus:border-lv-gold focus:ring-lv-gold/20 bg-white/90 backdrop-blur-sm lv-body font-semibold text-sm"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
              >
                <option value="sales">Sales Report</option>
                <option value="product-performance">Product Performance</option>
                <option value="customer-analytics">Customer Analytics</option>
                <option value="inventory">Inventory Report</option>
              </select>
              <select
                className="admin-input border-lv-brown/20 focus:border-lv-gold focus:ring-lv-gold/20 bg-white/90 backdrop-blur-sm lv-body font-semibold text-sm"
                value={reportFormat}
                onChange={(e) => setReportFormat(e.target.value)}
              >
                <option value="pdf">PDF</option>
                <option value="csv">CSV</option>
                <option value="xlsx">Excel</option>
              </select>
              <button
                onClick={handleGenerateReport}
                disabled={reportGenerating}
                className="admin-btn-gold bg-lv-gold hover:bg-lv-gold/80 disabled:bg-lv-brown/30 text-lv-brown px-6 py-3 rounded-lg flex items-center gap-2 lv-body font-semibold tracking-wide luxury-transition"
              >
                {reportGenerating ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <FileText className="w-4 h-4" />
                )}
                GENERATE REPORT
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Report
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Generated
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reports.map((report) => (
                <tr key={report.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {report.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 capitalize">
                      {report.type.replace('-', ' ')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(report.generatedAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      report.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : report.status === 'generating'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      {report.status === 'completed' && (
                        <button
                          onClick={() => handleDownloadReport(report.id.toString())}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteReport(report.id.toString())}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {reports.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No reports generated</h3>
            <p className="mt-1 text-sm text-gray-500">
              Generate your first report to see analytics data.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;
