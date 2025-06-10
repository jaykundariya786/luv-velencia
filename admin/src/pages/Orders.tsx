import React, { useEffect, useState } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  FileText,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Download,
  RefreshCw,
  Calendar,
  DollarSign,
  User,
  MapPin,
  Phone,
  Mail,
  Edit,
  MoreVertical,
  ArrowUpRight,
  AlertTriangle,
  TrendingUp,
  ShoppingCart,
  BarChart3,
  Bell
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import { getDocuments, updateDocument } from '../lib/firebase';

interface OrderData {
  id: string;
  orderNumber: string;
  customer: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
  };
  items: Array<{
    id: string;
    productId: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
    size?: string;
    color?: string;
    sku: string;
  }>;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  billingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  trackingNumber?: string;
  estimatedDelivery?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  const statusOptions = [
    { value: 'pending', label: 'Pending', icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { value: 'processing', label: 'Processing', icon: Package, color: 'text-blue-600', bg: 'bg-blue-100' },
    { value: 'shipped', label: 'Shipped', icon: Truck, color: 'text-purple-600', bg: 'bg-purple-100' },
    { value: 'delivered', label: 'Delivered', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
    { value: 'cancelled', label: 'Cancelled', icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' },
    { value: 'refunded', label: 'Refunded', icon: ArrowUpRight, color: 'text-gray-600', bg: 'bg-gray-100' }
  ];

  const paymentStatusOptions = [
    { value: 'pending', label: 'Pending', color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { value: 'paid', label: 'Paid', color: 'text-green-600', bg: 'bg-green-100' },
    { value: 'failed', label: 'Failed', color: 'text-red-600', bg: 'bg-red-100' },
    { value: 'refunded', label: 'Refunded', color: 'text-gray-600', bg: 'bg-gray-100' }
  ];

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      // Comprehensive order data
      const mockOrders: OrderData[] = [
        {
          id: '1',
          orderNumber: 'ORD-2024-001',
          customer: {
            id: '1',
            name: 'Sarah Johnson',
            email: 'sarah.johnson@email.com',
            phone: '+1 (555) 123-4567',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=center'
          },
          items: [
            {
              id: '1',
              productId: '1',
              name: 'Premium Silk Evening Dress',
              image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=100&h=100&fit=crop',
              price: 299.99,
              quantity: 1,
              size: 'M',
              color: 'Black',
              sku: 'SED-001'
            },
            {
              id: '2',
              productId: '4',
              name: 'Cashmere Winter Sweater',
              image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=100&h=100&fit=crop',
              price: 129.99,
              quantity: 2,
              size: 'L',
              color: 'Cream',
              sku: 'CWS-004'
            }
          ],
          subtotal: 559.97,
          tax: 44.80,
          shipping: 15.00,
          discount: 30.00,
          total: 589.77,
          status: 'delivered',
          paymentStatus: 'paid',
          paymentMethod: 'Credit Card ****1234',
          shippingAddress: {
            street: '123 Main Street, Apt 4B',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'United States'
          },
          billingAddress: {
            street: '123 Main Street, Apt 4B',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'United States'
          },
          trackingNumber: 'TRK123456789',
          estimatedDelivery: '2024-06-12',
          notes: 'Please leave at door if not home',
          createdAt: '2024-06-08T10:30:00Z',
          updatedAt: '2024-06-10T15:45:00Z'
        },
        {
          id: '2',
          orderNumber: 'ORD-2024-002',
          customer: {
            id: '2',
            name: 'Michael Chen',
            email: 'michael.chen@email.com',
            phone: '+1 (555) 234-5678',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=center'
          },
          items: [
            {
              id: '3',
              productId: '2',
              name: 'Designer Leather Handbag',
              image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=100&h=100&fit=crop',
              price: 189.99,
              quantity: 1,
              color: 'Brown',
              sku: 'DLH-002'
            }
          ],
          subtotal: 189.99,
          tax: 15.20,
          shipping: 12.00,
          discount: 0,
          total: 217.19,
          status: 'processing',
          paymentStatus: 'paid',
          paymentMethod: 'PayPal',
          shippingAddress: {
            street: '456 Oak Avenue',
            city: 'Los Angeles',
            state: 'CA',
            zipCode: '90210',
            country: 'United States'
          },
          billingAddress: {
            street: '456 Oak Avenue',
            city: 'Los Angeles',
            state: 'CA',
            zipCode: '90210',
            country: 'United States'
          },
          estimatedDelivery: '2024-06-15',
          createdAt: '2024-06-10T08:15:00Z',
          updatedAt: '2024-06-10T09:30:00Z'
        },
        {
          id: '3',
          orderNumber: 'ORD-2024-003',
          customer: {
            id: '7',
            name: 'Sophie Martin',
            email: 'sophie.martin@email.com',
            phone: '+1 (555) 789-0123',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=center'
          },
          items: [
            {
              id: '4',
              productId: '3',
              name: 'Luxury Swiss Watch',
              image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop',
              price: 599.99,
              quantity: 1,
              color: 'Silver',
              sku: 'LSW-003'
            },
            {
              id: '5',
              productId: '6',
              name: 'Italian Leather Ankle Boots',
              image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5b?w=100&h=100&fit=crop',
              price: 159.99,
              quantity: 1,
              size: '8',
              color: 'Black',
              sku: 'ILB-006'
            }
          ],
          subtotal: 759.98,
          tax: 60.80,
          shipping: 20.00,
          discount: 75.99,
          total: 764.79,
          status: 'shipped',
          paymentStatus: 'paid',
          paymentMethod: 'Credit Card ****5678',
          shippingAddress: {
            street: '789 Elm Street',
            city: 'Boston',
            state: 'MA',
            zipCode: '02101',
            country: 'United States'
          },
          billingAddress: {
            street: '789 Elm Street',
            city: 'Boston',
            state: 'MA',
            zipCode: '02101',
            country: 'United States'
          },
          trackingNumber: 'TRK987654321',
          estimatedDelivery: '2024-06-14',
          createdAt: '2024-06-09T14:20:00Z',
          updatedAt: '2024-06-10T11:00:00Z'
        },
        {
          id: '4',
          orderNumber: 'ORD-2024-004',
          customer: {
            id: '4',
            name: 'James Wilson',
            email: 'james.wilson@email.com',
            phone: '+1 (555) 456-7890',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=center'
          },
          items: [
            {
              id: '6',
              productId: '5',
              name: 'Pearl Statement Necklace',
              image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=100&h=100&fit=crop',
              price: 79.99,
              quantity: 1,
              size: '18"',
              color: 'White',
              sku: 'PSN-005'
            }
          ],
          subtotal: 79.99,
          tax: 6.40,
          shipping: 8.00,
          discount: 0,
          total: 94.39,
          status: 'pending',
          paymentStatus: 'pending',
          paymentMethod: 'Credit Card ****9012',
          shippingAddress: {
            street: '321 Pine Road',
            city: 'Miami',
            state: 'FL',
            zipCode: '33101',
            country: 'United States'
          },
          billingAddress: {
            street: '321 Pine Road',
            city: 'Miami',
            state: 'FL',
            zipCode: '33101',
            country: 'United States'
          },
          estimatedDelivery: '2024-06-18',
          createdAt: '2024-06-10T16:45:00Z',
          updatedAt: '2024-06-10T16:45:00Z'
        },
        {
          id: '5',
          orderNumber: 'ORD-2024-005',
          customer: {
            id: '6',
            name: 'David Rodriguez',
            email: 'david.rodriguez@email.com',
            phone: '+1 (555) 678-9012',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=center'
          },
          items: [
            {
              id: '7',
              productId: '1',
              name: 'Premium Silk Evening Dress',
              image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=100&h=100&fit=crop',
              price: 299.99,
              quantity: 1,
              size: 'L',
              color: 'Navy',
              sku: 'SED-001'
            }
          ],
          subtotal: 299.99,
          tax: 24.00,
          shipping: 15.00,
          discount: 0,
          total: 338.99,
          status: 'cancelled',
          paymentStatus: 'refunded',
          paymentMethod: 'Credit Card ****3456',
          shippingAddress: {
            street: '654 Cedar Lane',
            city: 'Austin',
            state: 'TX',
            zipCode: '73301',
            country: 'United States'
          },
          billingAddress: {
            street: '654 Cedar Lane',
            city: 'Austin',
            state: 'TX',
            zipCode: '73301',
            country: 'United States'
          },
          notes: 'Customer requested cancellation - wrong size',
          createdAt: '2024-06-07T12:30:00Z',
          updatedAt: '2024-06-08T09:15:00Z'
        }
      ];

      setOrders(mockOrders);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const getStatusBadge = (status: string) => {
    const statusOption = statusOptions.find(option => option.value === status);
    if (!statusOption) return null;
    
    const Icon = statusOption.icon;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusOption.bg} ${statusOption.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {statusOption.label}
      </span>
    );
  };

  const getPaymentStatusBadge = (status: string) => {
    const statusOption = paymentStatusOptions.find(option => option.value === status);
    if (!statusOption) return null;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusOption.bg} ${statusOption.color}`}>
        {statusOption.label}
      </span>
    );
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      const updatedOrders = orders.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus as any, updatedAt: new Date().toISOString() }
          : order
      );
      setOrders(updatedOrders);
      toast.success('Order status updated successfully');
    } catch (err) {
      toast.error('Failed to update order status');
    }
  };

  const handleExportOrders = () => {
    const csvContent = [
      ['Order Number', 'Customer', 'Email', 'Total', 'Status', 'Date'],
      ...orders.map(order => [
        order.orderNumber,
        order.customer.name,
        order.customer.email,
        order.total.toString(),
        order.status,
        new Date(order.createdAt).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Orders exported successfully!');
  };

  const handlePrintInvoice = (order: OrderData) => {
    const invoiceWindow = window.open('', '_blank');
    if (invoiceWindow) {
      invoiceWindow.document.write(`
        <html>
          <head>
            <title>Invoice - ${order.orderNumber}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; }
              .details { margin: 20px 0; }
              .items { width: 100%; border-collapse: collapse; margin: 20px 0; }
              .items th, .items td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              .items th { background-color: #f2f2f2; }
              .total { text-align: right; font-weight: bold; font-size: 18px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>LUV VALENCIA</h1>
              <h2>Invoice</h2>
              <p>Order: ${order.orderNumber}</p>
            </div>
            <div class="details">
              <p><strong>Customer:</strong> ${order.customer.name}</p>
              <p><strong>Email:</strong> ${order.customer.email}</p>
              <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            <table class="items">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${order.items.map(item => `
                  <tr>
                    <td>${item.name}</td>
                    <td>${item.quantity}</td>
                    <td>$${item.price}</td>
                    <td>$${(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            <div class="total">
              <p>Subtotal: $${order.subtotal.toFixed(2)}</p>
              <p>Tax: $${order.tax.toFixed(2)}</p>
              <p>Shipping: $${order.shipping.toFixed(2)}</p>
              <p>Total: $${order.total.toFixed(2)}</p>
            </div>
          </body>
        </html>
      `);
      invoiceWindow.document.close();
      invoiceWindow.print();
    }
  };

  const handleSendNotification = (order: OrderData) => {
    toast.success(`Notification sent to ${order.customer.name} about order ${order.orderNumber}`);
  };

  const handleTrackOrder = (order: OrderData) => {
    if (order.trackingNumber) {
      toast.success(`Tracking order ${order.orderNumber} with tracking number: ${order.trackingNumber}`);
    } else {
      toast.error('No tracking number available for this order');
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesPayment = paymentFilter === 'all' || order.paymentStatus === paymentFilter;
    return matchesSearch && matchesStatus && matchesPayment;
  });

  const totalPages = Math.ceil(filteredOrders.length / pageSize);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    totalRevenue: orders.reduce((sum, order) => sum + order.total, 0)
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-red-600 text-lg font-medium mb-4">{error}</p>
        <button 
          onClick={loadOrders}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
            <p className="text-gray-600 mt-1">Track and manage customer orders</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={loadOrders}
              className="flex items-center space-x-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-200 hover:shadow-md"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </button>
            <button 
              onClick={handleExportOrders}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 hover:shadow-md"
            >
              <Download className="h-4 w-4" />
              <span>Export CSV</span>
            </button>
            <button 
              onClick={() => toast.success('Order analytics feature coming soon!')}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200 hover:shadow-md"
            >
              <BarChart3 className="h-4 w-4" />
              <span>Analytics</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <ShoppingCart className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Processing</p>
              <p className="text-2xl font-bold text-blue-600">{stats.processing}</p>
            </div>
            <Package className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Shipped</p>
              <p className="text-2xl font-bold text-purple-600">{stats.shipped}</p>
            </div>
            <Truck className="h-8 w-8 text-purple-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Delivered</p>
              <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Revenue</p>
              <p className="text-2xl font-bold text-green-600">${stats.totalRevenue.toLocaleString()}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Payments</option>
              {paymentStatusOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{order.orderNumber}</div>
                      {order.trackingNumber && (
                        <div className="text-xs text-gray-500">Track: {order.trackingNumber}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {order.customer.avatar ? (
                        <img
                          className="h-8 w-8 rounded-full mr-3"
                          src={order.customer.avatar}
                          alt={order.customer.name}
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center mr-3">
                          <User className="h-4 w-4 text-gray-600" />
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">{order.customer.name}</div>
                        <div className="text-sm text-gray-500">{order.customer.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex -space-x-2">
                        {order.items.slice(0, 3).map((item, index) => (
                          <img
                            key={index}
                            className="h-8 w-8 rounded border-2 border-white object-cover"
                            src={item.image}
                            alt={item.name}
                            title={item.name}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">${order.total.toFixed(2)}</div>
                    {order.discount > 0 && (
                      <div className="text-xs text-green-600">-${order.discount.toFixed(2)} discount</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {getStatusBadge(order.status)}
                      {order.estimatedDelivery && order.status !== 'delivered' && order.status !== 'cancelled' && (
                        <div className="text-xs text-gray-500">
                          Est: {new Date(order.estimatedDelivery).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {getPaymentStatusBadge(order.paymentStatus)}
                      <div className="text-xs text-gray-500">{order.paymentMethod}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => toast.success(`Viewing details for order ${order.orderNumber}`)}
                        className="text-blue-600 hover:text-blue-900 p-1 transition-colors"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                        className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                      >
                        {statusOptions.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => handlePrintInvoice(order)}
                        className="text-green-600 hover:text-green-900 p-1 transition-colors"
                        title="Print Invoice"
                      >
                        <FileText className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleTrackOrder(order)}
                        className="text-purple-600 hover:text-purple-900 p-1 transition-colors"
                        title="Track Order"
                      >
                        <Truck className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleSendNotification(order)}
                        className="text-orange-600 hover:text-orange-900 p-1 transition-colors"
                        title="Send Notification"
                      >
                        <Bell className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, filteredOrders.length)} of {filteredOrders.length} results
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 text-sm border rounded ${
                      currentPage === page
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;