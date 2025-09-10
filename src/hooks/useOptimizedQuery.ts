import { useQuery, useMutation, UseQueryOptions } from '@tanstack/react-query';
import { logger } from '@/utils/performance';

// Optimized query hook with better caching and error handling
export const useOptimizedQuery = <T>(
  key: string[],
  queryFn: () => Promise<T>,
  options?: Partial<UseQueryOptions<T>>
) => {
  return useQuery({
    queryKey: key,
    queryFn: async () => {
      try {
        logger.debug('Fetching data for:', key);
        const data = await queryFn();
        logger.debug('Data fetched successfully for:', key);
        return data;
      } catch (error) {
        logger.error('Query error for:', key, error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    refetchOnWindowFocus: false,
    ...options,
  });
};

// Optimized mutation hook
export const useOptimizedMutation = <T, V>(
  mutationFn: (variables: V) => Promise<T>,
  options?: any
) => {
  return useMutation({
    mutationFn: async (variables: V) => {
      try {
        logger.debug('Executing mutation with:', variables);
        const result = await mutationFn(variables);
        logger.debug('Mutation completed successfully');
        return result;
      } catch (error) {
        logger.error('Mutation error:', error);
        throw error;
      }
    },
    ...options,
  });
};