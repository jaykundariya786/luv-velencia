import { useState, useEffect } from "react";
import Hero from "@/components/hero";
import ProductGrid from "@/components/product-grid";
import Filters from "@/components/filters";

export default function Home() {
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

  return (
    <div className="min-h-screen bg-white">
      <Hero />

      <Filters filters={filters} onFiltersChange={setFilters} />

      <ProductGrid filters={filters} />
    </div>
  );
}
