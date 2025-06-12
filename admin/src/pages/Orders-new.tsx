import React, { useEffect, useState } from 'react';
import { 
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck
} from 'lucide-react';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import apiService from '../services/api';

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
    sku?: string;
  }>;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  status: string;
  paymentStatus: string;
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
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalOrders: 0,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 20
  });

  const statusOptions = [
    { value: 'pending', label: 'Pending', icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { value: 'confirmed', label: 'Confirmed', icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-100' },
    { value: 'processing', label: 'Processing', icon: Package, color: 'text-blue-600', bg: 'bg-blue-100' },
    { value: 'shipped', label: 'Shipped', icon: Truck, color: 'text-purple-600', bg: 'bg-purple-100' },
    { value: 'delivered', label: 'Delivered', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
    { value: 'cancelled', label: 'Cancelled', icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' }
  ];

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiService.getOrders({
        page: currentPage,
        limit: 20,
        status: statusFilter || undefined
      });
      
      if (response.success && response.data) {
        const transformedOrders: OrderData[] = response.data.orders.map((order: any) => ({
          id: order._id,
          orderNumber: order.orderNumber || `ORD-${order._id.slice(-6)}`,
          customer: {
            id: order.user?._id || '',
            name: `${order.user?.firstName || ''} ${order.user?.lastName || ''}`.trim() || 'Unknown Customer',
            email: order.user?.email || '',
            phone: order.user?.phone || '',
            avatar: order.user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(order.user?.firstName || 'U')}&background=random`
          },
          items: order.items?.map((item: any, index: number) => ({
            id: item._id || index.toString(),
            productId: item.product?._id || '',
            name: item.product?.name || item.name || 'Unknown Product',
            image: item.product?.images?.[0] || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100&h=100&fit=crop',
            price: item.price || 0,
            quantity: item.quantity || 1,
            size: item.variant?.size || item.size || 'N/A',
            color: item.variant?.color || item.color || 'N/A',
            sku: item.product?.sku || item.sku || 'N/A'
          })) || [],
          subtotal: order.subtotal || 0,
          tax: order.tax || 0,
          shipping: order.shipping || 0,
          discount: order.discount || 0,
          total: order.total || 0,
          status: order.status || 'pending',
          paymentStatus: order.paymentStatus || 'pending',
          paymentMethod: order.paymentMethod || 'N/A',
          shippingAddress: order.shippingAddress || {
            street: 'N/A',
            city: 'N/A',
            state: 'N/A',
            zipCode: 'N/A',
            country: 'N/A'
          },
          billingAddress: order.billingAddress || order.shippingAddress || {
            street: 'N/A',
            city: 'N/A',
            state: 'N/A',
            zipCode: 'N/A',
            country: 'N/A'
          },
          trackingNumber: order.trackingNumber || '',
          estimatedDelivery: order.estimatedDelivery ? new Date(order.estimatedDelivery).toISOString().split('T')[0] : '',
          notes: order.notes || '',
          createdAt: order.createdAt || new Date().toISOString(),
          updatedAt: order.updatedAt || new Date().toISOString()
        }));

        setOrders(transformedOrders);
        setPagination(response.data.pagination);
      } else {
        throw new Error(response.message || 'Failed to fetch orders');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [currentPage, statusFilter]);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      const response = await apiService.updateOrderStatus(orderId, newStatus);
      if (response.success) {
        await loadOrders();
        toast.success('Order status updated successfully');
      } else {
        throw new Error(response.message || 'Failed to update order status');
      }
    } catch (err) {
      toast.error('Failed to update order status');
    }
  };

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

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={loadOrders}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Orders Management
          </h1>
          <p className="text-gray-600 mt-2">Manage and track customer orders</p>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Statuses</option>
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Orders ({pagination.totalOrders})</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {order.orderNumber}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.items.length} items
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            className="h-8 w-8 rounded-full"
                            src={order.customer.avatar}
                            alt=""
                          />
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {order.customer.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {order.customer.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${order.total.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Page {pagination.currentPage} of {pagination.totalPages}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                  className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                  className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;