
import { useQuery } from '@tanstack/react-query';
import { getAccountMenu } from '@/services/api';

export const useAccountMenu = () => {
  return useQuery({
    queryKey: ['accountMenu'],
    queryFn: getAccountMenu,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};
