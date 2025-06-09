import React, { useEffect, useState } from 'react';
import { 
  DollarSign, 
  Euro, 
  IndianRupee,
  PoundSterling,
  RefreshCw,
  Save,
  Calculator,
  Globe,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Settings,
  Plus,
  Edit,
  Trash2
} from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

interface Currency {
  code: string;
  name: string;
  symbol: string;
  exchangeRate: number;
  isBaseCurrency: boolean;
  isActive: boolean;
  lastUpdated: string;
  trend: 'up' | 'down' | 'stable';
  changePercent: number;
}

interface ExchangeRateProvider {
  id: string;
  name: string;
  isActive: boolean;
  lastSync: string;
  apiKey?: string;
  updateFrequency: number; // in minutes
}

interface CurrencyConversion {
  from: string;
  to: string;
  amount: number;
  convertedAmount: number;
  rate: number;
  timestamp: string;
}

interface CurrencySettings {
  autoUpdate: boolean;
  updateFrequency: number;
  fallbackProvider: string;
  roundingPrecision: number;
  displayFormat: 'symbol' | 'code' | 'both';
}

const EnhancedMultiCurrency: React.FC = () => {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [providers, setProviders] = useState<ExchangeRateProvider[]>([]);
  const [settings, setSettings] = useState<CurrencySettings>({
    autoUpdate: true,
    updateFrequency: 60,
    fallbackProvider: 'exchangerate-api',
    roundingPrecision: 2,
    displayFormat: 'symbol'
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState<'currencies' | 'providers' | 'settings' | 'converter'>('currencies');
  
  // Converter state
  const [convertAmount, setConvertAmount] = useState('100');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [conversionResult, setConversionResult] = useState<CurrencyConversion | null>(null);
  const [conversionHistory, setConversionHistory] = useState<CurrencyConversion[]>([]);

  // Modal states
  const [showAddCurrency, setShowAddCurrency] = useState(false);
  const [showProviderModal, setShowProviderModal] = useState(false);
  const [newCurrency, setNewCurrency] = useState({ code: '', name: '', symbol: '' });
  const [selectedProvider, setSelectedProvider] = useState<ExchangeRateProvider | null>(null);

  useEffect(() => {
    fetchCurrencyData();
  }, []);

  const fetchCurrencyData = async () => {
    try {
      setLoading(true);
      const [currenciesRes, providersRes, settingsRes, historyRes] = await Promise.all([
        fetch('/api/admin/currencies'),
        fetch('/api/admin/currencies/providers'),
        fetch('/api/admin/currencies/settings'),
        fetch('/api/admin/currencies/conversion-history')
      ]);

      const [currenciesData, providersData, settingsData, historyData] = await Promise.all([
        currenciesRes.json(),
        providersRes.json(),
        settingsRes.json(),
        historyRes.json()
      ]);

      setCurrencies(currenciesData.currencies || []);
      setProviders(providersData.providers || []);
      setSettings(settingsData.settings || settings);
      setConversionHistory(historyData.history || []);
    } catch (error) {
      toast.error('Failed to fetch currency data');
    } finally {
      setLoading(false);
    }
  };

  const updateExchangeRates = async (provider?: string) => {
    try {
      setUpdating(true);
      const response = await fetch('/api/admin/currencies/update-rates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider })
      });

      if (response.ok) {
        const data = await response.json();
        setCurrencies(data.currencies);
        toast.success(`Updated ${data.updatedCount} exchange rates`);
      } else {
        throw new Error('Failed to update rates');
      }
    } catch (error) {
      toast.error('Failed to update exchange rates');
    } finally {
      setUpdating(false);
    }
  };

  const addCurrency = async () => {
    try {
      const response = await fetch('/api/admin/currencies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCurrency)
      });

      if (response.ok) {
        toast.success('Currency added successfully');
        setShowAddCurrency(false);
        setNewCurrency({ code: '', name: '', symbol: '' });
        fetchCurrencyData();
      } else {
        throw new Error('Failed to add currency');
      }
    } catch (error) {
      toast.error('Failed to add currency');
    }
  };

  const toggleCurrency = async (currencyCode: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/currencies/${currencyCode}/toggle`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive })
      });

      if (response.ok) {
        setCurrencies(prev => 
          prev.map(c => c.code === currencyCode ? { ...c, isActive: !isActive } : c)
        );
        toast.success(`Currency ${!isActive ? 'activated' : 'deactivated'}`);
      }
    } catch (error) {
      toast.error('Failed to update currency status');
    }
  };

  const setBaseCurrency = async (currencyCode: string) => {
    try {
      const response = await fetch(`/api/admin/currencies/${currencyCode}/set-base`, {
        method: 'PUT'
      });

      if (response.ok) {
        setCurrencies(prev => 
          prev.map(c => ({ ...c, isBaseCurrency: c.code === currencyCode }))
        );
        toast.success(`${currencyCode} set as base currency`);
      }
    } catch (error) {
      toast.error('Failed to set base currency');
    }
  };

  const convertCurrency = async () => {
    try {
      const amount = parseFloat(convertAmount);
      if (isNaN(amount) || amount <= 0) {
        toast.error('Please enter a valid amount');
        return;
      }

      const response = await fetch('/api/admin/currencies/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: fromCurrency,
          to: toCurrency,
          amount
        })
      });

      if (response.ok) {
        const result = await response.json();
        setConversionResult(result.conversion);
        setConversionHistory(prev => [result.conversion, ...prev.slice(0, 9)]);
      } else {
        throw new Error('Failed to convert currency');
      }
    } catch (error) {
      toast.error('Failed to convert currency');
    }
  };

  const updateSettings = async () => {
    try {
      const response = await fetch('/api/admin/currencies/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });

      if (response.ok) {
        toast.success('Settings updated successfully');
      } else {
        throw new Error('Failed to update settings');
      }
    } catch (error) {
      toast.error('Failed to update settings');
    }
  };

  const getCurrencyIcon = (code: string) => {
    switch (code) {
      case 'USD': return <DollarSign className="w-5 h-5" />;
      case 'EUR': return <Euro className="w-5 h-5" />;
      case 'INR': return <IndianRupee className="w-5 h-5" />;
      case 'GBP': return <PoundSterling className="w-5 h-5" />;
      default: return <Globe className="w-5 h-5" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-500" />;
      default: return <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Multi-Currency Manager</h1>
          <p className="text-gray-600">Manage currencies and exchange rates for global commerce</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => updateExchangeRates()}
            disabled={updating}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${updating ? 'animate-spin' : ''}`} />
            Update Rates
          </button>
          <button
            onClick={() => setShowAddCurrency(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Currency
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {(['currencies', 'converter', 'providers', 'settings'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Currencies Tab */}
      {activeTab === 'currencies' && (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Currency</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exchange Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trend</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currencies.map((currency) => (
                <tr key={currency.code} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getCurrencyIcon(currency.code)}
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {currency.code} - {currency.name}
                        </div>
                        <div className="text-sm text-gray-500">{currency.symbol}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {currency.isBaseCurrency ? 'Base Currency' : currency.exchangeRate.toFixed(4)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      {getTrendIcon(currency.trend)}
                      <span className={`text-sm ${
                        currency.trend === 'up' ? 'text-green-600' : 
                        currency.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {currency.changePercent !== 0 && (
                          `${currency.changePercent > 0 ? '+' : ''}${currency.changePercent.toFixed(2)}%`
                        )}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(currency.lastUpdated), 'MMM dd, yyyy HH:mm')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        currency.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {currency.isActive ? 'Active' : 'Inactive'}
                      </span>
                      {currency.isBaseCurrency && (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          Base
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleCurrency(currency.code, currency.isActive)}
                        className={`text-sm px-2 py-1 rounded ${
                          currency.isActive ? 'text-red-600 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'
                        }`}
                      >
                        {currency.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      {!currency.isBaseCurrency && (
                        <button
                          onClick={() => setBaseCurrency(currency.code)}
                          className="text-sm px-2 py-1 rounded text-blue-600 hover:bg-blue-50"
                        >
                          Set as Base
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Currency Converter Tab */}
      {activeTab === 'converter' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Currency Converter</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <input
                  type="number"
                  value={convertAmount}
                  onChange={(e) => setConvertAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter amount"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                  <select
                    value={fromCurrency}
                    onChange={(e) => setFromCurrency(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {currencies.filter(c => c.isActive).map((currency) => (
                      <option key={currency.code} value={currency.code}>
                        {currency.code} - {currency.symbol}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                  <select
                    value={toCurrency}
                    onChange={(e) => setToCurrency(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {currencies.filter(c => c.isActive).map((currency) => (
                      <option key={currency.code} value={currency.code}>
                        {currency.code} - {currency.symbol}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={convertCurrency}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
              >
                <Calculator className="w-4 h-4" />
                Convert
              </button>

              {conversionResult && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Conversion Result</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {conversionResult.convertedAmount.toFixed(2)} {conversionResult.to}
                    </p>
                    <p className="text-sm text-gray-500">
                      Rate: 1 {conversionResult.from} = {conversionResult.rate.toFixed(4)} {conversionResult.to}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Conversion History</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {conversionHistory.map((conversion, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">
                        {conversion.amount} {conversion.from} → {conversion.convertedAmount.toFixed(2)} {conversion.to}
                      </p>
                      <p className="text-sm text-gray-500">
                        Rate: {conversion.rate.toFixed(4)}
                      </p>
                    </div>
                    <span className="text-xs text-gray-400">
                      {format(new Date(conversion.timestamp), 'HH:mm')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Currency Settings</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings.autoUpdate}
                    onChange={(e) => setSettings({...settings, autoUpdate: e.target.checked})}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Auto-update exchange rates</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Update Frequency (minutes)</label>
                <input
                  type="number"
                  value={settings.updateFrequency}
                  onChange={(e) => setSettings({...settings, updateFrequency: parseInt(e.target.value) || 60})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rounding Precision</label>
                <select
                  value={settings.roundingPrecision}
                  onChange={(e) => setSettings({...settings, roundingPrecision: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value={2}>2 decimal places</option>
                  <option value={3}>3 decimal places</option>
                  <option value={4}>4 decimal places</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Display Format</label>
                <select
                  value={settings.displayFormat}
                  onChange={(e) => setSettings({...settings, displayFormat: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="symbol">Symbol only ($)</option>
                  <option value="code">Code only (USD)</option>
                  <option value="both">Both ($ USD)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fallback Provider</label>
                <select
                  value={settings.fallbackProvider}
                  onChange={(e) => setSettings({...settings, fallbackProvider: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {providers.map((provider) => (
                    <option key={provider.id} value={provider.id}>{provider.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={updateSettings}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Settings
            </button>
          </div>
        </div>
      )}

      {/* Add Currency Modal */}
      {showAddCurrency && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add New Currency</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Currency Code</label>
                <input
                  type="text"
                  value={newCurrency.code}
                  onChange={(e) => setNewCurrency({...newCurrency, code: e.target.value.toUpperCase()})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., JPY"
                  maxLength={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Currency Name</label>
                <input
                  type="text"
                  value={newCurrency.name}
                  onChange={(e) => setNewCurrency({...newCurrency, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Japanese Yen"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Currency Symbol</label>
                <input
                  type="text"
                  value={newCurrency.symbol}
                  onChange={(e) => setNewCurrency({...newCurrency, symbol: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., ¥"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAddCurrency(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={addCurrency}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Currency
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedMultiCurrency;