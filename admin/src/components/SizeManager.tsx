
import React from 'react';
import { Plus, X } from 'lucide-react';

interface SizeManagerProps {
  category: string;
  sizes: string[];
  onSizesChange: (sizes: string[]) => void;
}

const SizeManager: React.FC<SizeManagerProps> = ({ category, sizes, onSizesChange }) => {
  const [newSize, setNewSize] = React.useState('');

  const getPredefinedSizes = (category: string) => {
    const lowerCategory = category?.toLowerCase() || '';
    
    if (lowerCategory.includes('shoes') || lowerCategory.includes('sneaker') || lowerCategory.includes('boot')) {
      return [
        { label: '5 = 5.5 US', value: '5' },
        { label: '6 = 6.5 US', value: '6' },
        { label: '6.5 = 7 US', value: '6.5' },
        { label: '7 = 7.5 US', value: '7' },
        { label: '7.5 = 8 US', value: '7.5' },
        { label: '8 = 8.5 US', value: '8' },
        { label: '8.5 = 9 US', value: '8.5' },
        { label: '9 = 9.5 US', value: '9' },
        { label: '9.5 = 10 US', value: '9.5' },
        { label: '10 = 10.5 US', value: '10' },
        { label: '10.5 = 11 US', value: '10.5' },
        { label: '11 = 11.5 US', value: '11' },
        { label: '12 = 12.5 US', value: '12' },
        { label: '13 = 13.5 US', value: '13' },
        { label: '14 = 14.5 US', value: '14' },
        { label: '15 = 15.5 US', value: '15' },
      ];
    } else if (lowerCategory.includes('shirt') || lowerCategory.includes('top') || lowerCategory.includes('jacket') || lowerCategory.includes('sweater') || lowerCategory.includes('clothing')) {
      return [
        { label: 'XXS', value: 'XXS' },
        { label: 'XS', value: 'XS' },
        { label: 'S', value: 'S' },
        { label: 'M', value: 'M' },
        { label: 'L', value: 'L' },
        { label: 'XL', value: 'XL' },
        { label: 'XXL', value: 'XXL' },
        { label: 'XXXL', value: 'XXXL' },
      ];
    } else if (lowerCategory.includes('pant') || lowerCategory.includes('jean') || lowerCategory.includes('trouser')) {
      return [
        { label: '28', value: '28' },
        { label: '30', value: '30' },
        { label: '32', value: '32' },
        { label: '34', value: '34' },
        { label: '36', value: '36' },
        { label: '38', value: '38' },
        { label: '40', value: '40' },
        { label: '42', value: '42' },
        { label: '44', value: '44' },
        { label: '46', value: '46' },
      ];
    } else if (lowerCategory.includes('jewelry') || lowerCategory.includes('necklace') || lowerCategory.includes('ring')) {
      return [
        { label: 'One Size', value: 'OS' },
        { label: 'Adjustable', value: 'ADJ' },
      ];
    } else if (lowerCategory.includes('bag') || lowerCategory.includes('backpack') || lowerCategory.includes('purse')) {
      return [
        { label: 'One Size', value: 'OS' }
      ];
    } else {
      return [
        { label: 'One Size', value: 'OS' },
        { label: 'S', value: 'S' },
        { label: 'M', value: 'M' },
        { label: 'L', value: 'L' },
        { label: 'XL', value: 'XL' },
      ];
    }
  };

  const addSize = () => {
    if (newSize.trim() && !sizes.includes(newSize.trim())) {
      onSizesChange([...sizes, newSize.trim()]);
      setNewSize('');
    }
  };

  const addPredefinedSize = (size: string) => {
    if (!sizes.includes(size)) {
      onSizesChange([...sizes, size]);
    }
  };

  const removeSize = (size: string) => {
    onSizesChange(sizes.filter(s => s !== size));
  };

  const addAllPredefinedSizes = () => {
    const predefinedSizes = getPredefinedSizes(category);
    const sizesToAdd = predefinedSizes.filter(size => !sizes.includes(size.value));
    if (sizesToAdd.length > 0) {
      onSizesChange([...sizes, ...sizesToAdd.map(s => s.value)]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Available Sizes
        </label>
        <button
          type="button"
          onClick={addAllPredefinedSizes}
          className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
        >
          Add All Sizes
        </button>
      </div>
      
      {/* Predefined sizes based on category */}
      {category && (
        <div>
          <p className="text-xs text-gray-600 mb-2">Quick add sizes for {category}:</p>
          <div className="flex flex-wrap gap-1">
            {getPredefinedSizes(category).map((size) => (
              <button
                key={size.value}
                type="button"
                onClick={() => addPredefinedSize(size.value)}
                disabled={sizes.includes(size.value)}
                className={`px-2 py-1 text-xs rounded border ${
                  sizes.includes(size.value)
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-white hover:bg-blue-50 border-blue-300 text-blue-700'
                }`}
              >
                {size.label}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Custom size input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newSize}
          onChange={(e) => setNewSize(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter custom size"
          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSize())}
        />
        <button
          type="button"
          onClick={addSize}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      
      {/* Selected sizes */}
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => (
          <span
            key={size}
            className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
          >
            {size}
            <button
              type="button"
              onClick={() => removeSize(size)}
              className="ml-2 text-blue-600 hover:text-red-600"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>
      {sizes.length === 0 && (
        <p className="text-xs text-gray-500">No sizes added yet. Add sizes above.</p>
      )}
    </div>
  );
};

export default SizeManager;
