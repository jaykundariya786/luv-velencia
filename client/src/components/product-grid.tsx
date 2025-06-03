import { useProducts } from "@/hooks/use-products";
import ProductCard from "./product-card";
import { Skeleton } from "@/components/ui/skeleton";

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
  const { data: products, isLoading, error } = useProducts(filters);

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
        <div className="product-grid">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="aspect-square w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          ))}
        </div>
      ) : (
        <>
          {products?.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-600 text-lg">
                No products found matching your criteria.
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Try adjusting your filters or search terms.
              </p>
            </div>
          )}

          <div className="product-grid">
            {products?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {products && products.length > 0 && (
            <div className="text-center mt-12">
              <button className="bg-black text-white px-8 py-3 text-sm font-medium hover:bg-gray-800 transition-colors gucci-button">
                LOAD MORE
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}
