
import React, { useState } from 'react';
import { Calendar, Filter, X, Search } from 'lucide-react';

interface FilterOptions {
  dateRange?: {
    start: string;
    end: string;
  };
  priceRange?: {
    min: number;
    max: number;
  };
  stockStatus?: string;
  orderStatus?: string;
  category?: string;
}

interface AdvancedFiltersProps {
  onFiltersChange: (filters: FilterOptions) => void;
  onClearFilters: () => void;
  type: 'products' | 'orders' | 'users';
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  onFiltersChange,
  onClearFilters,
  type
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({});

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
    onClearFilters();
  };

  const stockStatusOptions = [
    { value: 'in-stock', label: 'In Stock' },
    { value: 'low-stock', label: 'Low Stock' },
    { value: 'out-of-stock', label: 'Out of Stock' },
  ];

  const orderStatusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  const categoryOptions = [
    { value: 'shoes', label: 'Shoes' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'bags', label: 'Bags' },
    { value: 'jewelry', label: 'Jewelry' },
    { value: 'accessories', label: 'Accessories' },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
      >
        <Filter className="w-4 h-4" />
        Advanced Filters
        {Object.keys(filters).length > 0 && (
          <span className="bg-indigo-600 text-white text-xs rounded-full px-2 py-1">
            {Object.keys(filters).length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-900">Advanced Filters</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Range
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  placeholder="Start Date"
                  value={filters.dateRange?.start || ''}
                  onChange={(e) =>
                    handleFilterChange('dateRange', {
                      ...filters.dateRange,
                      start: e.target.value,
                    })
                  }
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                />
                <input
                  type="date"
                  placeholder="End Date"
                  value={filters.dateRange?.end || ''}
                  onChange={(e) =>
                    handleFilterChange('dateRange', {
                      ...filters.dateRange,
                      end: e.target.value,
                    })
                  }
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                />
              </div>
            </div>

            {/* Price Range (for products) */}
            {type === 'products' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range ($)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min Price"
                    value={filters.priceRange?.min || ''}
                    onChange={(e) =>
                      handleFilterChange('priceRange', {
                        ...filters.priceRange,
                        min: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Max Price"
                    value={filters.priceRange?.max || ''}
                    onChange={(e) =>
                      handleFilterChange('priceRange', {
                        ...filters.priceRange,
                        max: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>
            )}

            {/* Stock Status (for products) */}
            {type === 'products' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Status
                </label>
                <select
                  value={filters.stockStatus || ''}
                  onChange={(e) => handleFilterChange('stockStatus', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                >
                  <option value="">All Stock Status</option>
                  {stockStatusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Order Status (for orders) */}
            {type === 'orders' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order Status
                </label>
                <select
                  value={filters.orderStatus || ''}
                  onChange={(e) => handleFilterChange('orderStatus', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                >
                  <option value="">All Order Status</option>
                  {orderStatusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Category (for products) */}
            {type === 'products' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={filters.category || ''}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                >
                  <option value="">All Categories</option>
                  {categoryOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={handleClearFilters}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md transition-colors text-sm"
            >
              Clear All
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition-colors text-sm"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedFilters;
