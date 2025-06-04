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
            {products?.map((product, index) => (
              <ProductCard product={product} />
            ))}
          </div>

          {products && products.length > 0 && (
            <div className="text-center mt-12 lv-fade-in delay-300">
              <button className="bg-primary text-primary-foreground px-8 py-3 lv-luxury rounded-full text-sm hover:bg-primary/90 lv-transition lv-hover">
                LOAD MORE
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}
