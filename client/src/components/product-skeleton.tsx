
import { Skeleton } from "@/components/ui/skeleton";

interface ProductSkeletonProps {
  count?: number;
}

export default function ProductSkeleton({ count = 8 }: ProductSkeletonProps) {
  return (
    <div className="product-grid gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-3 animate-pulse">
          {/* Image skeleton with shimmer effect */}
          <div className="relative aspect-square w-full bg-gray-200 rounded-lg overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
          </div>
          
          {/* Product name skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4 bg-gray-200" />
            <Skeleton className="h-3 w-1/2 bg-gray-200" />
          </div>
          
          {/* Price skeleton */}
          <Skeleton className="h-4 w-1/4 bg-gray-200" />
          
          {/* Heart icon skeleton */}
          <div className="flex justify-end">
            <Skeleton className="h-5 w-5 rounded-full bg-gray-200" />
          </div>
        </div>
      ))}
    </div>
  );
}
