
import { useAppSelector } from '@/hooks/redux';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Truck, CheckCircle, Clock, Eye, RotateCcw, Download, Star } from 'lucide-react';

export default function Orders() {
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  // Mock order data with enhanced details
  const orders = [
    {
      id: 'LV-001234',
      date: '2025-01-15',
      status: 'Delivered',
      total: 2250.00,
      estimatedDelivery: '2025-01-18',
      trackingNumber: 'LV1234567890',
      items: [
        {
          name: 'Luxury Velencia Handbag',
          image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop',
          price: 1890.00,
          color: 'Black',
          size: 'One Size',
          quantity: 1
        },
        {
          name: 'Designer Sunglasses',
          image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop',
          price: 360.00,
          color: 'Tortoise',
          size: 'One Size',
          quantity: 1
        }
      ]
    },
    {
      id: 'LV-001233',
      date: '2025-01-12',
      status: 'In Transit',
      total: 1890.00,
      estimatedDelivery: '2025-01-16',
      trackingNumber: 'LV0987654321',
      items: [
        {
          name: 'Premium Leather Wallet',
          image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
          price: 1890.00,
          color: 'Brown',
          size: 'One Size',
          quantity: 1
        }
      ]
    },
    {
      id: 'LV-001232',
      date: '2025-01-08',
      status: 'Processing',
      total: 3200.00,
      estimatedDelivery: '2025-01-20',
      trackingNumber: 'LV1122334455',
      items: [
        {
          name: 'Luxury Watch Collection',
          image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=400&fit=crop',
          price: 3200.00,
          color: 'Gold',
          size: '42mm',
          quantity: 1
        }
      ]
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Delivered':
        return <CheckCircle className="w-5 h-5 text-emerald-600" />;
      case 'In Transit':
        return <Truck className="w-5 h-5 text-blue-600" />;
      case 'Processing':
        return <Clock className="w-5 h-5 text-amber-600" />;
      default:
        return <Package className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'In Transit':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Processing':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getProgressWidth = (status: string) => {
    switch (status) {
      case 'Delivered':
        return '100%';
      case 'In Transit':
        return '66%';
      case 'Processing':
        return '33%';
      default:
        return '0%';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Enhanced Header */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-8">
            <div className="flex items-center gap-6">
              <Button
                onClick={() => navigate('/account')}
                variant="ghost"
                size="sm"
                className="p-3 hover:bg-gray-50 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-3xl font-light text-gray-900 mb-2">
                  Order History
                </h1>
                <p className="text-gray-600 font-medium">
                  Track and manage your luxury purchases
                </p>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="hidden lg:flex items-center gap-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{orders.length}</div>
                <div className="text-sm text-gray-500 uppercase tracking-wide">Total Orders</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  ${orders.reduce((sum, order) => sum + order.total, 0).toLocaleString()}
                </div>
                <div className="text-sm text-gray-500 uppercase tracking-wide">Total Spent</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Orders List */}
        {orders.length > 0 ? (
          <div className="space-y-8">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
                {/* Enhanced Order Header */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <h3 className="text-xl font-bold text-gray-900">
                          Order #{order.id}
                        </h3>
                        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border ${getStatusStyles(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {order.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500 font-medium">Order Date</span>
                          <div className="font-semibold text-gray-900">
                            {new Date(order.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-500 font-medium">Tracking</span>
                          <div className="font-mono text-gray-900">{order.trackingNumber}</div>
                        </div>
                        <div>
                          <span className="text-gray-500 font-medium">Estimated Delivery</span>
                          <div className="font-semibold text-gray-900">
                            {new Date(order.estimatedDelivery).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="lg:w-64">
                      <div className="text-sm text-gray-600 mb-2 font-medium">Order Progress</div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: getProgressWidth(order.status) }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Order Items */}
                <div className="p-8">
                  <div className="space-y-6">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex gap-6 p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                        <div className="w-28 h-28 bg-white rounded-xl flex-shrink-0 overflow-hidden shadow-sm">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 text-lg mb-3 leading-tight">{item.name}</h4>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500 font-medium block">Color</span>
                              <span className="text-gray-900 font-semibold">{item.color}</span>
                            </div>
                            <div>
                              <span className="text-gray-500 font-medium block">Size</span>
                              <span className="text-gray-900 font-semibold">{item.size}</span>
                            </div>
                            <div>
                              <span className="text-gray-500 font-medium block">Quantity</span>
                              <span className="text-gray-900 font-semibold">{item.quantity}</span>
                            </div>
                            <div>
                              <span className="text-gray-500 font-medium block">Price</span>
                              <span className="text-gray-900 font-bold text-lg">${item.price.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Enhanced Order Total */}
                  <div className="flex justify-between items-center pt-8 mt-8 border-t border-gray-200">
                    <span className="text-xl font-bold text-gray-900">Order Total</span>
                    <span className="text-2xl font-bold text-gray-900">${order.total.toLocaleString()}</span>
                  </div>

                  {/* Enhanced Actions */}
                  <div className="flex flex-wrap gap-4 mt-8">
                    <Button 
                      className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2"
                    >
                      <Truck className="w-4 h-4" />
                      Track Package
                    </Button>
                    <Button 
                      variant="outline" 
                      className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </Button>
                    <Button 
                      variant="outline" 
                      className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Invoice
                    </Button>
                    {order.status === 'Delivered' && (
                      <>
                        <Button 
                          variant="outline" 
                          className="border-blue-300 text-blue-700 hover:bg-blue-50 px-8 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2"
                          onClick={() => navigate('/products')}
                        >
                          <RotateCcw className="w-4 h-4" />
                          Buy Again
                        </Button>
                        <Button 
                          variant="outline" 
                          className="border-amber-300 text-amber-700 hover:bg-amber-50 px-8 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2"
                        >
                          <Star className="w-4 h-4" />
                          Leave Review
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Enhanced Empty State */
          <div className="text-center py-24">
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-8">
              <Package className="w-16 h-16 text-gray-400" />
            </div>
            <h3 className="text-3xl font-light text-gray-900 mb-4">
              No Orders Yet
            </h3>
            <p className="text-gray-600 mb-10 max-w-md mx-auto leading-relaxed text-lg">
              Discover our exquisite collection of luxury items and start your shopping journey.
            </p>
            <Button
              onClick={() => navigate('/products')}
              className="bg-gray-900 hover:bg-gray-800 text-white px-12 py-4 text-lg font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Explore Collection
            </Button>
          </div>
        )}

        {/* Enhanced Services Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Truck className="w-8 h-8 text-blue-600" />
            </div>
            <h4 className="font-bold text-gray-900 text-lg mb-3">Real-Time Tracking</h4>
            <p className="text-gray-600 leading-relaxed">Monitor your orders every step of the way with live updates and notifications.</p>
          </div>
          <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>
            <h4 className="font-bold text-gray-900 text-lg mb-3">Express Checkout</h4>
            <p className="text-gray-600 leading-relaxed">Streamlined checkout process with saved preferences and one-click ordering.</p>
          </div>
          <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <RotateCcw className="w-8 h-8 text-amber-600" />
            </div>
            <h4 className="font-bold text-gray-900 text-lg mb-3">Hassle-Free Returns</h4>
            <p className="text-gray-600 leading-relaxed">Easy returns and exchanges within 30 days with complimentary shipping.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
