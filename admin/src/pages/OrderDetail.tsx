import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchOrder, updateOrderStatus, generateBill } from '../store/slices/ordersSlice';
import { 
  ArrowLeft, 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Truck, 
  User, 
  MapPin, 
  CreditCard,
  FileText,
  Receipt
} from 'lucide-react';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import InvoiceGenerator from '../components/InvoiceGenerator';
import DeliveryTracker from '../components/DeliveryTracker';

const OrderDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentOrder, loading, error } = useAppSelector((state) => state.orders);
  const { toast } = useToast();
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (id) {
      loadOrder(id);
    }
  }, [dispatch, id]);

  const loadOrder = async (orderId: string) => {
    try {
      await dispatch(fetchOrder(orderId)).unwrap();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err || 'Failed to load order',
        variant: "destructive",
      });
      navigate('/orders');
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    if (!id) return;

    setUpdating(true);
    try {
      await dispatch(updateOrderStatus({ orderId: id, status: newStatus })).unwrap();
      toast({
        title: "Success",
        description: `Order status updated to ${newStatus}`,
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err || 'Failed to update order status',
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handlePrintBill = () => {
    if (!currentOrder) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const billHTML = generateBillHTML(currentOrder);
    printWindow.document.write(billHTML);
    printWindow.document.close();
    printWindow.print();
    toast({
      title: "Success",
      description: 'Bill printed successfully',
    });
  };

  const generateBillHTML = (order: any) => {
    const subtotal = order.items?.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0) || 0;
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Order Bill - ${order.id}</title>
        <style>
          body { font-family: 'Helvetica Neue', Arial, sans-serif; margin: 20px; color: #333; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #125737; padding-bottom: 20px; }
          .header h1 { color: #125737; font-size: 28px; margin: 0; }
          .header h2 { color: #666; font-size: 18px; margin: 5px 0 0 0; }
          .order-info { margin-bottom: 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
          .info-section { background: #f8f9fa; padding: 15px; border-radius: 8px; }
          .info-section h3 { margin: 0 0 10px 0; color: #125737; font-size: 16px; }
          .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
          .items-table th, .items-table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
          .items-table th { background: linear-gradient(135deg, #125737 0%, #1a6b47 100%); color: white; font-weight: 600; }
          .items-table tr:nth-child(even) { background-color: #f8f9fa; }
          .total-section { text-align: right; background: #f8f9fa; padding: 20px; border-radius: 8px; margin-top: 20px; }
          .total-row { font-weight: bold; font-size: 18px; color: #125737; border-top: 2px solid #125737; padding-top: 10px; margin-top: 10px; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>LUV VELENCIA</h1>
          <h2>Order Bill</h2>
        </div>
        <div class="order-info">
          <div class="info-section">
            <h3>Order Information</h3>
            <p><strong>Order ID:</strong> ${order.id}</p>
            <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
            <p><strong>Status:</strong> ${order.status}</p>
          </div>
          <div class="info-section">
            <h3>Customer Information</h3>
            <p><strong>Name:</strong> ${order.user?.name || 'N/A'}</p>
            <p><strong>Email:</strong> ${order.user?.email || 'N/A'}</p>
            <p><strong>Phone:</strong> ${order.user?.phone || 'N/A'}</p>
          </div>
        </div>
        <table class="items-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${order.items?.map((item: any) => `
              <tr>
                <td>${item.product?.name || 'Unknown Product'}</td>
                <td>$${item.price}</td>
                <td>${item.quantity}</td>
                <td>$${(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            `).join('') || '<tr><td colspan="4">No items found</td></tr>'}
          </tbody>
        </table>
        <div class="total-section">
          <p>Subtotal: $${subtotal.toFixed(2)}</p>
          <p>Tax (10%): $${tax.toFixed(2)}</p>
          <p class="total-row">Total: $${total.toFixed(2)}</p>
        </div>
        <div class="footer">
          <p>Thank you for shopping with LUV VELENCIA</p>
          <p>For any queries, please contact us at support@luvvelencia.com</p>
        </div>
      </body>
      </html>
    `;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'shipped': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-300';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
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
          onClick={() => navigate('/orders')}
          className="px-4 py-2 bg-admin-primary text-white rounded-lg hover:bg-admin-primary/90 transition-colors"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  if (!currentOrder) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Package className="h-16 w-16 text-gray-400 mb-4" />
        <p className="text-gray-600 text-lg font-medium mb-4">Order not found</p>
        <button 
          onClick={() => navigate('/orders')}
          className="px-4 py-2 bg-admin-primary text-white rounded-lg hover:bg-admin-primary/90 transition-colors"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  const subtotal = currentOrder.items?.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0) || 0;
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [showInvoiceGenerator, setShowInvoiceGenerator] = useState(false);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/orders')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-montserrat">Order Details</h1>
            <p className="text-gray-600 font-helvetica">Order #{currentOrder.id}</p>
          </div>
        </div>
        <button
          onClick={handlePrintBill}
          className="flex items-center px-4 py-2 bg-admin-primary text-white rounded-lg hover:bg-admin-primary/90 transition-colors shadow-luxury"
        >
          <Printer className="h-4 w-4 mr-2" />
          Print Bill
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Summary */}
          <div className="bg-white rounded-xl shadow-luxury border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 font-montserrat">Order Summary</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-admin-primary" />
                <div>
                  <p className="text-sm text-gray-600">Order Date</p>
                  <p className="font-medium">{new Date(currentOrder.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Package className="h-5 w-5 text-admin-primary" />
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(currentOrder.status)}`}>
                    {currentOrder.status}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <DollarSign className="h-5 w-5 text-admin-primary" />
                <div>
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="font-bold text-lg text-admin-primary">${total.toFixed(2)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-admin-primary" />
                <div>
                  <p className="text-sm text-gray-600">Payment Method</p>
                  <p className="font-medium">{currentOrder.paymentMethod || 'Card'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-xl shadow-luxury border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 font-montserrat">Order Items</h3>
            <div className="space-y-4">
              {currentOrder.items?.map((item: any, index: number) => (
                <div key={index} className="flex items-center space-x-4 border-b pb-4 last:border-b-0">
                  <div className="h-16 w-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                    {item.product?.images?.[0] ? (
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="h-full w-full object-cover rounded-lg"
                      />
                    ) : (
                      <Package className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{item.product?.name || 'Unknown Product'}</h4>
                    <p className="text-sm text-gray-600">
                      {item.size && `Size: ${item.size}`} {item.color && `• Color: ${item.color}`}
                    </p>
                    <p className="text-xs text-gray-500">SKU: {item.product?.sku || 'N/A'}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">${item.price} × {item.quantity}</p>
                    <p className="text-sm text-admin-primary font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              )) || (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">No items found</p>
                </div>
              )}
            </div>

            {/* Order Total */}
            <div className="border-t pt-4 mt-4 bg-gray-50 rounded-lg p-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (10%)</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total</span>
                  <span className="text-admin-primary">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer & Actions */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="bg-white rounded-xl shadow-luxury border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 font-montserrat">Customer Information</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <User className="h-4 w-4 text-admin-primary" />
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium">{currentOrder.user?.name || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-admin-primary" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{currentOrder.user?.email || 'N/A'}</p>
                </div>
              </div>
              {currentOrder.user?.phone && (
                <div className="flex items-center space-x-3">
                  <Package className="h-4 w-4 text-admin-primary" />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium">{currentOrder.user.phone}</p>
                  </div>
                </div>
              )}
              {currentOrder.shippingAddress && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-2">Shipping Address</p>
                  <p className="text-sm text-gray-600">{currentOrder.shippingAddress}</p>
                </div>
              )}
            </div>
          </div>

          {/* Status Actions */}
          <div className="bg-white rounded-xl shadow-luxury border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 font-montserrat">Update Status</h3>
            <div className="space-y-3">
              <button
                onClick={() => handleStatusUpdate('Processing')}
                disabled={updating || currentOrder.status === 'Processing'}
                className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Clock className="h-4 w-4 mr-2" />
                Mark as Processing
              </button>
              <button
                onClick={() => handleStatusUpdate('Shipped')}
                disabled={updating || currentOrder.status === 'Shipped'}
                className="w-full flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Truck className="h-4 w-4 mr-2" />
                Mark as Shipped
              </button>
              <button
                onClick={() => handleStatusUpdate('Delivered')}
                disabled={updating || currentOrder.status === 'Delivered'}
                className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Check className="h-4 w-4 mr-2" />
                Mark as Delivered
              </button>
              <button
                onClick={() => handleStatusUpdate('Cancelled')}
                disabled={updating || currentOrder.status === 'Cancelled'}
                className="w-full flex items-center justify-center px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <X className="h-4 w-4 mr-2" />
                Mark as Cancelled
              </button>
            </div>
          </div>

          {/* Invoice Actions */}
          <div className="bg-white rounded-xl shadow-luxury border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 font-montserrat">Invoice Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => setShowInvoiceGenerator(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Receipt className="w-4 h-4" />
                Generate Invoice
              </button>
              <button
                onClick={handlePrintBill}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <FileText className="w-4 h-4" />
                Generate Bill
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Tracking */}
      <div className="mt-6">
        <DeliveryTracker 
          orderId={currentOrder.id.toString()} 
          onStatusUpdate={(status) => {
            // Update order status when delivery status changes
            console.log('Delivery status updated:', status);
          }}
        />
      </div>

      {showInvoiceGenerator && (
        <InvoiceGenerator
          order={currentOrder}
          onClose={() => setShowInvoiceGenerator(false)}
        />
      )}
    </div>
  );
};

export default OrderDetail;