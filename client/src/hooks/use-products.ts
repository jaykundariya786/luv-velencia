import { useQuery } from "@tanstack/react-query";
import { type Product } from "@shared/schema";

interface UseProductsFilters {
  category?: string;
  line?: string;
  sort?: string;
  search?: string;
  colors?: string[];
  materials?: string[];
  limit?: number;
  offset?: number;
}

export function useProducts(
  filters?: UseProductsFilters,
  showAll: boolean = false
) {
  const queryParams = new URLSearchParams();

  if (filters?.category) {
    queryParams.append("category", filters.category);
  }
  if (filters?.line) {
    queryParams.append("line", filters.line);
  }
  if (filters?.sort) {
    queryParams.append("sort", filters.sort);
  }
  if (filters?.search) {
    queryParams.append("search", filters.search);
  }
  if (filters?.colors && filters.colors.length > 0) {
    queryParams.append("colors", filters.colors.join(","));
  }
  if (filters?.materials && filters.materials.length > 0) {
    queryParams.append("materials", filters.materials.join(","));
  }
  if (filters?.limit) {
    queryParams.append("limit", filters.limit.toString());
  }
  if (filters?.offset) {
    queryParams.append("offset", filters.offset.toString());
  }

  const queryString = queryParams.toString();
  const url = `/api/products${queryString ? `?${queryString}` : ""}`;

  return useQuery<{ products: Product[]; total: number }>({
    queryKey: [url, showAll, filters],
    queryFn: async () => {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useProduct(id: number) {
  return useQuery<Product>({
    queryKey: [`/api/products/${id}`],
    queryFn: async () => {
      const response = await fetch(`/api/products/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch product");
      }
      return response.json();
    },
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
}

export function useSavedItems() {
  return useQuery<Product[]>({
    queryKey: ["/api/saved-items"],
    queryFn: async () => {
      const response = await fetch("/api/saved-items");
      if (!response.ok) {
        throw new Error("Failed to fetch saved items");
      }
      return response.json();
    },
    staleTime: 1 * 60 * 1000,
  });
}

export function useRecentlyViewed() {
  return useQuery<Product[]>({
    queryKey: ["/api/recently-viewed"],
    queryFn: async () => {
      const response = await fetch("/api/recently-viewed");
      if (!response.ok) {
        throw new Error("Failed to fetch recently viewed items");
      }
      return response.json();
    },
    staleTime: 30 * 1000,
  });
}