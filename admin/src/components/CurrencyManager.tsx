import React, { useEffect, useState } from 'react';
import { 
  DollarSign, 
  Euro, 
  IndianRupee,
  PoundSterling,
  RefreshCw,
  Save,
  Calculator,
  Globe
} from 'lucide-react';
import toast from 'react-hot-toast';

interface ExchangeRates {
  [key: string]: number;
}

interface CurrencyInfo {
  code: string;
  name: string;
  symbol: string;
  icon: React.ComponentType<any>;
}

const currencies: CurrencyInfo[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', icon: DollarSign },
  { code: 'EUR', name: 'Euro', symbol: '€', icon: Euro },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', icon: IndianRupee },
  { code: 'GBP', name: 'British Pound', symbol: '£', icon: PoundSterling },
];

const CurrencyManager: React.FC = () => {
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates>({});
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('');
  const [baseCurrency, setBaseCurrency] = useState('USD');

  // Currency converter state
  const [convertAmount, setConvertAmount] = useState('100');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [convertedAmount, setConvertedAmount] = useState(0);

  useEffect(() => {
    fetchExchangeRates();
  }, []);

  const fetchExchangeRates = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/currencies/rates');
      const data = await response.json();

      setExchangeRates(data);
      setLastUpdated(data.lastUpdated || '');
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
      toast.error('Failed to fetch exchange rates');
    } finally {
      setLoading(false);
    }
  };

  const updateExchangeRates = async () => {
    try {
      setUpdating(true);
      const response = await fetch('/api/admin/currencies/rates', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rates: exchangeRates }),
      });

      if (response.ok) {
        const data = await response.json();
        setLastUpdated(data.lastUpdated);
        toast.success('Exchange rates updated successfully');
      } else {
        throw new Error('Failed to update rates');
      }
    } catch (error) {
      console.error('Error updating exchange rates:', error);
      toast.error('Failed to update exchange rates');
    } finally {
      setUpdating(false);
    }
  };

  const handleRateChange = (currency: string, rate: string) => {
    const numericRate = parseFloat(rate);
    if (!isNaN(numericRate)) {
      setExchangeRates(prev => ({
        ...prev,
        [currency]: numericRate,
      }));
    }
  };

  const convertCurrency = async () => {
    try {
      const response = await fetch('/api/admin/currencies/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(convertAmount),
          fromCurrency,
          toCurrency,
        }),
      });

      const data = await response.json();
      setConvertedAmount(data.convertedAmount);
      toast.success('Currency converted successfully');
    } catch (error) {
      console.error('Error converting currency:', error);
      toast.error('Failed to convert currency');
    }
  };

  const refreshRatesFromAPI = async () => {
    // In a real app, this would fetch from an external API like exchangerate-api.com
    try {
      setUpdating(true);

      // Mock API call - in real app, replace with actual API
      const mockRates = {
        USD: 1.0,
        EUR: 0.85 + (Math.random() - 0.5) * 0.1,
        INR: 83.25 + (Math.random() - 0.5) * 5,
        GBP: 0.73 + (Math.random() - 0.5) * 0.05,
      };

      setExchangeRates(mockRates);
      setLastUpdated(new Date().toISOString());
      toast.success('Exchange rates refreshed from API');
    } catch (error) {
      console.error('Error refreshing rates:', error);
      toast.error('Failed to refresh exchange rates');
    } finally {
      setUpdating(false);
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
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Globe className="h-6 w-6 text-blue-600" />
            <h3 className="text-xl font-bold text-gray-900">Multi-Currency Management</h3>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={refreshRatesFromAPI}
              disabled={updating}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${updating ? 'animate-spin' : ''}`} />
              Refresh Rates
            </button>
            <button
              onClick={updateExchangeRates}
              disabled={updating}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </button>
          </div>
        </div>

        {lastUpdated && (
          <p className="text-sm text-gray-600 mb-4">
            Last updated: {new Date(lastUpdated).toLocaleString()}
          </p>
        )}

        {/* Base Currency Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Base Currency
          </label>
          <select
            value={baseCurrency}
            onChange={(e) => setBaseCurrency(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {currencies.map((currency) => (
              <option key={currency.code} value={currency.code}>
                {currency.code} - {currency.name}
              </option>
            ))}
          </select>
        </div>

        {/* Exchange Rates */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {currencies.map((currency) => {
            const CurrencyIcon = currency.icon;
            return (
              <div
                key={currency.code}
                className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <CurrencyIcon className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-semibold text-gray-900">{currency.code}</p>
                    <p className="text-sm text-gray-600">{currency.name}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-xs text-gray-500">
                    Rate to {baseCurrency}
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={exchangeRates[currency.code] || ''}
                    onChange={(e) => handleRateChange(currency.code, e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Currency Converter */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Calculator className="h-6 w-6 text-green-600" />
          <h3 className="text-xl font-bold text-gray-900">Currency Converter</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount
            </label>
            <input
              type="number"
              value={convertAmount}
              onChange={(e) => setConvertAmount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              From
            </label>
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {currencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.code}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              To
            </label>
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {currencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.code}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={convertCurrency}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Convert
          </button>
        </div>

        {convertedAmount > 0 && (
          <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-lg font-semibold text-green-800">
              {convertAmount} {fromCurrency} = {convertedAmount.toFixed(2)} {toCurrency}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrencyManager;