import { useState, useEffect } from "react";
import Hero from "@/components/hero";
import ProductGrid from "@/components/product-grid";
import Filters from "@/components/filters";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { fetchProducts } from "@/store/slices/productsSlice";

export default function Home() {
  const dispatch = useAppDispatch();
  const { products, isLoading, error } = useAppSelector((state) => state.products);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: undefined as string | undefined,
    line: undefined as string | undefined,
    sort: "newest" as string,
    search: undefined as string | undefined,
  });

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMobileMenuOpen(false);
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  // Prevent body scroll when overlays are open
  useEffect(() => {
    if (isMobileMenuOpen || isSearchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMobileMenuOpen, isSearchOpen]);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (isLoading && !products?.length) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-2 text-sm lv-body text-gray-500">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <Hero />
      <Filters
        filters={filters}
        onFiltersChange={setFilters}
        totalProducts={products?.length || 0}
      />
      <ProductGrid
        filters={filters}
        products={products}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}