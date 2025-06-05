
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductDetailSkeleton() {
  return (
    <div className="bg-white">
      {/* Hero image skeleton */}
      <div className="bg-gray-50 h-[90vh] flex items-center justify-center w-full">
        <Skeleton className="w-full h-full" />
      </div>

      {/* Product info skeleton */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left column - Image thumbnails */}
          <div className="space-y-4">
            <div className="flex gap-2 overflow-x-auto">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="w-20 h-20 flex-shrink-0" />
              ))}
            </div>
          </div>

          {/* Right column - Product details */}
          <div className="space-y-6">
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>

            {/* Size selection skeleton */}
            <div className="space-y-3">
              <Skeleton className="h-4 w-1/4" />
              <div className="flex gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="w-12 h-12" />
                ))}
              </div>
            </div>

            {/* Add to bag button skeleton */}
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
