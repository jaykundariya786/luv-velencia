
import { useQuery } from '@tanstack/react-query';
import { materialsCareAPI } from '@/services/api';

export function useMaterialsCare() {
  return useQuery({
    queryKey: ['materials-care'],
    queryFn: () => materialsCareAPI.getMaterialsCare(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useMaterialsCareById(id: string) {
  return useQuery({
    queryKey: ['materials-care', id],
    queryFn: () => materialsCareAPI.getMaterialsCareById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
