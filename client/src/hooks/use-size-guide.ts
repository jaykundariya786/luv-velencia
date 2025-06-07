
import { useQuery } from '@tanstack/react-query';
import { getSizeGuide } from '@/services/api';

export const useSizeGuide = (category: 'mens' | 'womens') => {
  return useQuery({
    queryKey: ['sizeGuide', category],
    queryFn: () => getSizeGuide(category),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};
