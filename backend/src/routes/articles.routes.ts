import { Router } from 'express';
import {
  analyzeAndStoreArticle,
  getArticles
} from '../controllers/articles.controller.js';

export const articlesRouter = Router();

articlesRouter.get('/articles', getArticles);
articlesRouter.post('/analyze', analyzeAndStoreArticle);
