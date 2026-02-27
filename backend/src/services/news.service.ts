import axios from 'axios';
import { env } from '../config/env.js';
import type { NewsArticle } from '../types.js';

interface GNewsArticle {
  title: string;
  description: string;
  url: string;
  image?: string;
  publishedAt: string;
  source: {
    name: string;
    url: string;
  };
}

interface GNewsResponse {
  totalArticles?: number;
  articles: GNewsArticle[];
}

interface SearchNewsResult {
  articles: NewsArticle[];
  totalArticles?: number;
}

export const searchNews = async (
  query: string,
  max = 10,
  page = 1
): Promise<SearchNewsResult> => {
  const { data } = await axios.get<GNewsResponse>('https://gnews.io/api/v4/search', {
    params: {
      q: query,
      lang: 'en',
      max,
      page,
      sortby: 'publishedAt',
      token: env.newsApiKey
    },
    timeout: 10000
  });

  return {
    totalArticles: data.totalArticles,
    articles: data.articles.map((article) => ({
      title: article.title,
      description: article.description,
      url: article.url,
      source: article.source.name,
      publishedAt: article.publishedAt,
      image: article.image
    }))
  };
};
