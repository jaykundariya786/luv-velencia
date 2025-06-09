
import React from 'react';
import CurrencyManager from '../components/CurrencyManager';

const Currency: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Currency Management</h1>
        <p className="mt-2 text-gray-600">Manage exchange rates and multi-currency support</p>
      </div>
      
      <CurrencyManager />
    </div>
  );
};

export default Currency;
