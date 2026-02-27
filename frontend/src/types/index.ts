export type Sentiment = 'positive' | 'neutral' | 'negative';

export interface NewsArticle {
  title: string;
  url: string;
  source: string;
  publishedAt: string;
  description: string;
  image?: string;
}

export interface StoredArticle {
  _id: string;
  title: string;
  url: string;
  summary: string;
  sentiment: Sentiment;
  createdAt: string;
}

export interface AnalyzePayload {
  title: string;
  url: string;
  description?: string;
}
