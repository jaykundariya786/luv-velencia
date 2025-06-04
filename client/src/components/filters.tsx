import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

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

  const handleFilterChange = (key: string, value: string) => {
    onFiltersChange((prev: any) => ({
      ...prev,
      [key]: value === "all" ? undefined : value,
    }));
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
    switch (filters.category) {
      case "shoes":
        return "SHOES";
      case "clothing":
        return "CLOTHING";
      case "accessories":
        return "ACCESSORIES";
      case "bags":
        return "BAGS";
      case "jewelry":
        return "JEWELRY";
      default:
        return "CATEGORY";
    }
  };

  const getLineLabel = () => {
    if (!filters.line) return "LINE";
    switch (filters.line) {
      case "gucci-re-web":
        return "GUCCI RE-WEB";
      case "ophidia":
        return "OPHIDIA";
      case "gg-canvas":
        return "GG CANVAS";
      case "staffa":
        return "STAFFA";
      case "chroma":
        return "CHROMA";
      default:
        return "LINE";
    }
  };

  return (
    <div
      className="sticky top-[67px] md:top-[72px] bg-white z-30 mx-auto px-8 py-4 sm:flex items-center sm:space-x-8"
      ref={dropdownRef}
    >
      <div className="relative">
        <button
          onClick={() => toggleDropdown("category")}
          className="flex items-center text-xs font-medium text-black"
        >
          <span className="lv-luxury text-xs font-bold text-black">
            {getCategoryLabel()}
          </span>
          <ChevronDown className="w-3 h-3 ml-1" />
        </button>
        {openDropdown === "category" && (
          <div className="lv-body text-black rounded-3xl overflow-hidden  font-mono lv-transition absolute top-full left-0 mt-2 bg-white border border-gray-200 shadow-lg z-10 min-w-60">
            <button
              onClick={() => handleFilterChange("category", "all")}
              className="block w-full text-left px-4 py-3 text-xs hover:bg-primary/30 "
            >
              All (83)
            </button>
            <button
              onClick={() => handleFilterChange("category", "shoes")}
              className="block w-full text-left px-4 py-3 text-xs hover:bg-primary/30"
            >
              Shoes (2)
            </button>
            <button
              onClick={() => handleFilterChange("category", "clothing")}
              className="block w-full text-left px-4 py-3 text-xs hover:bg-primary/30"
            >
              Clothing (6)
            </button>
            <button
              onClick={() => handleFilterChange("category", "bags")}
              className="block w-full text-left px-4 py-3 text-xs hover:bg-primary/30"
            >
              Bags (2)
            </button>
            <button
              onClick={() => handleFilterChange("category", "jewelry")}
              className="block w-full text-left px-4 py-3 text-xs hover:bg-primary/30"
            >
              Jewelry (2)
            </button>
            <button
              onClick={() => handleFilterChange("category", "accessories")}
              className="block w-full text-left px-4 py-3 text-xs hover:bg-primary/30"
            >
              Accessories (0)
            </button>
          </div>
        )}
      </div>

      {/* Line */}
      <div className="relative">
        <button
          onClick={() => toggleDropdown("line")}
          className="flex items-center text-xs font-medium hover:text-black"
        >
          <span className="lv-luxury text-xs font-bold text-black">
            {getLineLabel()}
          </span>
          <ChevronDown className="w-3 h-3 ml-1" />
        </button>
        {openDropdown === "line" && (
          <div className="lv-body text-black rounded-3xl overflow-hidden  font-mono lv-transition absolute top-full left-0 mt-2 bg-white border border-gray-200 shadow-lg z-10 min-w-60">
            <button
              onClick={() => handleFilterChange("line", "all")}
              className="block w-full text-left px-4 py-3 text-xs hover:bg-primary/30"
            >
              All
            </button>
            <button
              onClick={() => handleFilterChange("line", "gucci-re-web")}
              className="block w-full text-left px-4 py-3 text-xs hover:bg-primary/30"
            >
              Gucci Re-Web (1)
            </button>
            <button
              onClick={() => handleFilterChange("line", "gg-canvas")}
              className="block w-full text-left px-4 py-3 text-xs hover:bg-primary/30"
            >
              GG Canvas (2)
            </button>
            <button
              onClick={() => handleFilterChange("line", "staffa")}
              className="block w-full text-left px-4 py-3 text-xs hover:bg-primary/30"
            >
              Staffa (2)
            </button>
            <button
              onClick={() => handleFilterChange("line", "ophidia")}
              className="block w-full text-left px-4 py-3 text-xs hover:bg-primary/30"
            >
              Ophidia (1)
            </button>
            <button
              onClick={() => handleFilterChange("line", "chroma")}
              className="block w-full text-left px-4 py-3 text-xs hover:bg-primary/30"
            >
              Chroma (1)
            </button>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="relative">
        <button
          onClick={() => toggleDropdown("filters")}
          className="flex items-center text-xs font-medium hover:text-black"
        >
          <span className="lv-luxury text-xs font-bold text-black">
            FILTERS
          </span>
          <ChevronDown className="w-3 h-3 ml-1" />
        </button>
        {openDropdown === "filters" && (
          <div className="lv-body text-black p-8 rounded-3xl overflow-hidden  font-mono lv-transition absolute top-full left-0 mt-2 bg-white border border-gray-200 shadow-lg z-10 min-w-60">
            <div className="grid grid-cols-2 gap-8">
              {/* Color Section */}
              <div>
                <h4 className="text-xs font-medium mb-4 text-center">COLOR</h4>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedColors.length === 0}
                      onChange={(e) =>
                        handleColorChange("all", e.target.checked)
                      }
                      className="mr-3 w-4 h-4"
                    />
                    <span className="text-xs">All</span>
                  </label>
                  {[
                    "Beige",
                    "Black",
                    "Blue",
                    "Brown",
                    "Green",
                    "Grey",
                    "Pink",
                    "Red",
                    "White",
                    "Yellow",
                  ].map((color) => (
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
                        className="mr-3 w-4 h-4"
                      />
                      <span className="text-xs">{color}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Material Section */}
              <div>
                <h4 className="text-xs font-medium mb-4 text-center">
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
                      className="mr-3 w-4 h-4"
                    />
                    <span className="text-xs">All</span>
                  </label>
                  {[
                    "Fabric",
                    "GG Canvas",
                    "Leather",
                    "Nylon",
                    "Ready-to-wear",
                    "Suede",
                  ].map((material) => (
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
                        className="mr-3 w-4 h-4"
                      />
                      <span className="text-xs">{material}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500 mb-4">
                You can select several options at once.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={clearFilters}
                  className="bg-black text-white px-6 py-2 text-xs font-medium hover:bg-gray-800"
                >
                  CLEAR
                </button>
                <button
                  onClick={() => setOpenDropdown(null)}
                  className="border border-gray-300 px-6 py-2 text-xs font-medium hover:bg-primary/30"
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
          className="flex items-center text-xs font-medium hover:text-black"
        >
          <span className="lv-luxury text-xs font-bold text-black">
            SORT BY :
          </span>
          <span className="ml-1 text-primary lv-luxury text-xs font-bold text-black">
            {getSortLabel()}
          </span>
          <ChevronDown className="w-3 h-3 ml-1" />
        </button>
        {openDropdown === "sort" && (
          <div className="lv-body text-black rounded-3xl overflow-hidden  font-mono lv-transition absolute top-full left-0 mt-2 bg-white border border-gray-200 shadow-lg z-10 min-w-60">
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
