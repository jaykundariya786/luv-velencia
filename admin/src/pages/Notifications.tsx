
import React from 'react';
import NotificationCenter from '../components/NotificationCenter';

const Notifications: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
        <p className="mt-2 text-gray-600">Manage system notifications and alerts</p>
      </div>
      
      <NotificationCenter />
    </div>
  );
};

export default Notifications;
