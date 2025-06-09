
import React, { useEffect, useState } from 'react';
import { 
  Package, 
  Truck, 
  MapPin, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Send,
  Phone,
  Mail
} from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

interface TrackingEvent {
  id: number;
  status: string;
  location: string;
  timestamp: string;
  description: string;
  logisticsProvider: string;
}

interface DeliveryTrackerProps {
  orderId: string;
  onStatusUpdate?: (status: string) => void;
}

const DeliveryTracker: React.FC<DeliveryTrackerProps> = ({ orderId, onStatusUpdate }) => {
  const [trackingHistory, setTrackingHistory] = useState<TrackingEvent[]>([]);
  const [currentStatus, setCurrentStatus] = useState('');
  const [estimatedDelivery, setEstimatedDelivery] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newDescription, setNewDescription] = useState('');

  useEffect(() => {
    fetchTrackingInfo();
  }, [orderId]);

  const fetchTrackingInfo = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/orders/${orderId}/tracking`);
      const data = await response.json();
      
      setTrackingHistory(data.trackingHistory || []);
      setCurrentStatus(data.currentStatus || '');
      setEstimatedDelivery(data.estimatedDelivery || '');
    } catch (error) {
      console.error('Error fetching tracking info:', error);
      toast.error('Failed to fetch tracking information');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!newStatus || !newDescription) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setUpdating(true);
      const response = await fetch(`/api/admin/orders/${orderId}/tracking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
          location: newLocation,
          description: newDescription,
          logisticsProvider: 'manual',
        }),
      });

      if (response.ok) {
        toast.success('Tracking status updated successfully');
        setNewStatus('');
        setNewLocation('');
        setNewDescription('');
        fetchTrackingInfo();
        onStatusUpdate?.(newStatus);
      } else {
        throw new Error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update tracking status');
    } finally {
      setUpdating(false);
    }
  };

  const sendNotificationToCustomer = async (type: 'email' | 'sms') => {
    try {
      await fetch('/api/admin/notifications/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          recipient: type === 'email' ? 'customer@example.com' : '+1234567890',
          subject: `Order Update - ${orderId}`,
          message: `Your order status has been updated to: ${currentStatus}`,
          data: { orderId, status: currentStatus },
        }),
      });

      toast.success(`${type.toUpperCase()} notification sent successfully`);
    } catch (error) {
      console.error(`Error sending ${type} notification:`, error);
      toast.error(`Failed to send ${type.toUpperCase()} notification`);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'order_placed':
        return <Package className="h-4 w-4 text-blue-600" />;
      case 'picked_up':
        return <Truck className="h-4 w-4 text-orange-600" />;
      case 'in_transit':
        return <Truck className="h-4 w-4 text-purple-600" />;
      case 'out_for_delivery':
        return <MapPin className="h-4 w-4 text-yellow-600" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'order_placed':
        return 'bg-blue-100 border-blue-300';
      case 'picked_up':
        return 'bg-orange-100 border-orange-300';
      case 'in_transit':
        return 'bg-purple-100 border-purple-300';
      case 'out_for_delivery':
        return 'bg-yellow-100 border-yellow-300';
      case 'delivered':
        return 'bg-green-100 border-green-300';
      case 'failed':
        return 'bg-red-100 border-red-300';
      default:
        return 'bg-gray-100 border-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Delivery Tracking</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => sendNotificationToCustomer('email')}
            className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <Mail className="h-4 w-4 mr-1" />
            Email
          </button>
          <button
            onClick={() => sendNotificationToCustomer('sms')}
            className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
          >
            <Phone className="h-4 w-4 mr-1" />
            SMS
          </button>
        </div>
      </div>

      {/* Current Status */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getStatusIcon(currentStatus)}
            <div>
              <p className="font-semibold text-gray-900">Current Status</p>
              <p className="text-sm text-gray-600 capitalize">{currentStatus.replace('_', ' ')}</p>
            </div>
          </div>
          {estimatedDelivery && (
            <div className="text-right">
              <p className="text-sm text-gray-600">Estimated Delivery</p>
              <p className="font-semibold text-gray-900">
                {format(new Date(estimatedDelivery), 'MMM dd, yyyy HH:mm')}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Tracking History */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 mb-4">Tracking History</h4>
        <div className="space-y-4">
          {trackingHistory.map((event, index) => (
            <div
              key={event.id}
              className={`flex items-start space-x-4 p-4 rounded-lg border-2 ${getStatusColor(event.status)}`}
            >
              <div className="flex-shrink-0 mt-1">
                {getStatusIcon(event.status)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-semibold text-gray-900 capitalize">
                    {event.status.replace('_', ' ')}
                  </p>
                  <p className="text-sm text-gray-600">
                    {format(new Date(event.timestamp), 'MMM dd, HH:mm')}
                  </p>
                </div>
                <p className="text-sm text-gray-700 mb-1">{event.description}</p>
                <p className="text-xs text-gray-500 flex items-center">
                  <MapPin className="h-3 w-3 mr-1" />
                  {event.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add New Status Update */}
      <div className="border-t pt-6">
        <h4 className="font-semibold text-gray-900 mb-4">Add Status Update</h4>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Status</option>
                <option value="picked_up">Picked Up</option>
                <option value="in_transit">In Transit</option>
                <option value="out_for_delivery">Out for Delivery</option>
                <option value="delivered">Delivered</option>
                <option value="failed">Delivery Failed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                placeholder="Current location"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Status update description"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            onClick={handleStatusUpdate}
            disabled={updating || !newStatus || !newDescription}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="h-4 w-4 mr-2" />
            {updating ? 'Updating...' : 'Add Update'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeliveryTracker;
