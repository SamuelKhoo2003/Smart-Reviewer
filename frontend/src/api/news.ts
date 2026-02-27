import { apiClient } from './client';
import type { NewsArticle } from '../types';

interface NewsResponse {
  articles: NewsArticle[];
  page: number;
  total: number | null;
  pageSize: number;
  hasMore: boolean;
}

export interface NewsSearchResult {
  articles: NewsArticle[];
  page: number;
  total: number | null;
  pageSize: number;
  hasMore: boolean;
}

export const fetchNews = async (query: string, page: number): Promise<NewsSearchResult> => {
  const { data } = await apiClient.get<NewsResponse>('/news', {
    params: { q: query, max: 10, page }
  });
  return data;
};
