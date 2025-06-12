import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useProducts } from "@/hooks/use-products";
import ProductCard from "@/components/product-card";
import ProductSkeleton from "@/components/product-skeleton";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  X,
  SlidersHorizontal,
  Search,
  Filter,
  Grid3X3,
  Sparkles,
} from "lucide-react";

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

  const { data, isLoading, error } = useProducts(filters);
  const products = data?.products;
  const total = data?.total || 0;

  useEffect(() => {
    setFilters((prev) => ({ ...prev, search: searchQuery }));
  }, [searchQuery]);

  const toggleDropdown = (dropdown: string) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const handleFilterChange = (type: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [type]: value === "all" ? undefined : value,
    }));
    setOpenDropdown(null);
  };

  const handleColorFilter = (color: string) => {
    setFilters((prev) => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter((c) => c !== color)
        : [...prev.colors, color],
    }));
  };

  const handleMaterialFilter = (material: string) => {
    setFilters((prev) => ({
      ...prev,
      materials: prev.materials.includes(material)
        ? prev.materials.filter((m) => m !== material)
        : [...prev.materials, material],
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

  // Fetch dynamic filter data
  const {
    data: filterData,
    isLoading: filterLoading,
    error: filterError,
  } = useQuery({
    queryKey: ["filter-data"],
    queryFn: async () => {
      try {
        const response = await fetch("/api/products");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        const products = data.products || [];

        // Calculate category counts
        const categoryCounts = products.reduce((acc: any, product: any) => {
          const category = product.category?.toLowerCase() || "uncategorized";
          acc[category] = (acc[category] || 0) + 1;
          return acc;
        }, {});

        // Calculate line counts
        const lineCounts = products.reduce((acc: any, product: any) => {
          const line = product.line?.toLowerCase();
          if (line) {
            acc[line] = (acc[line] || 0) + 1;
          }
          return acc;
        }, {});

        // Get unique colors - handle both string and parsed JSON
        const uniqueColors = [
          ...new Set(
            products.flatMap((product: any) => {
              let colors = product.colors;
              if (typeof colors === "string") {
                try {
                  colors = JSON.parse(colors);
                } catch {
                  colors = [colors];
                }
              }
              return Array.isArray(colors)
                ? colors.map((color: string) => color.toLowerCase())
                : [];
            }),
          ),
        ].sort();

        // Get unique materials - handle both string and parsed JSON
        const uniqueMaterials = [
          ...new Set(
            products.flatMap((product: any) => {
              let materials = product.materials;
              if (typeof materials === "string") {
                try {
                  materials = JSON.parse(materials);
                } catch {
                  materials = [materials];
                }
              }
              return Array.isArray(materials)
                ? materials.map((material: string) => material.toLowerCase())
                : [];
            }),
          ),
        ].sort();

        // If no data found, provide default categories
        const defaultCategories = {
          shoes: 0,
          clothing: 0,
          accessories: 0,
          bags: 0,
          jewelry: 0,
        };

        const defaultLines = {
          premium: 0,
          classic: 0,
          modern: 0,
          luxury: 0,
        };

        const defaultColors = [
          "black",
          "white",
          "brown",
          "blue",
          "red",
          "green",
          "pink",
          "gray",
        ];
        const defaultMaterials = [
          "leather",
          "cotton",
          "silk",
          "wool",
          "polyester",
          "denim",
        ];

        return {
          total: products.length,
          categories:
            Object.keys(categoryCounts).length > 0
              ? categoryCounts
              : defaultCategories,
          lines: Object.keys(lineCounts).length > 0 ? lineCounts : defaultLines,
          colors: uniqueColors.length > 0 ? uniqueColors : defaultColors,
          materials:
            uniqueMaterials.length > 0 ? uniqueMaterials : defaultMaterials,
        };
      } catch (error) {
        console.error("Error fetching filter data:", error);
        return {
          total: 0,
          categories: {
            shoes: 0,
            clothing: 0,
            accessories: 0,
            bags: 0,
            jewelry: 0,
          },
          lines: {
            premium: 0,
            classic: 0,
            modern: 0,
            luxury: 0,
          },
          colors: [
            "black",
            "white",
            "brown",
            "blue",
            "red",
            "green",
            "pink",
            "gray",
          ],
          materials: [
            "leather",
            "cotton",
            "silk",
            "wool",
            "polyester",
            "denim",
          ],
        };
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const colors = filterData?.colors || [
    "black",
    "white",
    "brown",
    "blue",
    "red",
  ];
  const materials = filterData?.materials || ["leather", "cotton", "silk"];
  const categories = filterData?.categories || {};
  const lines = filterData?.lines || {};

  if (isLoading && !products?.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
            <Sparkles className="w-6 h-6 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <p className="text-lg font-medium text-gray-700 animate-pulse">
            Discovering amazing products...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto">
          <p className="text-red-600 font-medium">
            Failed to load search results. Please try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Hero Section - Wallet Style */}
      <div
        className="relative h-[400px] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')",
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl md:text-5xl lv-luxury text-primary lv-fade-in tracking-[0.2em] drop-shadow-2xl">
              SEARCH RESULTS
            </h1>
          </div>
        </div>

        {/* Diamond Logo */}
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-r from-[#0b3e27] to-[#197149] rotate-45 flex items-center justify-center">
          <span className="text-white text-lg font-bold transform -rotate-45">
            S
          </span>
        </div>
      </div>

      {/* Search and Controls Section */}
      <div className="max-w-7xl mx-auto px-4 pt-20 pb-6 bg-white border-b border-gray-100">
        {/* Enhanced Search Section */}
        <div className="text-center mb-8">
          <h2 className="lv-luxury font-bold text-primary text-3xl text-black mb-4">
            REFINE YOUR SEARCH
          </h2>
          <div className="w-16 h-px bg-black mx-auto mb-8"></div>

          <div className="max-w-2xl mx-auto">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                const newQuery = formData.get("search") as string;
                if (newQuery.trim()) {
                  navigate(`/search?q=${encodeURIComponent(newQuery.trim())}`);
                }
              }}
              className="relative "
            >
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                name="search"
                type="text"
                placeholder="Search for products..."
                className="lv-body text-gray-500 font-mono lv-transition w-full rounded-full pl-12 pr-32 py-4 border border-gray-200 focus:border-primary focus:outline-none text-sm transition-all duration-300"
              />
              <button
                type="submit"
                className="lv-luxury text-md font-bold text-primary text-sm mb-4 block absolute right-2 rounded-full top-1/2 transform -translate-y-1/2 bg-primary text-white px-6 py-2 hover:bg-primary/80 transition-colors duration-300"
              >
                Search
              </button>
            </form>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowMobileFilters(true)}
              className="lg:hidden flex items-center rounded-full gap-2 px-6 py-3 border border-gray-300 text-sm uppercase tracking-wider font-medium hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>

          <div className="relative">
            <button
              onClick={() => toggleDropdown("sort")}
              className="flex lv-luxury text-md font-bold text-primary items-center gap-2 rounded-full px-6 py-3 border border-gray-300 text-sm hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
            >
              Sort by
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-300 ${
                  openDropdown === "sort" ? "rotate-180" : ""
                }`}
              />
            </button>
            {openDropdown === "sort" && (
              <div className="absolute top-full rounded-3xl right-0 mt-2 bg-white border border-gray-200 shadow-lg z-20 min-w-56 overflow-hidden">
                {["newest", "price-low", "price-high"].map((sortOption) => (
                  <button
                    key={sortOption}
                    onClick={() => handleFilterChange("sort", sortOption)}
                    className="block w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors duration-200 uppercase tracking-wider"
                  >
                    {sortOption === "newest"
                      ? "Newest"
                      : sortOption === "price-low"
                        ? "Price: Low to High"
                        : "Price: High to Low"}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col max-w-7xl mx-auto px-4 py-8 lg:flex-row gap-8">
        {/* Enhanced Desktop Sidebar */}
        <div className="sticky  rounded-3xl hover:shadow-lg top-8 hidden lg:block w-80 flex-shrink-0 bg-white border border-gray-100 p-8 space-y-2">
          <div className="text-center">
            <h3 className="lv-luxury text-lg font-bold text-primary mb-4">
              FILTERS
            </h3>
            <div className="w-12 h-px bg-black mx-auto mb-6"></div>
            <button
              onClick={clearAllFilters}
              className="lv-body font-mono lv-transition text-xs text-gray-500 hover:text-primary transition-colors duration-200"
            >
              Reset All
            </button>
          </div>

          {/* Category Filter */}
          <div className="space-y-4">
            <button
              onClick={() => toggleDropdown("category")}
              className="flex lv-luxury mb-4 text-md font-bold text-primary items-center justify-between w-full py-4 px-0 text-sm border-b border-gray-200 hover:border-black transition-all duration-200"
            >
              Shop by Category
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-300 ${
                  openDropdown === "category" ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-500 ease-out ${
                openDropdown === "category"
                  ? "max-h-96 opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div className="space-y-2">
                <button
                  onClick={() => handleFilterChange("category", "all")}
                  className="lv-body hover:text-primary font-mono lv-transition block w-full text-left py-2 text-sm text-gray-600 hover:text-black transition-colors duration-200"
                >
                  All ({filterData?.total || 0})
                </button>
                {Object.entries(categories).map(([category, count]) => (
                  <button
                    key={category}
                    onClick={() => handleFilterChange("category", category)}
                    className="lv-body hover:text-primary font-mono lv-transition block w-full text-left py-2 text-sm text-gray-600 hover:text-black transition-colors duration-200 capitalize"
                  >
                    {category.replace(/-/g, " ")} ({count})
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Enhanced Material Filter */}
          <div className="space-y-4">
            <button
              onClick={() => toggleDropdown("material")}
              className="flex lv-luxury mb-4 text-md font-bold text-primary items-center justify-between w-full py-4 px-0 text-sm border-b border-gray-200 hover:border-black transition-all duration-200"
            >
              Material
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-300 ${
                  openDropdown === "material" ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-500 ease-out ${
                openDropdown === "material"
                  ? "max-h-96 opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div className="space-y-2">
                {materials.map((material) => (
                  <label
                    key={material}
                    className="flex items-center gap-3 py-2 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={filters.materials.includes(
                        material.toLowerCase(),
                      )}
                      onChange={() =>
                        handleMaterialFilter(material.toLowerCase())
                      }
                      className="w-4 h-4 text-black border-gray-300 accent-primary focus:ring-black rounded"
                    />
                    <span className="lv-body hover:text-primary font-mono lv-transition text-sm text-gray-600 group-hover:text-black transition-colors duration-200">
                      {material}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Enhanced Color Filter */}
          <div className="space-y-4">
            <button
              onClick={() => toggleDropdown("color")}
              className="flex lv-luxury mb-4 text-md font-bold text-primary items-center justify-between w-full py-4 px-0 text-sm border-b border-gray-200 hover:border-black transition-all duration-200"
            >
              Color
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-300 ${
                  openDropdown === "color" ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-500 ease-out ${
                openDropdown === "color"
                  ? "max-h-96 opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div className="space-y-3 pt-2">
                {colors.map((color) => (
                  <label
                    key={color}
                    className="flex items-center gap-3 py-2 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={filters.colors.includes(color.toLowerCase())}
                      onChange={() => handleColorFilter(color.toLowerCase())}
                      className="w-4 h-4 accent-primary text-black border-gray-300 focus:ring-black rounded"
                    />
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 border border-gray-200"
                        style={{
                          backgroundColor:
                            color.toLowerCase() === "multicolor"
                              ? "linear-gradient(45deg, red, blue, green, yellow)"
                              : color.toLowerCase(),
                        }}
                      ></div>
                      <span className="lv-body hover:text-primary font-mono lv-transition text-sm text-gray-600 group-hover:text-black transition-colors duration-200">
                        {color}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Main Content */}
        <div className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <ProductSkeleton />
                </div>
              ))}
            </div>
          ) : (
            <>
              {products?.length === 0 ? (
                <div className="text-center py-20">
                  <div className="bg-white border border-gray-100 p-16 max-w-lg mx-auto">
                    <div className="w-24 h-24 border-2 border-dashed border-gray-300 flex items-center justify-center mx-auto mb-8">
                      <Search className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-light uppercase tracking-[0.2em] text-black mb-4">
                      No Products Found
                    </h3>
                    <div className="w-12 h-px bg-gray-300 mx-auto mb-6"></div>
                    <p className="text-gray-600 mb-6 text-sm uppercase tracking-wider">
                      We couldn't find any products matching "{searchQuery}"
                    </p>
                    <p className="text-gray-500 text-xs uppercase tracking-wider">
                      Try adjusting your search terms or browse our categories
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {products?.map((product, index) => (
                      <div
                        key={product.id}
                        className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <ProductCard product={product} />
                      </div>
                    ))}
                  </div>

                  {products &&
                    products.length > 0 &&
                    products.length < total && (
                      <div className="text-center mt-12">
                        <button className="bg-gradient-to-r from-primary to-purple-600 text-white px-8 py-4 text-sm font-medium rounded-2xl hover:from-primary/90 hover:to-purple-600/90 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                          Load More Products
                        </button>
                      </div>
                    )}
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* Enhanced Mobile Filter Overlay */}
      {showMobileFilters && (
        <div className="fixed inset-0 bg-black/50 z-50 lg:hidden animate-in fade-in duration-300">
          <div className="p-6 h-full overflow-y-auto absolute right-0 top-0 w-full max-w-sm bg-white shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between mb-6">
              <h2 className="lv-luxury mb-4 text-lg font-bold text-primary bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text">
                Filters
              </h2>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="lv-luxury text-sm font-bold mb-3 text-gray-700">
                  Search Again
                </h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target as HTMLFormElement);
                    const newQuery = formData.get("mobileSearch") as string;
                    if (newQuery.trim()) {
                      navigate(
                        `/search?q=${encodeURIComponent(newQuery.trim())}`,
                      );
                      setShowMobileFilters(false);
                    }
                  }}
                  className="relative"
                >
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    name="mobileSearch"
                    type="text"
                    placeholder="Search products..."
                    className="lv-body text-gray-500 hover:text-primary font-mono lv-transition w-full pl-10 pr-4 py-3 border border-gray-200 rounded-full focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                  />
                </form>
              </div>

              {/* Mobile filters */}
              <div className="space-y-6">
                <div>
                  <h3 className="lv-luxury text-sm font-bold mb-3 text-gray-700">
                    Category
                  </h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        handleFilterChange("category", "all");
                        setShowMobileFilters(false);
                      }}
                      className="lv-body text-gray-500 hover:text-primary font-mono lv-transition block w-full text-left py-3 px-4 text-sm rounded-full hover:bg-primary/5 transition-all duration-200 border border-gray-100"
                    >
                      All ({filterData?.total || 0})
                    </button>
                    {Object.entries(categories).map(
                      ([category, count], index) => (
                        <button
                          key={category}
                          onClick={() => {
                            handleFilterChange("category", category);
                            setShowMobileFilters(false);
                          }}
                          className="lv-body text-gray-500 hover:text-primary font-mono lv-transition block w-full text-left py-3 px-4 text-sm rounded-full hover:bg-primary/5 transition-all duration-200 border border-gray-100 animate-in fade-in slide-in-from-bottom-2 capitalize"
                          style={{ animationDelay: `${(index + 1) * 100}ms` }}
                        >
                          {category.replace(/-/g, " ")} ({count})
                        </button>
                      ),
                    )}
                  </div>
                </div>

                {["materials", "colors"].map((filterType) => (
                  <div key={filterType}>
                    <h3 className="lv-luxury text-sm font-bold mb-3 text-gray-700">
                      {filterType === "materials" ? "Material" : "Color"}
                    </h3>
                    <div className="space-y-2">
                      {(filterType === "materials" ? materials : colors).map(
                        (item) => (
                          <label
                            key={item}
                            className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                          >
                            <input
                              type="checkbox"
                              checked={
                                filterType === "materials"
                                  ? filters.materials.includes(
                                      item.toLowerCase(),
                                    )
                                  : filters.colors.includes(item.toLowerCase())
                              }
                              onChange={() =>
                                filterType === "materials"
                                  ? handleMaterialFilter(item.toLowerCase())
                                  : handleColorFilter(item.toLowerCase())
                              }
                              className="w-4 h-4 text-primary rounded border-gray-300"
                            />
                            <span className="text-sm lv-body text-gray-500 hover:text-primary font-mono lv-transition">
                              {item}
                            </span>
                          </label>
                        ),
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 space-y-3 pt-6 border-t border-gray-100">
              <button
                onClick={clearAllFilters}
                className="w-full lv-luxury text-md font-bold py-3 border border-gray-300 text-sm rounded-full hover:bg-gray-50 transition-colors duration-200"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
