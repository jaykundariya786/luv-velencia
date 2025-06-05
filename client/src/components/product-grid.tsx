import { useState } from "react";
import { useProducts } from "@/hooks/use-products";
import ProductCard from "./product-card";
import ProductSkeleton from "./product-skeleton";

interface ProductGridProps {
  filters: {
    category?: string;
    line?: string;
    sort: string;
    search?: string;
    colors?: string[];
    materials?: string[];
  };
}

export default function ProductGrid({ filters }: ProductGridProps) {
  const [showAll, setShowAll] = useState(false);
  const [initialLimit] = useState(12); // Show 12 products initially
  
  const productFilters = {
    ...filters,
    ...(showAll ? {} : { limit: initialLimit, offset: 0 })
  };
  
  const { data, isLoading, error, refetch } = useProducts(productFilters);
  const products = data?.products || [];
  const total = data?.total || 0;

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-600">
          Failed to load products. Please try again.
        </p>
      </div>
    );
  }

  return (
    <main className="mx-auto px-4 pb-12">
      {isLoading ? (
        <ProductSkeleton count={12} />
      ) : (
        <>
          {products?.length === 0 && (
            <div className="text-center py-16 lv-fade-in">
              <p className="text-gray-600 text-lg lv-body">
                No products found matching your criteria.
              </p>
              <p className="text-gray-500 text-sm mt-2 lv-body">
                Try adjusting your filters or search terms.
              </p>
            </div>
          )}

          <div className="product-grid gap-2">
            {products?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {products && products.length > 0 && !showAll && products.length < total && (
            <div className="text-center mt-12 lv-fade-in delay-300">
              <button 
                onClick={() => {
                  setShowAll(true);
                  // Refetch all products without limit
                  refetch();
                }}
                className="bg-primary text-primary-foreground px-8 py-3 lv-luxury rounded-full text-sm hover:bg-primary/90 lv-transition lv-hover"
              >
                LOAD ALL ({total - products.length} more)
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}