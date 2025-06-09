import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { 
  fetchProducts, 
  deleteProduct, 
  updateProductStock
} from '../store/slices/productsSlice';
import { 
  Package, 
  Search, 
  Edit, 
  Trash2, 
  Plus, 
  Filter, 
  Eye, 
  AlertTriangle,
  TrendingUp,
  BarChart3,
  Upload,
  DollarSign
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import AdvancedFilters from '../components/AdvancedFilters';
import useDebounce from '../hooks/useDebounce';
import BulkUpload from '../components/BulkUpload';

const Products: React.FC = () => {
  const dispatch = useAppDispatch();
  const { products, loading, error, totalProducts, categories, stockSummary, lowStockAlerts } = useAppSelector((state) => state.products);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'in-stock' | 'low-stock' | 'out-of-stock'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [advancedFilters, setAdvancedFilters] = useState<any>({});
  const [showBulkUpload, setShowBulkUpload] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);
  const [showStockModal, setShowStockModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [newStock, setNewStock] = useState(0);
  const [newThreshold, setNewThreshold] = useState(10);

  useEffect(() => {
    const filters = {
      search: debouncedSearchTerm,
      category: categoryFilter !== 'all' ? categoryFilter : undefined,
      stockFilter: statusFilter !== 'all' ? statusFilter : undefined,
      ...advancedFilters
    };
    dispatch(fetchProducts(filters));
  }, [dispatch, debouncedSearchTerm, categoryFilter, statusFilter, advancedFilters]);

  const handleDeleteProduct = async (productId: string, productName: string) => {
    if (!window.confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await dispatch(deleteProduct(productId)).unwrap();
      toast.success('Product deleted successfully');
    } catch (err: any) {
      toast.error(err || 'Failed to delete product');
    }
  };

  const handleUpdateStock = async () => {
    if (!selectedProduct) return;

    try {
      await dispatch(updateProductStock({
        id: selectedProduct.id,
        stock: newStock,
        lowStockThreshold: newThreshold
      })).unwrap();
      toast.success('Stock updated successfully');
      setShowStockModal(false);
      setSelectedProduct(null);
      // Refresh products list
      dispatch(fetchProducts({ search: '', category: '', stockFilter: '' }));
    } catch (err: any) {
      toast.error(err || 'Failed to update stock');
    }
  };

  const openStockModal = (product: any) => {
    setSelectedProduct(product);
    setNewStock(product.stock || 0);
    setNewThreshold(product.lowStockThreshold || 10);
    setShowStockModal(true);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const getStockStatus = (product: any) => {
    if (product.isOutOfStock || product.stock === 0) {
      return { label: 'Out of Stock', color: 'bg-red-100 text-red-800' };
    }
    if (product.isLowStock || (product.stock > 0 && product.stock <= (product.lowStockThreshold || 10))) {
      return { label: 'Low Stock', color: 'bg-yellow-100 text-yellow-800' };
    }
    return { label: 'In Stock', color: 'bg-green-100 text-green-800' };
  };

  const handleAdvancedFiltersChange = (filters: any) => {
    setAdvancedFilters(filters);
  };

  const handleClearAdvancedFilters = () => {
    setAdvancedFilters({});
  };

  const filteredProducts = products;

  if (loading && products.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-red-600 text-lg font-medium mb-4">{error}</p>
        <button 
          onClick={() => dispatch(fetchProducts())}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
          <p className="text-gray-600">Manage your product catalog and inventory</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowBulkUpload(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Upload className="h-4 w-4 mr-2" />
            Bulk Upload
          </button>
          <Link
            to="/products/new"
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Link>
        </div>
      </div>

      {/* Stock Summary Cards */}
      {stockSummary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{stockSummary.total}</p>
              </div>
              <Package className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Stock</p>
                <p className="text-2xl font-bold text-green-600">{stockSummary.inStock}</p>
              </div>
              <div className="h-3 w-3 bg-green-500 rounded-full"></div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Low Stock</p>
                <p className="text-2xl font-bold text-yellow-600">{stockSummary.lowStock}</p>
              </div>
              <div className="h-3 w-3 bg-yellow-500 rounded-full"></div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Out of Stock</p>
                <p className="text-2xl font-bold text-red-600">{stockSummary.outOfStock}</p>
              </div>
              <div className="h-3 w-3 bg-red-500 rounded-full"></div>
            </div>
          </div>
        </div>
      )}

      {/* Low Stock Alerts */}
      {lowStockAlerts.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="h-5 w-5 text-yellow-400">⚠️</div>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Low Stock Alert</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>{lowStockAlerts.length} products need attention:</p>
                <ul className="mt-1 space-y-1">
                  {lowStockAlerts.slice(0, 3).map((product: any) => (
                    <li key={product.id}>
                      • {product.name} ({product.stock} left)
                    </li>
                  ))}
                  {lowStockAlerts.length > 3 && (
                    <li>• And {lowStockAlerts.length - 3} more...</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow border">
        <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search products by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Stock Status</option>
              <option value="in-stock">In Stock</option>
              <option value="low-stock">Low Stock</option>
              <option value="out-of-stock">Out of Stock</option>
            </select>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </button>
          </div>
        </form>

        <AdvancedFilters
            type="products"
            onFiltersChange={handleAdvancedFiltersChange}
            onClearFilters={handleClearAdvancedFilters}
          />
      </div>

      {/* Products Grid */}
      <div className="bg-white rounded-lg shadow border">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-medium">Products ({totalProducts})</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
          {filteredProducts.map((product) => {
            const stockStatus = getStockStatus(product);
            return (
              <div key={product.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                {/* Product Image */}
                <div className="aspect-square bg-gray-100 flex items-center justify-center relative">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Package className="h-12 w-12 text-gray-400" />
                  )}
                  {product.isOutOfStock && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="text-white font-bold">OUT OF STOCK</span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900 truncate flex-1 mr-2">
                      {product.name}
                    </h4>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${stockStatus.color}`}>
                      {stockStatus.label}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center text-green-600 font-semibold">
                      <DollarSign className="h-4 w-4" />
                      {product.price}
                    </div>
                    <div className="text-sm text-gray-500">
                      Stock: <span className={product.isLowStock ? 'text-yellow-600 font-semibold' : product.isOutOfStock ? 'text-red-600 font-semibold' : ''}>{product.stock}</span>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 mb-3">
                    Category: {product.category}
                  </div>

                  {/* Stock Management */}
                  <button
                    onClick={() => openStockModal(product)}
                    className="w-full mb-2 px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded text-gray-700"
                    title="Update Stock"
                  >
                    Update Stock ({product.stock})
                  </button>

                  {/* Actions */}
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <Link
                        to={`/products/${product.id}`}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="View Product"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link
                        to={`/products/${product.id}/edit`}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                        title="Edit Product"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDeleteProduct(product.id, product.name)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        title="Delete Product"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, totalProducts)} of {totalProducts} products
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={currentPage * pageSize >= totalProducts}
                className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stock Management Modal */}
      {showStockModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Update Stock - {selectedProduct.name}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Stock: {selectedProduct.stock}
                </label>
                <input
                  type="number"
                  value={newStock}
                  onChange={(e) => setNewStock(parseInt(e.target.value) || 0)}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter new stock quantity"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Low Stock Threshold
                </label>
                <input
                  type="number"
                  value={newThreshold}
                  onChange={(e) => setNewThreshold(parseInt(e.target.value) || 10)}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter low stock threshold"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Alert when stock falls below this number
                </p>
              </div>

              <div className="text-sm text-gray-600">
                Status Preview: 
                <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${
                  newStock === 0 ? 'bg-red-100 text-red-800' :
                  newStock <= newThreshold ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {newStock === 0 ? 'Out of Stock' : newStock <= newThreshold ? 'Low Stock' : 'In Stock'}
                </span>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowStockModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStock}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Update Stock'}
              </button>
            </div>
          </div>
        </div>
      )}
      {showBulkUpload && (
        <BulkUpload
          type="products"
          onClose={() => {
            setShowBulkUpload(false);
            // Refresh products list after bulk upload
            dispatch(fetchProducts({ search: searchTerm }));
          }}
        />
      )}
    </div>
  );
};

export default Products;