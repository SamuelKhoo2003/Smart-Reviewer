export type Sentiment = 'positive' | 'neutral' | 'negative';

export interface NewsArticle {
  title: string;
  url: string;
  source: string;
  publishedAt: string;
  description: string;
  image?: string;
}

export interface AnalysisInput {
  title: string;
  url: string;
  description?: string;
}

export interface AnalyzeResponse {
  summary: string;
  sentiment: Sentiment;
}
