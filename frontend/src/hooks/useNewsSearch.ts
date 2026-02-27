import { useQuery } from '@tanstack/react-query';
import { fetchNews } from '../api/news';

export const useNewsSearch = (query: string, page: number) =>
  useQuery({
    queryKey: ['news', query, page],
    queryFn: () => fetchNews(query, page),
    enabled: query.trim().length > 1,
    staleTime: 60_000
  });
