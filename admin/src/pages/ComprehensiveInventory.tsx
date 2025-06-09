import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  BarChart3,
  RefreshCw,
  Download,
  Search,
  Filter,
  Plus,
  Edit,
  Eye,
  Settings,
  MapPin,
  Calendar,
  DollarSign
} from 'lucide-react';
import { format, subDays } from 'date-fns';
import toast from 'react-hot-toast';
import InventoryManager from '../components/InventoryManager';

interface InventoryAlert {
  id: string;
  type: 'low_stock' | 'out_of_stock' | 'overstock' | 'expiring' | 'quality_issue';
  productId: string;
  productName: string;
  sku: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  createdAt: string;
  isResolved: boolean;
  location?: string;
}

interface InventoryForecast {
  productId: string;
  productName: string;
  currentStock: number;
  projectedDemand: number;
  recommendedReorder: number;
  stockoutRisk: 'low' | 'medium' | 'high';
  forecastPeriod: number; // days
  confidence: number; // percentage
}

interface InventoryLocation {
  id: string;
  name: string;
  type: 'warehouse' | 'store' | 'distribution_center';
  address: string;
  capacity: number;
  currentUtilization: number;
  products: Array<{
    productId: string;
    sku: string;
    quantity: number;
    location: string; // aisle, shelf, etc.
  }>;
}

interface StockAudit {
  id: string;
  auditDate: string;
  auditor: string;
  location: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  totalItems: number;
  auditedItems: number;
  discrepancies: number;
  results: Array<{
    productId: string;
    expectedQty: number;
    actualQty: number;
    variance: number;
    reason?: string;
  }>;
}

