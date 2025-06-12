import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface FiltersProps {
  filters: {
    category?: string;
    line?: string;
    sort: string;
    search?: string;
  };
  onFiltersChange: (filters: any) => void;
}

export default function Filters({ filters, onFiltersChange }: FiltersProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);

  // Fetch dynamic filter data with counts
  const { data: filterData, isLoading, error } = useQuery({
    queryKey: ['filter-data'],
    queryFn: async () => {
      try {
        const response = await fetch('/lv-api/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        const products = data.products || [];

        // Calculate category counts
        const categoryCounts = products.reduce((acc: any, product: any) => {
          const category = product.category?.toLowerCase() || 'uncategorized';
          acc[category] = (acc[category] || 0) + 1;
          return acc;
        }, {});

        // Calculate line counts - handle both string and parsed JSON
        const lineCounts = products.reduce((acc: any, product: any) => {
          const line = product.line?.toLowerCase();
          if (line) {
            acc[line] = (acc[line] || 0) + 1;
          }
          return acc;
        }, {});

        // Get unique colors - handle both string and parsed JSON
        const uniqueColors = [...new Set(
          products.flatMap((product: any) => {
            let colors = product.colors;
            if (typeof colors === 'string') {
              try {
                colors = JSON.parse(colors);
              } catch {
                colors = [colors];
              }
            }
            return Array.isArray(colors) ? colors.map((color: string) => color.toLowerCase()) : [];
          })
        )].sort();

        // Get unique materials - handle both string and parsed JSON
        const uniqueMaterials = [...new Set(
          products.flatMap((product: any) => {
            let materials = product.materials;
            if (typeof materials === 'string') {
              try {
                materials = JSON.parse(materials);
              } catch {
                materials = [materials];
              }
            }
            return Array.isArray(materials) ? materials.map((material: string) => material.toLowerCase()) : [];
          })
        )].sort();

        // If no data found, provide default categories based on common fashion categories
        const defaultCategories = {
          'shoes': 0,
          'clothing': 0,
          'accessories': 0,
          'bags': 0,
          'jewelry': 0
        };

        const defaultLines = {
          'premium': 0,
          'classic': 0,
          'modern': 0,
          'luxury': 0
        };

        const defaultColors = ['black', 'white', 'brown', 'blue', 'red', 'green', 'pink', 'gray'];
        const defaultMaterials = ['leather', 'cotton', 'silk', 'wool', 'polyester', 'denim'];

        return {
          total: products.length,
          categories: Object.keys(categoryCounts).length > 0 ? categoryCounts : defaultCategories,
          lines: Object.keys(lineCounts).length > 0 ? lineCounts : defaultLines,
          colors: uniqueColors.length > 0 ? uniqueColors : defaultColors,
          materials: uniqueMaterials.length > 0 ? uniqueMaterials : defaultMaterials
        };
      } catch (error) {
        console.error('Error fetching filter data:', error);
        // Return default data structure if API fails
        return {
          total: 0,
          categories: {
            'shoes': 0,
            'clothing': 0,
            'accessories': 0,
            'bags': 0,
            'jewelry': 0
          },
          lines: {
            'premium': 0,
            'classic': 0,
            'modern': 0,
            'luxury': 0
          },
          colors: ['black', 'white', 'brown', 'blue', 'red', 'green', 'pink', 'gray'],
          materials: ['leather', 'cotton', 'silk', 'wool', 'polyester', 'denim']
        };
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Add debug logging
  console.log('Filter data:', filterData);
  console.log('Is loading:', isLoading);
  console.log('Error:', error);

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = {
      ...filters,
      [key]: value === "all" ? undefined : value.toLowerCase(),
    };
    onFiltersChange(newFilters);
    setOpenDropdown(null);
  };

  const handleColorChange = (color: string, checked: boolean) => {
    let newColors;
    if (color === "all") {
      newColors = checked ? [] : [];
      setSelectedColors([]);
    } else {
      if (checked) {
        newColors = [...selectedColors, color];
      } else {
        newColors = selectedColors.filter((c) => c !== color);
      }
      setSelectedColors(newColors);
    }

    onFiltersChange((prev: any) => ({
      ...prev,
      colors: newColors.length > 0 ? newColors : undefined,
    }));
  };

  const handleMaterialChange = (material: string, checked: boolean) => {
    let newMaterials;
    if (material === "all") {
      newMaterials = checked ? [] : [];
      setSelectedMaterials([]);
    } else {
      if (checked) {
        newMaterials = [...selectedMaterials, material];
      } else {
        newMaterials = selectedMaterials.filter((m) => m !== material);
      }
      setSelectedMaterials(newMaterials);
    }

    onFiltersChange((prev: any) => ({
      ...prev,
      materials: newMaterials.length > 0 ? newMaterials : undefined,
    }));
  };

  const applyFilters = () => {
    setOpenDropdown(null);
  };

  const clearFilters = () => {
    setSelectedColors([]);
    setSelectedMaterials([]);
    onFiltersChange((prev: any) => ({
      ...prev,
      colors: undefined,
      materials: undefined,
    }));
    setOpenDropdown(null);
  };

  const toggleDropdown = (dropdown: string) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getSortLabel = () => {
    switch (filters.sort) {
      case "price-low":
        return "PRICE: LOW TO HIGH";
      case "price-high":
        return "PRICE: HIGH TO LOW";
      case "popular":
        return "MOST POPULAR";
      default:
        return "NEWEST";
    }
  };

  const getCategoryLabel = () => {
    if (!filters.category) return "CATEGORY";
    return filters.category.replace(/-/g, ' ').toUpperCase();
  };

  const getLineLabel = () => {
    if (!filters.line) return "LINE";
    return filters.line.replace(/-/g, ' ').toUpperCase();
  };

  return (
    <div
      className="sticky top-[67px] md:top-[72px] bg-white z-30 mx-auto px-8 py-4 sm:flex items-center sm:space-x-8"
      ref={dropdownRef}
    >
      <div className="relative">
        <button
          onClick={() => toggleDropdown("category")}
          className={`flex items-center text-xs font-medium transition-all duration-300 hover:scale-105 hover:text-primary ${
            filters.category ? 'text-primary' : 'text-black'
          }`}
        >
          <span className="lv-luxury text-xs font-bold">
            {getCategoryLabel()}
          </span>
          <ChevronDown className={`w-3 h-3 ml-1 transition-transform duration-200 ${
            openDropdown === "category" ? "rotate-180" : ""
          }`} />
        </button>
        {openDropdown === "category" && (
          <div className="lv-body text-black rounded-3xl overflow-hidden font-mono absolute top-full left-0 mt-2 bg-white border border-gray-200 shadow-lg z-10 min-w-60 opacity-100 transform translate-y-0 transition-all duration-200">
            <button
              onClick={() => handleFilterChange("category", "all")}
              className="block w-full text-left px-4 py-3 text-xs hover:bg-primary/30"
            >
              All ({filterData?.total || 0})
            </button>
            {filterData?.categories && Object.keys(filterData.categories).length > 0 ? 
              Object.entries(filterData.categories).map(([category, count]) => (
                <button
                  key={category}
                  onClick={() => handleFilterChange("category", category)}
                  className="block w-full text-left px-4 py-3 text-xs hover:bg-primary/30 capitalize"
                >
                  {category.replace(/-/g, ' ')} ({count})
                </button>
              )) : (
                <div className="px-4 py-3 text-xs text-gray-500">
                  Loading categories...
                </div>
              )
            }
          </div>
        )}
      </div>

      {/* Line */}
      <div className="relative">
        <button
          onClick={() => toggleDropdown("line")}
          className={`flex items-center text-xs font-medium transition-all duration-300 hover:scale-105 hover:text-primary ${
            filters.line ? 'text-primary' : 'text-black'
          }`}
        >
          <span className="lv-luxury text-xs font-bold">
            {getLineLabel()}
          </span>
          <ChevronDown className={`w-3 h-3 ml-1 transition-transform duration-200 ${
            openDropdown === "line" ? "rotate-180" : ""
          }`} />
        </button>
        {openDropdown === "line" && (
          <div className="lv-body text-black rounded-3xl overflow-hidden font-mono absolute top-full left-0 mt-2 bg-white border border-gray-200 shadow-lg z-10 min-w-60 opacity-100 transform translate-y-0 transition-all duration-200">
            <button
              onClick={() => handleFilterChange("line", "all")}
              className="block w-full text-left px-4 py-3 text-xs hover:bg-primary/30"
            >
              All
            </button>
            {filterData?.lines && Object.keys(filterData.lines).length > 0 ? 
              Object.entries(filterData.lines).map(([line, count]) => (
                <button
                  key={line}
                  onClick={() => handleFilterChange("line", line)}
                  className="block w-full text-left px-4 py-3 text-xs hover:bg-primary/30 capitalize"
                >
                  {line.replace(/-/g, ' ')} ({count})
                </button>
              )) : (
                <div className="px-4 py-3 text-xs text-gray-500">
                  Loading lines...
                </div>
              )
            }
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="relative">
        <button
          onClick={() => toggleDropdown("filters")}
          className={`flex items-center text-xs font-medium transition-all duration-300 hover:scale-105 hover:text-primary ${
            (selectedColors.length > 0 || selectedMaterials.length > 0) ? 'text-primary' : 'text-black'
          }`}
        >
          <span className="lv-luxury text-xs font-bold">
            FILTERS
            {(selectedColors.length > 0 || selectedMaterials.length > 0) && (
              <span className="ml-1 bg-primary text-white text-xs rounded-full px-2 py-0.5">
                {selectedColors.length + selectedMaterials.length}
              </span>
            )}
          </span>
          <ChevronDown className={`w-3 h-3 ml-1 transition-transform duration-200 ${
            openDropdown === "filters" ? "rotate-180" : ""
          }`} />
        </button>
        {openDropdown === "filters" && (
          <div className="lv-body text-black p-8 rounded-3xl overflow-hidden font-mono absolute top-full left-0 mt-2 bg-white border border-gray-200 shadow-lg z-10 min-w-60 opacity-100 transform translate-y-0 transition-all duration-200">
            <div className="grid grid-cols-2 gap-8">
              {/* Color Section */}
              <div>
                <h4 className="mb-4 text-center lv-luxury text-xs font-bold text-black">
                  COLOR
                </h4>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedColors.length === 0}
                      onChange={(e) =>
                        handleColorChange("all", e.target.checked)
                      }
                      className="mr-3 w-4 h-4 accent-primary"
                    />
                    <span className="text-xs">All</span>
                  </label>
                  {(filterData?.colors || []).length > 0 ? 
                    (filterData?.colors || []).map((color) => (
                      <label key={color} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedColors.includes(color.toLowerCase())}
                          onChange={(e) =>
                            handleColorChange(
                              color.toLowerCase(),
                              e.target.checked
                            )
                          }
                          className="mr-3 w-4 h-4 accent-primary"
                        />
                        <span className="text-xs lv-body font-mono text-foreground capitalize">
                          {color}
                        </span>
                      </label>
                    )) : (
                      <div className="text-xs text-gray-500">Loading colors...</div>
                    )
                  }
                </div>
              </div>

              {/* Material Section */}
              <div>
                <h4 className="mb-4 text-center lv-luxury text-xs font-bold text-black">
                  MATERIAL
                </h4>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedMaterials.length === 0}
                      onChange={(e) =>
                        handleMaterialChange("all", e.target.checked)
                      }
                      className="mr-3 w-4 h-4 accent-primary"
                    />
                    <span className="text-xs">All</span>
                  </label>
                  {(filterData?.materials || []).length > 0 ? 
                    (filterData?.materials || []).map((material) => (
                      <label key={material} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedMaterials.includes(
                            material.toLowerCase()
                          )}
                          onChange={(e) =>
                            handleMaterialChange(
                              material.toLowerCase(),
                              e.target.checked
                            )
                          }
                          className="mr-3 w-4 h-4 accent-primary"
                        />
                        <span className="text-xs lv-body font-mono text-foreground capitalize">
                          {material}
                        </span>
                      </label>
                    )) : (
                      <div className="text-xs text-gray-500">Loading materials...</div>
                    )
                  }
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-xs lv-body font-mono text-foreground text-gray-500 mb-4">
                You can select several options at once.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={clearFilters}
                  className="bg-primary text-white rounded-full px-6 py-2 text-xs font-mono"
                >
                  CLEAR
                </button>
                <button
                  onClick={() => setOpenDropdown(null)}
                  className="bg-white text-primary border-primary border rounded-full px-6 py-2 text-xs font-mono"
                >
                  CLOSE
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sort */}
      <div className="relative">
        <button
          onClick={() => toggleDropdown("sort")}
          className="flex items-center text-xs font-medium text-black transition-all duration-300 hover:scale-105 hover:text-primary"
        >
          <span className="lv-luxury text-xs font-bold text-black">
            SORT BY :
          </span>
          <span className="ml-1 text-primary lv-luxury text-xs font-bold">
            {getSortLabel()}
          </span>
          <ChevronDown className={`w-3 h-3 ml-1 transition-transform duration-200 ${
            openDropdown === "sort" ? "rotate-180" : ""
          }`} />
        </button>
        {openDropdown === "sort" && (
          <div className="lv-body text-black rounded-3xl overflow-hidden font-mono absolute top-full left-0 mt-2 bg-white border border-gray-200 shadow-lg z-10 min-w-60 opacity-100 transform translate-y-0 transition-all duration-200">
            <button
              onClick={() => handleFilterChange("sort", "newest")}
              className="block w-full text-left px-4 py-3 text-xs hover:bg-primary/30"
            >
              Newest
            </button>
            <button
              onClick={() => handleFilterChange("sort", "price-high")}
              className="block w-full text-left px-4 py-3 text-xs hover:bg-primary/30"
            >
              Price - High to Low
            </button>
            <button
              onClick={() => handleFilterChange("sort", "price-low")}
              className="block w-full text-left px-4 py-3 text-xs hover:bg-primary/30"
            >
              Price - Low to High
            </button>
          </div>
        )}
      </div>
    </div>
  );
}