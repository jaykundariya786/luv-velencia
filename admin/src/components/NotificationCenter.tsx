
import React, { useEffect, useState } from 'react';
import { 
  Bell, 
  Package, 
  AlertTriangle, 
  ShoppingCart, 
  Check, 
  X,
  Mail,
  MessageSquare
} from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  data: any;
  createdAt: string;
}

const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (filter !== 'all') {
        queryParams.append('type', filter);
      }
      
      const response = await fetch(`/api/admin/notifications?${queryParams}`);
      const data = await response.json();
      
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: number) => {
    try {
      await fetch(`/api/admin/notifications/${notificationId}/read`, {
        method: 'PUT',
      });

      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, isRead: true }
            : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to update notification');
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_order':
        return <ShoppingCart className="h-5 w-5 text-green-600" />;
      case 'low_stock':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'order_update':
        return <Package className="h-5 w-5 text-blue-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const getNotificationColor = (type: string, isRead: boolean) => {
    const opacity = isRead ? 'opacity-70' : '';
    switch (type) {
      case 'new_order':
        return `bg-green-50 border-green-200 ${opacity}`;
      case 'low_stock':
        return `bg-yellow-50 border-yellow-200 ${opacity}`;
      case 'order_update':
        return `bg-blue-50 border-blue-200 ${opacity}`;
      default:
        return `bg-gray-50 border-gray-200 ${opacity}`;
    }
  };

  const sendTestNotification = async (type: string) => {
    try {
      await fetch('/api/admin/notifications/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'email',
          recipient: 'admin@example.com',
          subject: `Test ${type} Notification`,
          message: `This is a test ${type} notification from the admin panel`,
          data: { test: true },
        }),
      });

      toast.success('Test notification sent successfully');
    } catch (error) {
      console.error('Error sending test notification:', error);
      toast.error('Failed to send test notification');
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
        <div className="flex items-center space-x-3">
          <Bell className="h-6 w-6 text-blue-600" />
          <h3 className="text-xl font-bold text-gray-900">Notifications</h3>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => sendTestNotification('email')}
            className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <Mail className="h-4 w-4 mr-1" />
            Test Email
          </button>
          <button
            onClick={() => sendTestNotification('sms')}
            className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
          >
            <MessageSquare className="h-4 w-4 mr-1" />
            Test SMS
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-4 mb-6 border-b">
        {[
          { key: 'all', label: 'All' },
          { key: 'new_order', label: 'New Orders' },
          { key: 'low_stock', label: 'Low Stock' },
          { key: 'order_update', label: 'Order Updates' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              filter === tab.key
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${getNotificationColor(
                notification.type,
                notification.isRead
              )}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-semibold ${notification.isRead ? 'text-gray-600' : 'text-gray-900'}`}>
                      {notification.title}
                    </h4>
                    <p className={`text-sm ${notification.isRead ? 'text-gray-500' : 'text-gray-700'}`}>
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {format(new Date(notification.createdAt), 'MMM dd, yyyy HH:mm')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {!notification.isRead && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="p-1 text-green-600 hover:bg-green-100 rounded transition-colors"
                      title="Mark as read"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  )}
                  <div className={`w-2 h-2 rounded-full ${notification.isRead ? 'bg-gray-400' : 'bg-blue-500'}`} />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">No notifications found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationCenter;
