import React, { useEffect, useState } from "react";
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
  DollarSign,
  Star,
  Heart,
  ShoppingCart,
  Tag,
  Layers,
  Image,
  RefreshCw,
  MoreVertical,
  Copy,
  Archive,
  Grid,
  List,
  SortAsc,
  SortDesc,
  Download,
} from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/LoadingSpinner";
import { productsAPI } from "../services/api";

interface ProductData {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  stock: number;
  category: string;
  subcategory?: string;
  images: string[];
  sizes: string[];
  colors: string[];
  tags: string[];
  isActive: boolean;
  isFeatured: boolean;
  rating: number;
  reviewCount: number;
  soldCount: number;
  lowStockThreshold: number;
  sku: string;
  brand: string;
  material?: string;
  weight?: number;
  dimensions?: string;
  createdAt: string;
  updatedAt: string;
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive" | "low-stock" | "out-of-stock"
  >("all");
  const [sortBy, setSortBy] = useState<
    "name" | "price" | "stock" | "created" | "rating"
  >("created");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductData | null>(
    null
  );
  const [newStock, setNewStock] = useState(0);
  const [categories, setCategories] = useState<string[]>([]);

  const loadCategories = async () => {
    try {
      const response = await productsAPI.getCategories();
      if (response.success && response.data) {
        const categoryNames = response.data.categories.map((cat: any) => cat.name);
        setCategories(categoryNames);
      }
    } catch (err) {
      console.error('Load categories error:', err);
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: currentPage,
        limit: pageSize,
        search: searchTerm,
        category: categoryFilter !== "all" ? categoryFilter : undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
      };

      const response = await productsAPI.getProducts(params);
      
      if (response.success && response.data) {
        // Handle both direct products array and nested data structure
        const productsArray = response.data.products || response.data;
        const transformedProducts = (Array.isArray(productsArray) ? productsArray : []).map((product: any) => ({
          id: product._id,
          name: product.name,
          description: product.description,
          price: product.basePrice || product.salePrice || 0,
          originalPrice: product.basePrice > product.salePrice ? product.basePrice : undefined,
          stock: product.totalStock || 0,
          category: product.category?.name || product.category,
          subcategory: product.subcategory?.name || product.subcategory,
          images: product.images || [],
          sizes: product.variants?.map((v: any) => v.size).filter(Boolean) || [],
          colors: product.variants?.map((v: any) => v.color).filter(Boolean) || [],
          tags: product.tags || [],
          isActive: product.status === 'active',
          isFeatured: product.isFeature || false,
          rating: product.averageRating || 0,
          reviewCount: product.reviewsCount || 0,
          soldCount: product.purchases || 0,
          lowStockThreshold: product.lowStockThreshold || 10,
          sku: product.variants?.[0]?.sku || product.sku || '',
          brand: product.brand || 'Lux Valencia',
          material: product.variants?.[0]?.material || '',
          weight: product.variants?.[0]?.weight || 0,
          dimensions: product.variants?.[0]?.dimensions || '',
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
        }));

        setProducts(transformedProducts);
      } else {
        throw new Error(response.message || 'Failed to load products');
      }
    } catch (err) {
      console.error('Load products error:', err);
      setError(err instanceof Error ? err.message : "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
    loadProducts();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [currentPage, searchTerm, categoryFilter, statusFilter, sortBy, sortOrder]);

  const getStockStatus = (product: ProductData) => {
    if (product.stock === 0)
      return {
        status: "out-of-stock",
        color: "text-red-600",
        bg: "bg-red-100",
      };
    if (product.stock <= product.lowStockThreshold)
      return {
        status: "low-stock",
        color: "text-yellow-600",
        bg: "bg-yellow-100",
      };
    return { status: "in-stock", color: "text-green-600", bg: "bg-green-100" };
  };

  const getDiscountPercentage = (price: number, originalPrice?: number) => {
    if (!originalPrice || originalPrice <= price) return 0;
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };

  const handleDeleteProduct = async (
    productId: string,
    productName: string
  ) => {
    if (
      !window.confirm(
        `Are you sure you want to delete "${productName}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      const response = await productsAPI.deleteProduct(productId);
      if (response.success) {
        const updatedProducts = products.filter((p) => p.id !== productId);
        setProducts(updatedProducts);
        toast.success("Product deleted successfully");
      } else {
        throw new Error(response.message || 'Failed to delete product');
      }
    } catch (err) {
      console.error('Delete product error:', err);
      toast.error("Failed to delete product");
    }
  };

  const handleToggleActive = async (productId: string) => {
    try {
      const product = products.find(p => p.id === productId);
      if (!product) return;

      const response = await productsAPI.updateProduct(productId, {
        status: product.isActive ? 'inactive' : 'active'
      });
      
      if (response.success) {
        const updatedProducts = products.map((p) =>
          p.id === productId ? { ...p, isActive: !p.isActive } : p
        );
        setProducts(updatedProducts);
        toast.success("Product status updated");
      } else {
        throw new Error(response.message || 'Failed to update product status');
      }
    } catch (err) {
      console.error('Toggle active error:', err);
      toast.error("Failed to update product status");
    }
  };

  const handleUpdateStock = async () => {
    if (!selectedProduct) return;

    try {
      const response = await productsAPI.updateProductStock(selectedProduct.id, {
        stock: newStock,
        lowStockThreshold: selectedProduct.lowStockThreshold
      });
      
      if (response.success) {
        const updatedProducts = products.map((p) =>
          p.id === selectedProduct.id ? { ...p, stock: newStock } : p
        );
        setProducts(updatedProducts);
        setShowStockModal(false);
        setSelectedProduct(null);
        toast.success("Stock updated successfully");
      } else {
        throw new Error(response.message || 'Failed to update stock');
      }
    } catch (err) {
      console.error('Update stock error:', err);
      toast.error("Failed to update stock");
    }
  };

  const handleImportProducts = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".csv,.xlsx,.json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        toast.success(`Importing products from ${file.name}...`);
        // Simulate import process
        setTimeout(() => {
          toast.success("Products imported successfully!");
          loadProducts(); // Reload products
        }, 2000);
      }
    };
    input.click();
  };

  const handleExportProducts = () => {
    const csvContent = [
      ["Name", "SKU", "Price", "Stock", "Category", "Status"],
      ...products.map((p) => [
        p.name,
        p.sku,
        p.price.toString(),
        p.stock.toString(),
        p.category,
        p.isActive ? "Active" : "Inactive",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `products-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Products exported successfully!");
  };

  const handleDuplicateProduct = (product: ProductData) => {
    const duplicated = {
      ...product,
      id: (Math.max(...products.map((p) => parseInt(p.id))) + 1).toString(),
      name: `${product.name} (Copy)`,
      sku: `${product.sku}-COPY`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProducts((prev) => [duplicated, ...prev]);
    toast.success("Product duplicated successfully!");
  };

  const handleToggleFeatured = (productId: string) => {
    const updatedProducts = products.map((p) =>
      p.id === productId ? { ...p, isFeatured: !p.isFeatured } : p
    );
    setProducts(updatedProducts);
    toast.success("Product featured status updated");
  };

  const handleBulkAction = (action: string) => {
    if (selectedProducts.length === 0) {
      toast.error("Please select products first");
      return;
    }

    switch (action) {
      case "activate":
        setProducts((prev) =>
          prev.map((p) =>
            selectedProducts.includes(p.id) ? { ...p, isActive: true } : p
          )
        );
        toast.success(`${selectedProducts.length} products activated`);
        break;
      case "deactivate":
        setProducts((prev) =>
          prev.map((p) =>
            selectedProducts.includes(p.id) ? { ...p, isActive: false } : p
          )
        );
        toast.success(`${selectedProducts.length} products deactivated`);
        break;
      case "delete":
        if (
          window.confirm(`Delete ${selectedProducts.length} selected products?`)
        ) {
          setProducts((prev) =>
            prev.filter((p) => !selectedProducts.includes(p.id))
          );
          toast.success(`${selectedProducts.length} products deleted`);
        }
        break;
      case "feature":
        setProducts((prev) =>
          prev.map((p) =>
            selectedProducts.includes(p.id) ? { ...p, isFeatured: true } : p
          )
        );
        toast.success(`${selectedProducts.length} products featured`);
        break;
    }
    setSelectedProducts([]);
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || product.category === categoryFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && product.isActive) ||
      (statusFilter === "inactive" && !product.isActive) ||
      (statusFilter === "low-stock" &&
        product.stock <= product.lowStockThreshold) ||
      (statusFilter === "out-of-stock" && product.stock === 0);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    let aValue, bValue;
    switch (sortBy) {
      case "name":
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case "price":
        aValue = a.price;
        bValue = b.price;
        break;
      case "stock":
        aValue = a.stock;
        bValue = b.stock;
        break;
      case "rating":
        aValue = a.rating;
        bValue = b.rating;
        break;
      case "created":
      default:
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
        break;
    }

    if (sortOrder === "asc") {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  const totalPages = Math.ceil(sortedProducts.length / pageSize);
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const stats = {
    total: products.length,
    active: products.filter((p) => p.isActive).length,
    lowStock: products.filter(
      (p) => p.stock <= p.lowStockThreshold && p.stock > 0
    ).length,
    outOfStock: products.filter((p) => p.stock === 0).length,
    featured: products.filter((p) => p.isFeatured).length,
  };

  if (loading) {
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
          onClick={loadProducts}
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
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Product Catalog
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your product inventory and listings
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={loadProducts}
              className="flex items-center space-x-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-200 hover:shadow-md"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </button>
            <button
              onClick={handleExportProducts}
              className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all duration-200 hover:shadow-md"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
            <button
              onClick={handleImportProducts}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 hover:shadow-md"
            >
              <Upload className="h-4 w-4" />
              <span>Import</span>
            </button>
            <button
              onClick={() =>
                toast.success("Add Product feature - Navigate to product form!")
              }
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 hover:shadow-md"
            >
              <Plus className="h-4 w-4" />
              <span>Add Product</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Products
              </p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Package className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-green-600">
                {stats.active}
              </p>
            </div>
            <Eye className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Low Stock</p>
              <p className="text-2xl font-bold text-yellow-600">
                {stats.lowStock}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Out of Stock</p>
              <p className="text-2xl font-bold text-red-600">
                {stats.outOfStock}
              </p>
            </div>
            <Package className="h-8 w-8 text-red-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Featured</p>
              <p className="text-2xl font-bold text-purple-600">
                {stats.featured}
              </p>
            </div>
            <Star className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="low-stock">Low Stock</option>
              <option value="out-of-stock">Out of Stock</option>
            </select>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              >
                <option value="created">Created Date</option>
                <option value="name">Name</option>
                <option value="price">Price</option>
                <option value="stock">Stock</option>
                <option value="rating">Rating</option>
              </select>
              <button
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
                className="p-1 text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                {sortOrder === "asc" ? (
                  <SortAsc className="h-4 w-4" />
                ) : (
                  <SortDesc className="h-4 w-4" />
                )}
              </button>
            </div>
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 transition-all duration-200 ${
                  viewMode === "grid"
                    ? "bg-blue-500 text-white"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 transition-all duration-200 ${
                  viewMode === "list"
                    ? "bg-blue-500 text-white"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedProducts.length > 0 && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-900">
                {selectedProducts.length} product(s) selected
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleBulkAction("activate")}
                  className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                >
                  Activate
                </button>
                <button
                  onClick={() => handleBulkAction("deactivate")}
                  className="px-3 py-1 text-xs bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
                >
                  Deactivate
                </button>
                <button
                  onClick={() => handleBulkAction("feature")}
                  className="px-3 py-1 text-xs bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                >
                  Feature
                </button>
                <button
                  onClick={() => handleBulkAction("delete")}
                  className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
                <button
                  onClick={() => setSelectedProducts([])}
                  className="px-3 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Products Grid/List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
            {paginatedProducts.map((product) => {
              const stockStatus = getStockStatus(product);
              const discount = getDiscountPercentage(
                product.price,
                product.originalPrice
              );

              return (
                <div
                  key={product.id}
                  className="group relative bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative">
                    {/* Selection Checkbox */}
                    <div className="absolute top-2 left-2 z-10">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedProducts((prev) => [
                              ...prev,
                              product.id,
                            ]);
                          } else {
                            setSelectedProducts((prev) =>
                              prev.filter((id) => id !== product.id)
                            );
                          }
                        }}
                        className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                      />
                    </div>
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {discount > 0 && (
                      <span className="absolute top-2 right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        -{discount}%
                      </span>
                    )}
                    {product.isFeatured && (
                      <div className="absolute top-8 right-2">
                        <Star className="h-5 w-5 text-yellow-500 fill-current drop-shadow-lg" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="flex space-x-2">
                        <button
                          onClick={() =>
                            toast.success(`Viewing ${product.name} details`)
                          }
                          className="p-2 bg-white rounded-full text-gray-800 hover:bg-gray-100 transition-all duration-200 hover:scale-110"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() =>
                            toast.success(`Editing ${product.name}`)
                          }
                          className="p-2 bg-white rounded-full text-gray-800 hover:bg-gray-100 transition-all duration-200 hover:scale-110"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDuplicateProduct(product)}
                          className="p-2 bg-white rounded-full text-gray-800 hover:bg-gray-100 transition-all duration-200 hover:scale-110"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-gray-900 text-sm truncate flex-1 mr-2">
                        {product.name}
                      </h3>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${stockStatus.bg} ${stockStatus.color}`}
                      >
                        {product.stock}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-1">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < Math.floor(product.rating)
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">
                          ({product.reviewCount})
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {product.soldCount} sold
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-gray-900 text-lg">
                          ${product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">
                            ${product.originalPrice}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => handleToggleFeatured(product.id)}
                        className={`p-1 ${
                          product.isFeatured
                            ? "text-yellow-500"
                            : "text-gray-400"
                        } hover:scale-110 transition-transform`}
                        title={product.isFeatured ? "Unfeature" : "Feature"}
                      >
                        <Star
                          className={`h-4 w-4 ${
                            product.isFeatured ? "fill-current" : ""
                          }`}
                        />
                      </button>
                    </div>
                    <div className="grid grid-cols-4 gap-1">
                      <button
                        onClick={() => {
                          setSelectedProduct(product);
                          setNewStock(product.stock);
                          setShowStockModal(true);
                        }}
                        className="p-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                        title="Update Stock"
                      >
                        <Package className="h-4 w-4 mx-auto" />
                      </button>
                      <button
                        onClick={() => handleToggleActive(product.id)}
                        className={`p-2 rounded transition-colors ${
                          product.isActive
                            ? "bg-green-50 text-green-600 hover:bg-green-100"
                            : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                        }`}
                        title={product.isActive ? "Deactivate" : "Activate"}
                      >
                        <Eye className="h-4 w-4 mx-auto" />
                      </button>
                      <button
                        onClick={() => handleDuplicateProduct(product)}
                        className="p-2 bg-purple-50 text-purple-600 rounded hover:bg-purple-100 transition-colors"
                        title="Duplicate"
                      >
                        <Copy className="h-4 w-4 mx-auto" />
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteProduct(product.id, product.name)
                        }
                        className="p-2 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4 mx-auto" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {paginatedProducts.map((product) => {
              const stockStatus = getStockStatus(product);
              const discount = getDiscountPercentage(
                product.price,
                product.originalPrice
              );

              return (
                <div key={product.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <div className="relative flex-shrink-0">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      {discount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1 py-0.5 rounded text-[10px]">
                          -{discount}%
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-gray-900">
                            {product.name}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {product.description}
                          </p>
                          <div className="flex items-center mt-2 space-x-4">
                            <span className="text-sm text-gray-500">
                              SKU: {product.sku}
                            </span>
                            <span className="text-sm text-gray-500">
                              Category: {product.category}
                            </span>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${
                                    i < Math.floor(product.rating)
                                      ? "text-yellow-400 fill-current"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                              <span className="text-xs text-gray-500 ml-1">
                                ({product.reviewCount})
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-gray-900">
                                ${product.price}
                              </span>
                              {product.originalPrice && (
                                <span className="text-sm text-gray-500 line-through">
                                  ${product.originalPrice}
                                </span>
                              )}
                            </div>
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${stockStatus.bg} ${stockStatus.color}`}
                            >
                              Stock: {product.stock}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Link
                              to={`/products/${product.id}`}
                              className="p-2 text-gray-600 hover:text-blue-600"
                            >
                              <Eye className="h-4 w-4" />
                            </Link>
                            <Link
                              to={`/products/${product.id}/edit`}
                              className="p-2 text-gray-600 hover:text-gray-900"
                            >
                              <Edit className="h-4 w-4" />
                            </Link>
                            <button
                              onClick={() => {
                                setSelectedProduct(product);
                                setNewStock(product.stock);
                                setShowStockModal(true);
                              }}
                              className="p-2 text-gray-600 hover:text-blue-600"
                            >
                              <Package className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteProduct(product.id, product.name)
                              }
                              className="p-2 text-gray-600 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {(currentPage - 1) * pageSize + 1} to{" "}
                {Math.min(currentPage * pageSize, sortedProducts.length)} of{" "}
                {sortedProducts.length} results
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 text-sm border rounded ${
                        currentPage === page
                          ? "bg-blue-600 text-white border-blue-600"
                          : "border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stock Update Modal */}
      {showStockModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">
              Update Stock: {selectedProduct.name}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Stock
                </label>
                <p className="text-2xl font-bold text-gray-900">
                  {selectedProduct.stock}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Stock Quantity
                </label>
                <input
                  type="number"
                  value={newStock}
                  onChange={(e) => setNewStock(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  min="0"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowStockModal(false);
                  setSelectedProduct(null);
                }}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStock}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Update Stock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
