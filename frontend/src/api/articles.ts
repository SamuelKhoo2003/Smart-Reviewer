import { apiClient } from './client';
import type { AnalyzePayload, StoredArticle } from '../types';

interface StoredArticlesResponse {
  articles: StoredArticle[];
  page: number;
  total: number;
  pageSize: number;
  hasMore: boolean;
}

export interface StoredArticlesResult {
  articles: StoredArticle[];
  page: number;
  total: number;
  pageSize: number;
  hasMore: boolean;
}

interface AnalyzeResponse {
  article: StoredArticle;
  cached: boolean;
}

export const fetchStoredArticles = async (page: number): Promise<StoredArticlesResult> => {
  const { data } = await apiClient.get<StoredArticlesResponse>('/articles', {
    params: { page }
  });
  return data;
};

export const analyzeArticle = async (
  payload: AnalyzePayload
): Promise<AnalyzeResponse> => {
  const { data } = await apiClient.post<AnalyzeResponse>('/analyze', payload);
  return data;
};
