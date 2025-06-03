
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Truck, CheckCircle } from 'lucide-react';

export default function Orders() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Mock order data
  const orders = [
    {
      id: 'GU-001234',
      date: '2025-01-15',
      status: 'Delivered',
      total: 2250.00,
      items: [
        {
          name: 'GG Denim Sneakers',
          image: 'https://media.gucci.com/style/DarkGray_Center_0_0_490x490/1679046547/771932_UUEG0_4645_001_100_0000_Light-GG-denim-sneaker.jpg',
          price: 890.00,
          size: '9'
        },
        {
          name: 'Washed Denim Shirt',
          image: 'https://media.gucci.com/style/DarkGray_Center_0_0_490x490/1746033325/835220_XDDCY_4452_001_100_0000_Light-Washed-denim-shirt-with-GG-insert.jpg',
          price: 1360.00,
          size: 'M'
        }
      ]
    },
    {
      id: 'GU-001233',
      date: '2025-01-10',
      status: 'In Transit',
      total: 1890.00,
      items: [
        {
          name: 'Gucci Staffa Necklace',
          image: 'https://media.gucci.com/style/DarkGray_Center_0_0_490x490/1679046547/771932_UUEG0_4645_001_100_0000_Light-GG-denim-sneaker.jpg',
          price: 1890.00
        }
      ]
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Delivered':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'In Transit':
        return <Truck className="w-5 h-5 text-blue-600" />;
      default:
        return <Package className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'text-green-600';
      case 'In Transit':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            onClick={() => navigate('/account')}
            variant="ghost"
            size="sm"
            className="p-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-2xl font-light uppercase tracking-wider text-black">
            My Orders
          </h1>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="border border-gray-200 rounded-lg p-6">
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 pb-4 border-b border-gray-100">
                <div>
                  <h3 className="font-medium text-black mb-1">Order #{order.id}</h3>
                  <p className="text-sm text-gray-600">Placed on {new Date(order.date).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-3 mt-3 sm:mt-0">
                  {getStatusIcon(order.status)}
                  <span className={`font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-4 mb-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain p-2"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-black">{item.name}</h4>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        {item.size && <span>Size: {item.size}</span>}
                        <span>${item.price.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Total */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <span className="font-medium text-black">Total</span>
                <span className="font-medium text-black">${order.total.toLocaleString()}</span>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-4">
                <Button variant="outline" size="sm" className="border-black text-black hover:bg-gray-50">
                  Track Order
                </Button>
                <Button variant="outline" size="sm" className="border-gray-300 text-gray-600 hover:bg-gray-50">
                  View Details
                </Button>
                {order.status === 'Delivered' && (
                  <Button variant="outline" size="sm" className="border-gray-300 text-gray-600 hover:bg-gray-50">
                    Reorder
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {orders.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-black mb-2">No orders yet</h3>
            <p className="text-gray-600 mb-6">Start shopping to see your orders here.</p>
            <Button
              onClick={() => navigate('/')}
              className="bg-black text-white hover:bg-gray-800"
            >
              Start Shopping
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
