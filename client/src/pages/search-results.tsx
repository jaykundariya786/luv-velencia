
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useProducts } from "@/hooks/use-products";
import ProductCard from "@/components/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronDown, X, SlidersHorizontal } from "lucide-react";

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const searchQuery = searchParams.get("q") || "";
  
  const [filters, setFilters] = useState({
    category: undefined as string | undefined,
    line: undefined as string | undefined,
    sort: "newest" as string,
    search: searchQuery,
    colors: [] as string[],
    materials: [] as string[],
  });

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const { data: products, isLoading, error } = useProducts(filters);

  useEffect(() => {
    setFilters(prev => ({ ...prev, search: searchQuery }));
  }, [searchQuery]);

  const toggleDropdown = (dropdown: string) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const handleFilterChange = (type: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [type]: value === "all" ? undefined : value
    }));
    setOpenDropdown(null);
  };

  const handleColorFilter = (color: string) => {
    setFilters(prev => ({
      ...prev,
      colors: prev.colors.includes(color) 
        ? prev.colors.filter(c => c !== color)
        : [...prev.colors, color]
    }));
  };

  const handleMaterialFilter = (material: string) => {
    setFilters(prev => ({
      ...prev,
      materials: prev.materials.includes(material)
        ? prev.materials.filter(m => m !== material)
        : [...prev.materials, material]
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      category: undefined,
      line: undefined,
      sort: "newest",
      search: searchQuery,
      colors: [],
      materials: [],
    });
  };

  const getCategoryLabel = () => {
    if (!filters.category) return "All Categories";
    return filters.category.charAt(0).toUpperCase() + filters.category.slice(1);
  };

  const getSortLabel = () => {
    switch (filters.sort) {
      case "price-low": return "Price: Low to High";
      case "price-high": return "Price: High to Low";
      case "newest": return "Newest";
      default: return "Relevance";
    }
  };

  const colors = ["Black", "White", "Brown", "Beige", "Blue", "Green", "Red", "Pink", "Grey", "Gold"];
  const materials = ["Leather", "GG Canvas", "Fabric", "Suede", "Canvas"];

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-600">Failed to load search results. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Search Again Section */}
        <div className="mb-6 md:mb-8">
          <div className="max-w-full md:max-w-md">
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              const newQuery = formData.get('search') as string;
              if (newQuery.trim()) {
                navigate(`/search?q=${encodeURIComponent(newQuery.trim())}`);
              }
            }} className="relative">
              <input
                name="search"
                type="text"
                placeholder="Search for other products..."
                className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none text-sm transition-colors duration-200"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-black transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-light tracking-wide gucci-heading">
              "{searchQuery}" ({products?.length || 0})
            </h1>
          </div>
          <div className="flex items-center gap-3 md:gap-4">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowMobileFilters(true)}
              className="md:hidden flex items-center gap-2 px-3 md:px-4 py-2 border border-gray-300 text-xs md:text-sm"
            >
              <SlidersHorizontal className="w-4 h-4" />
              FILTER
            </button>
            
            {/* Sort Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown("sort")}
                className="flex items-center gap-2 px-3 md:px-4 py-2 border border-gray-300 text-xs md:text-sm font-medium"
              >
                SORT BY
                <ChevronDown className="w-4 h-4" />
              </button>
              {openDropdown === "sort" && (
                <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 shadow-lg z-20 min-w-48">
                  <button
                    onClick={() => handleFilterChange("sort", "newest")}
                    className="block w-full text-left px-4 py-3 text-sm hover:bg-gray-50"
                  >
                    Newest
                  </button>
                  <button
                    onClick={() => handleFilterChange("sort", "price-low")}
                    className="block w-full text-left px-4 py-3 text-sm hover:bg-gray-50"
                  >
                    Price: Low to High
                  </button>
                  <button
                    onClick={() => handleFilterChange("sort", "price-high")}
                    className="block w-full text-left px-4 py-3 text-sm hover:bg-gray-50"
                  >
                    Price: High to Low
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          {/* Desktop Sidebar Filters */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <div className="space-y-6">
              {/* Filter Header */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium gucci-heading">FILTER</h3>
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-gray-600 hover:text-black"
                >
                  Reset All
                </button>
              </div>

              {/* Category Filter */}
              <div>
                <button
                  onClick={() => toggleDropdown("category")}
                  className="flex items-center justify-between w-full py-3 text-sm font-medium border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200"
                >
                  Shop by Category
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${
                    openDropdown === "category" ? "rotate-180" : ""
                  }`} />
                </button>
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openDropdown === "category" 
                    ? "max-h-96 opacity-100 mt-2" 
                    : "max-h-0 opacity-0 mt-0"
                }`}>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleFilterChange("category", "all")}
                      className="block w-full text-left py-2 text-sm hover:text-gray-600 hover:bg-gray-50 transition-all duration-200 transform hover:translate-x-1"
                    >
                      All
                    </button>
                    <button
                      onClick={() => handleFilterChange("category", "shoes")}
                      className="block w-full text-left py-2 text-sm hover:text-gray-600 hover:bg-gray-50 transition-all duration-200 transform hover:translate-x-1"
                    >
                      Shoes
                    </button>
                    <button
                      onClick={() => handleFilterChange("category", "bags")}
                      className="block w-full text-left py-2 text-sm hover:text-gray-600 hover:bg-gray-50 transition-all duration-200 transform hover:translate-x-1"
                    >
                      Bags
                    </button>
                    <button
                      onClick={() => handleFilterChange("category", "clothing")}
                      className="block w-full text-left py-2 text-sm hover:text-gray-600 hover:bg-gray-50 transition-all duration-200 transform hover:translate-x-1"
                    >
                      Clothing
                    </button>
                    <button
                      onClick={() => handleFilterChange("category", "jewelry")}
                      className="block w-full text-left py-2 text-sm hover:text-gray-600 hover:bg-gray-50 transition-all duration-200 transform hover:translate-x-1"
                    >
                      Jewelry
                    </button>
                  </div>
                </div>
              </div>

              {/* Material Filter */}
              <div>
                <button
                  onClick={() => toggleDropdown("material")}
                  className="flex items-center justify-between w-full py-3 text-sm font-medium border-b border-gray-200"
                >
                  Material
                  <ChevronDown className="w-4 h-4" />
                </button>
                {openDropdown === "material" && (
                  <div className="mt-2 space-y-2">
                    {materials.map((material) => (
                      <label key={material} className="flex items-center gap-2 py-1">
                        <input
                          type="checkbox"
                          checked={filters.materials.includes(material.toLowerCase())}
                          onChange={() => handleMaterialFilter(material.toLowerCase())}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">{material}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Color Filter */}
              <div>
                <button
                  onClick={() => toggleDropdown("color")}
                  className="flex items-center justify-between w-full py-3 text-sm font-medium border-b border-gray-200"
                >
                  Color
                  <ChevronDown className="w-4 h-4" />
                </button>
                {openDropdown === "color" && (
                  <div className="mt-2 space-y-2">
                    {colors.map((color) => (
                      <label key={color} className="flex items-center gap-2 py-1">
                        <input
                          type="checkbox"
                          checked={filters.colors.includes(color.toLowerCase())}
                          onChange={() => handleColorFilter(color.toLowerCase())}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">{color}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="space-y-2 md:space-y-4">
                    <Skeleton className="aspect-square w-full" />
                    <Skeleton className="h-3 md:h-4 w-3/4" />
                    <Skeleton className="h-3 md:h-4 w-1/2" />
                    <Skeleton className="h-3 md:h-4 w-1/4" />
                  </div>
                ))}
              </div>
            ) : (
              <>
                {products?.length === 0 ? (
                  <div className="text-center py-16">
                    <p className="text-gray-600 text-lg">
                      No products found for "{searchQuery}".
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
                      Try adjusting your search terms or browse our categories.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                      {products?.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>

                    {products && products.length > 0 && (
                      <div className="text-center mt-8 md:mt-12">
                        <button className="bg-black text-white px-6 md:px-8 py-3 text-sm font-medium hover:bg-gray-800 transition-colors w-full md:w-auto">
                          LOAD MORE
                        </button>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Overlay */}
      {showMobileFilters && (
        <div className="fixed inset-0 bg-white z-50 md:hidden overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-medium gucci-heading">FILTER</h2>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="p-2"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Mobile Search Section */}
            <div className="mb-6">
              <h3 className="font-medium mb-3">Search Again</h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                const newQuery = formData.get('mobileSearch') as string;
                if (newQuery.trim()) {
                  navigate(`/search?q=${encodeURIComponent(newQuery.trim())}`);
                  setShowMobileFilters(false);
                }
              }} className="relative">
                <input
                  name="mobileSearch"
                  type="text"
                  placeholder="Search for other products..."
                  className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none text-sm transition-colors duration-200"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-black transition-colors duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </form>
            </div>

            <div className="space-y-6">
              {/* Mobile filters content - similar to desktop but in mobile layout */}
              <div className="space-y-4">
                <h3 className="font-medium">Category</h3>
                <div className="space-y-2">
                  {["All", "Shoes", "Bags", "Clothing", "Jewelry"].map((cat, index) => (
                    <button
                      key={cat}
                      onClick={() => {
                        handleFilterChange("category", cat.toLowerCase());
                        setShowMobileFilters(false);
                      }}
                      className="block w-full text-left py-2 text-sm hover:text-gray-600 hover:bg-gray-50 transition-all duration-200 transform hover:translate-x-2 animate-fadeInUp"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Material</h3>
                <div className="space-y-2">
                  {materials.map((material) => (
                    <label key={material} className="flex items-center gap-2 py-1">
                      <input
                        type="checkbox"
                        checked={filters.materials.includes(material.toLowerCase())}
                        onChange={() => handleMaterialFilter(material.toLowerCase())}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">{material}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Color</h3>
                <div className="space-y-2">
                  {colors.map((color) => (
                    <label key={color} className="flex items-center gap-2 py-1">
                      <input
                        type="checkbox"
                        checked={filters.colors.includes(color.toLowerCase())}
                        onChange={() => handleColorFilter(color.toLowerCase())}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">{color}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-3 pb-6">
              <button
                onClick={clearAllFilters}
                className="w-full py-3 border border-gray-300 text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                CLEAR ALL
              </button>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-full py-3 bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                APPLY FILTERS
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
