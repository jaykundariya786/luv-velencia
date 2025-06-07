
import { useQuery } from '@tanstack/react-query';
import { getSearchSuggestions } from '@/services/api';

export const useSearchSuggestions = () => {
  return useQuery({
    queryKey: ['searchSuggestions'],
    queryFn: getSearchSuggestions,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
};
