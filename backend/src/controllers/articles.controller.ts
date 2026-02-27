import type { NextFunction, Request, Response } from 'express';
import { ArticleAnalysis } from '../models/ArticleAnalysis.js';
import { analyzeArticle } from '../services/genai.service.js';

export const getArticles = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = 10;
    const normalizedPage = Math.max(page, 1);

    const skip = (normalizedPage - 1) * limit;
    const articles = await ArticleAnalysis.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await ArticleAnalysis.countDocuments();
    const hasMore = skip + articles.length < total;

    res.json({
      articles,
      page: normalizedPage,
      total,
      pageSize: limit,
      hasMore
    });
  } catch (error) {
    next(error);
  }
};

export const analyzeAndStoreArticle = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { title, url, description } = req.body as {
      title?: string;
      url?: string;
      description?: string;
    };

    if (!title || !url) {
      res.status(400).json({ error: 'title and url are required' });
      return;
    }

    const existing = await ArticleAnalysis.findOne({ url }).lean();

    if (existing) {
      res.json({ article: existing, cached: true });
      return;
    }

    const analysis = await analyzeArticle({ title, url, description });

    const stored = await ArticleAnalysis.create({
      title,
      url,
      summary: analysis.summary,
      sentiment: analysis.sentiment
    });

    res.status(201).json({ article: stored, cached: false });
  } catch (error) {
    next(error);
  }
};