const ComprehensiveInventory: React.FC = () => {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<'overview' | 'alerts' | 'forecast' | 'locations' | 'audits'>('overview');
  const [alerts, setAlerts] = useState<InventoryAlert[]>([]);
  const [forecasts, setForecasts] = useState<InventoryForecast[]>([]);
  const [locations, setLocations] = useState<InventoryLocation[]>([]);
  const [audits, setAudits] = useState<StockAudit[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');

  useEffect(() => {
    fetchInventoryData();
  }, []);

  const fetchInventoryData = async () => {
    try {
      setLoading(true);
      const [alertsRes, forecastsRes, locationsRes, auditsRes] = await Promise.all([
        fetch('/api/admin/inventory/alerts'),
        fetch('/api/admin/inventory/forecasts'),
        fetch('/api/admin/inventory/locations'),
        fetch('/api/admin/inventory/audits')
      ]);

      const [alertsData, forecastsData, locationsData, auditsData] = await Promise.all([
        alertsRes.json(),
        forecastsRes.json(),
        locationsRes.json(),
        auditsRes.json()
      ]);

      setAlerts(alertsData.alerts || []);
      setForecasts(forecastsData.forecasts || []);
      setLocations(locationsData.locations || []);
      setAudits(auditsData.audits || []);
    } catch (error) {
      toast.error('Failed to fetch inventory data');
    } finally {
      setLoading(false);
    }
  };

  const generateForecast = async (days: number = 30) => {
    try {
      const response = await fetch('/api/admin/inventory/generate-forecast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ forecastDays: days })
      });

      if (response.ok) {
        const data = await response.json();
        setForecasts(data.forecasts);
        toast.success(`Generated ${days}-day inventory forecast`);
      }
    } catch (error) {
      toast.error('Failed to generate forecast');
    }
  };

  const createStockAudit = async (locationId: string) => {
    try {
      const response = await fetch('/api/admin/inventory/audits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          locationId,
          auditDate: new Date().toISOString(),
          auditor: 'Current User' // In real app, get from auth context
        })
      });

      if (response.ok) {
        toast.success('Stock audit scheduled successfully');
        fetchInventoryData();
      }
    } catch (error) {
      toast.error('Failed to schedule audit');
    }
  };

  const resolveAlert = async (alertId: string) => {
    try {
      const response = await fetch(`/api/admin/inventory/alerts/${alertId}/resolve`, {
        method: 'PUT'
      });

      if (response.ok) {
        setAlerts(prev => 
          prev.map(alert => 
            alert.id === alertId ? { ...alert, isResolved: true } : alert
          )
        );
        toast.success('Alert resolved');
      }
    } catch (error) {
      toast.error('Failed to resolve alert');
    }
  };

  const exportInventoryReport = async (type: 'full' | 'alerts' | 'forecast') => {
    try {
      const response = await fetch(`/api/admin/inventory/export/${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ format: 'excel' })
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `inventory-${type}-${format(new Date(), 'yyyy-MM-dd')}.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        toast.success('Report downloaded successfully');
      }
    } catch (error) {
      toast.error('Failed to export report');
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = filterSeverity === 'all' || alert.severity === filterSeverity;
    const matchesLocation = selectedLocation === 'all' || alert.location === selectedLocation;
    
    return matchesSearch && matchesSeverity && matchesLocation;
  });

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
          <h1 className="text-2xl font-bold text-gray-900">Comprehensive Inventory Management</h1>
          <p className="text-gray-600">Advanced inventory tracking, forecasting, and optimization</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => generateForecast(30)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
          >
            <BarChart3 className="w-4 h-4" />
            Generate Forecast
          </button>
          <button
            onClick={() => exportInventoryReport('full')}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export Report
          </button>
          <button
            onClick={fetchInventoryData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {(['overview', 'alerts', 'forecast', 'locations', 'audits'] as const).map((tab) => (
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

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <InventoryManager />
      )}

      {/* Alerts Tab */}
      {activeTab === 'alerts' && (
        <div className="space-y-4">
          {/* Alert Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Critical Alerts</p>
                  <p className="text-2xl font-bold text-red-600">
                    {alerts.filter(a => a.severity === 'critical' && !a.isResolved).length}
                  </p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">High Priority</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {alerts.filter(a => a.severity === 'high' && !a.isResolved).length}
                  </p>
                </div>
                <TrendingDown className="w-8 h-8 text-orange-500" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Medium Priority</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {alerts.filter(a => a.severity === 'medium' && !a.isResolved).length}
                  </p>
                </div>
                <Package className="w-8 h-8 text-yellow-500" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Resolved Today</p>
                  <p className="text-2xl font-bold text-green-600">
                    {alerts.filter(a => a.isResolved && 
                      new Date(a.createdAt) > subDays(new Date(), 1)).length}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
            </div>
          </div>

          {/* Alert Filters */}
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search alerts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 w-full"
              />
            </div>
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Severity</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Locations</option>
              {locations.map((location) => (
                <option key={location.id} value={location.name}>{location.name}</option>
              ))}
            </select>
          </div>

          {/* Alerts List */}
          <div className="space-y-3">
            {filteredAlerts.map((alert) => (
              <div key={alert.id} className={`p-4 rounded-lg border ${getSeverityColor(alert.severity)} ${
                alert.isResolved ? 'opacity-60' : ''
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-gray-900">{alert.productName}</span>
                      <span className="text-sm text-gray-500">({alert.sku})</span>
                      {alert.location && (
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {alert.location}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{alert.message}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>{format(new Date(alert.createdAt), 'MMM dd, yyyy HH:mm')}</span>
                      <span className="capitalize">{alert.type.replace('_', ' ')}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!alert.isResolved && (
                      <button
                        onClick={() => resolveAlert(alert.id)}
                        className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Resolve
                      </button>
                    )}
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Forecast Tab */}
      {activeTab === 'forecast' && (
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Inventory Forecast</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => generateForecast(14)}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  14 Days
                </button>
                <button
                  onClick={() => generateForecast(30)}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  30 Days
                </button>
                <button
                  onClick={() => generateForecast(90)}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  90 Days
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current Stock</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Projected Demand</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Recommended Reorder</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stockout Risk</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Confidence</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {forecasts.map((forecast) => (
                    <tr key={forecast.productId} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {forecast.productName}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {forecast.currentStock}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {forecast.projectedDemand}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {forecast.recommendedReorder}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${getRiskColor(forecast.stockoutRisk)}`}>
                          {forecast.stockoutRisk.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {forecast.confidence}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Locations Tab */}
      {activeTab === 'locations' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {locations.map((location) => (
            <div key={location.id} className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{location.name}</h3>
                  <p className="text-sm text-gray-500 capitalize">{location.type.replace('_', ' ')}</p>
                  <p className="text-sm text-gray-600 mt-1">{location.address}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => createStockAudit(location.id)}
                    className="p-1 text-blue-600 hover:text-blue-800"
                  >
                    <Calendar className="w-4 h-4" />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-gray-600">
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Capacity Utilization</span>
                  <span className="text-sm font-medium">
                    {((location.currentUtilization / location.capacity) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${(location.currentUtilization / location.capacity) * 100}%` }}
                  ></div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <p className="text-sm text-gray-600">Products</p>
                    <p className="text-lg font-semibold">{location.products.length}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Capacity</p>
                    <p className="text-lg font-semibold">{location.capacity.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Audits Tab */}
      {activeTab === 'audits' && (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Audit Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Auditor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discrepancies</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {audits.map((audit) => (
                <tr key={audit.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {format(new Date(audit.auditDate), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {audit.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {audit.auditor}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      audit.status === 'completed' ? 'bg-green-100 text-green-800' :
                      audit.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                      audit.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {audit.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {audit.totalItems > 0 ? `${audit.auditedItems}/${audit.totalItems}` : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {audit.status === 'completed' ? audit.discrepancies : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-2">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="text-gray-400 hover:text-gray-600">
                      <Edit className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ComprehensiveInventory;