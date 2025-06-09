
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { 
  fetchOrders, 
  updateOrderStatus,
  generateBill,
  clearError 
} from '../store/slices/ordersSlice';
import { 
  Search, 
  Filter, 
  Eye, 
  FileText,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck
} from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import AdvancedFilters from '../components/AdvancedFilters';
import useDebounce from '../hooks/useDebounce';
import LoadingSpinner from '../components/LoadingSpinner';

const statusOptions = [
  { value: 'pending', label: 'Pending', icon: Clock, color: 'badge-warning' },
  { value: 'processing', label: 'Processing', icon: Package, color: 'badge-info' },
  { value: 'shipped', label: 'Shipped', icon: Truck, color: 'badge-info' },
  { value: 'delivered', label: 'Delivered', icon: CheckCircle, color: 'badge-success' },
  { value: 'cancelled', label: 'Cancelled', icon: XCircle, color: 'badge-danger' },
];

const Orders: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { orders, loading, error, total } = useAppSelector((state) => state.orders);
  
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchOrders({ search, status, page, limit: 10 }));
  }, [dispatch, search, status, page]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleStatusFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value);
    setPage(1);
  };

  const handleStatusUpdate = async (orderId: number, newStatus: string) => {
    try {
      const result = await dispatch(updateOrderStatus({ id: orderId.toString(), status: newStatus }));
      if (updateOrderStatus.fulfilled.match(result)) {
        toast.success('Order status updated successfully');
      }
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const handleGenerateBill = async (orderId: number) => {
    try {
      const result = await dispatch(generateBill(orderId.toString()));
      if (generateBill.fulfilled.match(result)) {
        // Create blob URL and trigger download
        const blob = new Blob([result.payload], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `order-${orderId}-bill.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        toast.success('Bill downloaded successfully');
      }
    } catch (error) {
      toast.error('Failed to generate bill');
    }
  };

  const getStatusDisplay = (orderStatus: string) => {
    const statusOption = statusOptions.find(option => option.value === orderStatus);
    return statusOption || statusOptions[0];
  };

  if (loading && !orders.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="mt-2 text-gray-600">Manage customer orders and delivery status</p>
        </div>
        <div className="flex space-x-2">
          <button className="btn btn-secondary">
            <FileText className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="card-content p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={search}
                  onChange={handleSearch}
                  className="form-input pl-10"
                />
              </div>
            </div>
            <select
              value={status}
              onChange={handleStatusFilter}
              className="form-select"
            >
              <option value="">All Status</option>
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button className="btn btn-secondary">
              <Filter className="h-4 w-4 mr-2" />
              Date Range
            </button>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th className="table-head">Order</th>
                <th className="table-head">Customer</th>
                <th className="table-head">Items</th>
                <th className="table-head">Total</th>
                <th className="table-head">Status</th>
                <th className="table-head">Date</th>
                <th className="table-head">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const statusDisplay = getStatusDisplay(order.status);
                const StatusIcon = statusDisplay.icon;
                
                return (
                  <tr key={order.id} className="table-row">
                    <td className="table-cell">
                      <div className="font-medium text-gray-900">
                        #{order.id}
                      </div>
                    </td>
                    <td className="table-cell">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {order.user?.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.user?.email}
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="text-sm text-gray-900">
                        {order.items?.length || 0} items
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.items?.slice(0, 2).map(item => item.product?.name).join(', ')}
                        {order.items?.length > 2 && '...'}
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="text-sm font-medium text-gray-900">
                        ${order.total}
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                          className="form-select text-xs px-2 py-1 w-auto"
                        >
                          {statusOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="text-sm text-gray-900">
                        {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                      </div>
                      <div className="text-sm text-gray-500">
                        {format(new Date(order.createdAt), 'HH:mm')}
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => navigate(`/orders/${order.id}`)}
                          className="btn btn-secondary text-xs px-2 py-1"
                          title="View Details"
                        >
                          <Eye className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => handleGenerateBill(order.id)}
                          className="btn btn-primary text-xs px-2 py-1"
                          title="Generate Bill"
                        >
                          <FileText className="h-3 w-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {total > 10 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {((page - 1) * 10) + 1} to {Math.min(page * 10, total)} of {total} results
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="btn btn-secondary text-xs px-3 py-1 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page * 10 >= total}
                  className="btn btn-secondary text-xs px-3 py-1 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Empty State */}
      {!loading && orders.length === 0 && (
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {search || status ? 'Try adjusting your search or filter criteria.' : 'Orders will appear here when customers place them.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default Orders;
