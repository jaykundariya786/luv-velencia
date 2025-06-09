import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center space-x-2">
      <div className="w-6 h-6 border-3 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
      <span className="text-sm font-medium text-gray-600 font-['Inter']">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;