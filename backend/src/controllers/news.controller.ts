import type { Request, Response, NextFunction } from 'express';
import { searchNews } from '../services/news.service.js';

export const getNews = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const query = String(req.query.q ?? 'technology').trim();
    const max = Number(req.query.max ?? 10);
    const page = Number(req.query.page ?? 1);

    if (!query) {
      res.status(400).json({ error: 'Query is required' });
      return;
    }

    const normalizedMax = Math.min(Math.max(max, 1), 10);
    const normalizedPage = Math.max(page, 1);

    const result = await searchNews(query, normalizedMax, normalizedPage);
    const hasMoreByCount = result.articles.length === normalizedMax;
    const hasMore =
      hasMoreByCount &&
      (typeof result.totalArticles !== 'number' ||
        normalizedPage * normalizedMax < result.totalArticles);

    const total = hasMoreByCount
      ? (result.totalArticles ?? null)
      : (normalizedPage - 1) * normalizedMax + result.articles.length;

    res.json({
      articles: result.articles,
      page: normalizedPage,
      total,
      pageSize: normalizedMax,
      hasMore
    });
  } catch (error) {
    next(error);
  }
};
